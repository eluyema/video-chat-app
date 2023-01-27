import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { IMessage } from '../../common/types/message';
import { ChatWrapper } from "./Chat.styled";
import MessagesList from './components/MessagesList/MessagesList';
import SendMessageForm from "./components/SendMessageForm/SendMessageForm";

interface ChatProps {
    socket: Socket;
    displayName: string;
}

const Chat = ({ socket, displayName }: ChatProps) => {
    const {shareId} = useParams();
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(()=>{
        socket.on('message-recieve', ({displayName, message})=>{
            setMessages((messages)=>[...messages, {displayName, message}])
        })
        return () => {
            socket.off('')
        }
    },[])

    const sendMessage = (message: string) => {
        setMessages(messages=> [...messages, {displayName,message}])
        socket.emit('send-message-to-room', {
            shareId,
            displayName,
            message
        })
    }
    return <ChatWrapper>
        <MessagesList messages={messages}/>
        <SendMessageForm onSendMessage={sendMessage} />
    </ChatWrapper>
}

export default Chat;