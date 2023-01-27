import { Box } from '@mui/system';
import { useState, useEffect, useContext } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { connect, Room as RoomInstenceI} from "twilio-video";
import { SessionInfoI } from '../../common/types/sessions';
import Session from '../../components/Session/Session';
import { fetchSessionInfo } from '../../services/sessionsService';
import FreeAccessForm from './components/FreeAccessForm/FreeAccessForm';
import LoadingFrame from '../../components/LoadingFrame/LoadingFrame';
import BaseTextFrame from './components/BaseTextFrame/BaseTextFrame';
import { VideoSessionWrapper } from './VideoSession.styled';
import { UserContext } from '../../Providers/UserProvider/UserProvider';
import MySessionForm from './components/MySessionForm/MySessionForm';
import { SessionSecurityEnum } from '../../common/enums/sessions';
import PasswordAccessForm from './components/PasswordAccessForm/PasswordAccessForm';
import { AlertContext } from '../../Providers/AlertProvider/AlertProvider';
import UnregisteredFrame from './components/NotAllowedFrame/NotAllowedFrame';
import NotAllowedFrame from './components/NotAllowedFrame/NotAllowedFrame';
import PermissionAccessForm from './components/PermissionAccessForm/PermissionAccessForm';

const VideoSession = () => {
    const { shareId } = useParams();
    const { user, loading: userLoading } = useContext(UserContext);
    const { showAlert } = useContext(AlertContext);

    const [sessionInfo, setSessionInfo]= useState<SessionInfoI | null>(null)
    const [sessionLoading, setSessionLoading] = useState(true);
    const [twilioLoading, setTwilioLoading] = useState(false);
    const [customName, setCustomName] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState<RoomInstenceI | null>(null);
    const [lastPong, setLastPong] = useState<string | null>(null);
    const [twilioToken, setTwilioToken] = useState("")
    const [roomName, setRoomName] = useState("")

    useEffect(()=>{
      if(!shareId){
        return;
      }

      fetchSessionInfo(shareId).then(
        res => {
          setSessionInfo(res);
        }
      ).finally(()=>{
        setSessionLoading(false);
      })
    },[shareId])
    
    const socketConnect = () => {
      const socket = io(process.env.REACT_APP_WEBSOCKET_URL as string, {
        withCredentials: true,
      });
      setSocket(socket);
      socket.on('connect', () => {
        setIsConnected(true);
      });
  
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
  
      socket.on('pong', () => {
        setLastPong(new Date().toISOString());
      });

      socket.on('message', (res) => { 
        try{
          const { data } = JSON.parse(res);
          if(data && data.status && data.status === 403) {
            showAlert("error","Password is wrong", 6);
          }
          else if(data && data.status && data.status === 409) {
            showAlert("error","Someone already joined with the same name. Please, change name", 6);
          } else {
            showAlert("error","Something goes wrong", 6);
          }
        } catch (e) {
          showAlert("error","Something goes wrong", 6);
        }
      });

      socket.on('success-join', (data) => {
        setTwilioToken(data.videoToken)
        setRoomName(data.roomName);
      });

      return socket;
    }

    useEffect(() => {
      if(!sessionInfo) {
        return;
      }
      const socket = socketConnect();
      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('pong');
      };
    }, [sessionInfo]);


    useEffect(()=> {
      if(twilioToken && roomName && !twilioLoading) {
        setTwilioLoading(true)
        connect(twilioToken, {
          name: 'cool-room',
          audio: true,
          video: true
        }).then(room=>{
          setRoom(room)
        }).finally(()=>{
          setTwilioLoading(false)
        });
      }
      return () => {
        setRoom(null);
      }
    },[twilioToken, roomName])
  
    const sendJoinRequest = (params: any) => {
      if(params.displayName) {
        setCustomName(params.displayName as string);
      }
      if(socket){
        socket.emit('join-room', {shareId, ...params});
      }
    }

    const loadingDescription: string = sessionLoading && "Looking for session details" ||
      twilioLoading && "Connection to session" || userLoading && "Recognition of your profile" ||
      ""
    const isMySession = sessionInfo && user && user.email === sessionInfo.authorEmail;

    const handledAskDecline = async ( ) => {
      if(socket) {
        socket.emit('decline-asking-permission', {
          shareId
        })
        setIsConnected(false);
        socket.disconnect();
        socketConnect();
      }
    }

    const handleStartSession = () => {
      socket?.emit('start-call', { shareId });
    }

    const getAccessForm = () => {
      if(!(!twilioLoading && !room && !userLoading && sessionInfo !== null && isConnected)) {
        return false;
      }

      if(isMySession) {
        return <MySessionForm
          isJoinCall={sessionInfo.isRanning}
          sessionInfo={sessionInfo}
          handleSubmit={sessionInfo.isRanning ? ()=>sendJoinRequest({}) : handleStartSession}
        />
      }
      if(!sessionInfo.isRanning) {
        return <NotAllowedFrame sessionInfo={sessionInfo} text="Sorry, this session wasn't started yet" />;
      }

      switch (sessionInfo.security) {
        case SessionSecurityEnum.NONE: 
          return <FreeAccessForm sessionInfo={sessionInfo} onFormSubmit={sendJoinRequest}/>;
        case SessionSecurityEnum.PERMISSION: 
          return <PermissionAccessForm handledAskDecline={handledAskDecline} sessionInfo={sessionInfo} onFormSubmit={sendJoinRequest}/>;
        case SessionSecurityEnum.PASSWORD: 
          return <PasswordAccessForm sessionInfo={sessionInfo} onFormSubmit={sendJoinRequest}/>;
        case SessionSecurityEnum.REGISTRED:
          if(user) {
            return <FreeAccessForm sessionInfo={sessionInfo} onFormSubmit={sendJoinRequest}/>;
          }
          return <NotAllowedFrame sessionInfo={sessionInfo} text="Sorry, this session available only for logined user" />
      }
    }

    return (
      <VideoSessionWrapper>
        { (twilioLoading || sessionLoading || userLoading || !isConnected) && <LoadingFrame description={loadingDescription} />}
        { !sessionInfo && !sessionLoading && <BaseTextFrame text="There is no session on this page" emoji="😞" />}
        {getAccessForm()}
        { sessionInfo !== null && socket!== null && !!room && <Session sessionInfo={sessionInfo} room={room} socket={socket} customName={customName}/>}
      </VideoSessionWrapper>
    );
}

export default VideoSession;