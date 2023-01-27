import { IMessage } from "../../../../common/types/message";
import { MessageName, MessagesListWrapper, MessageWrapper, MessageBody } from "./MessagesList.styled";

interface MessagesListProps {
    messages: IMessage[]
}

const MessagesList = ({ messages }:MessagesListProps) => {
    return <MessagesListWrapper>
        {messages.map(({displayName, message})=> {
            return (<MessageWrapper>
                <MessageName>{displayName}</MessageName>
                <MessageBody>{message}</MessageBody>
            </MessageWrapper>)
        })}
    </MessagesListWrapper>
}

export default MessagesList;