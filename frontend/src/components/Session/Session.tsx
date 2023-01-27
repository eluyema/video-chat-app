import { Container, Grid, Box} from '@mui/material';
import { Socket } from 'socket.io-client';
import { useContext, useEffect, useState } from 'react';
import { Participant as ParticipantInstenceI, RemoteParticipant, Room as IRoomInstance, Track } from 'twilio-video';
import Button from '@mui/material/Button';
import Chat from '../Chat/Chat';
import ListOfWaiters from '../ListOfWaiters/ListOfWaiters';
import Partisipants from '../Partisipants/Partisipants';
import SessionController from '../SessionController/SessionController';
import { ControllerSection, SessionContainer, SessionSideSection } from './Session.styled';
import { WaiterInfo } from '../../common/types/users';
import { useNavigate, useParams } from 'react-router-dom';
import { SessionInfoI } from '../../common/types/sessions';
import { UserContext } from '../../Providers/UserProvider/UserProvider';
import { SessionSecurityEnum } from '../../common/enums/sessions';
import { stopSession } from '../../services/sessionsService';
 
interface SessionProps {
    room: IRoomInstance;
    socket: Socket;
    sessionInfo: SessionInfoI;
    customName: string;
}

const Session = ({ room, socket, sessionInfo, customName }: SessionProps) => {
    const [remoteParticipants, setRemoteParticipants] = useState<ParticipantInstenceI[]>([]);
    const { shareId } = useParams();
    const [waiters, setWaiters] = useState<WaiterInfo[]>([]);
    const { user } = useContext(UserContext);

    const displayName = customName || user && `${user.firstName} ${user.lastName}`;
    const navigate = useNavigate();
    const isMySession = !!user && sessionInfo.authorEmail === user.email;
    
    useEffect(()=>{
      socket.on('ask-permission', ({socketId, identity})=>{
        setWaiters(waiters=>[...waiters, { socketId, identity }])
      })
      socket.on('decline-asking-permission',({socketId})=>{
        setWaiters(waiters=>waiters.filter((waiter)=> waiter.socketId !== socketId))})
      return () => {
        socket.off('ask-permission')
      }
    },[])

    const handleApprove = (id: string) =>{
      const waiter = waiters.find(({socketId})=>socketId === id)
      if(waiter && socket){
        socket.emit('answer-permission', {
          shareId,
          identity: waiter.identity,
          socketId: id,
          approved: true,
        })
        setWaiters(waiters=>waiters.filter(({ socketId })=> socketId !== id));
      }
    }
    
    const handleDecline = (id: string) =>{
      const waiter = waiters.find(({socketId})=>socketId === id)
      if(waiter && socket){
        socket.emit('answer-permission', {
          shareId,
          identity: waiter.identity,
          socketId: id,
          approved: false,
        })
        setWaiters(waiters=>waiters.filter(({ socketId })=> socketId !== id));
      }
    }

    const addParticipant = (participant: ParticipantInstenceI) => {
        
        setRemoteParticipants(
          remoteParticipants => [...remoteParticipants, participant]
        );
      }
    
    const removeParticipant = (participant: RemoteParticipant) => {
        detachParticipantTracks(participant)
    
        setRemoteParticipants(remoteParticipants => remoteParticipants.filter(p => p.identity !== participant.identity));
      }

    const detachTracks = (tracks: any[]) => {
        tracks.forEach(track => {
          if(track.detach)
          track.detach().forEach((detachedElement: any) => {
            detachedElement.remove();
          });
        });
      }
    
    const detachParticipantTracks = (participant: any) => {
      var tracks = Array.from(participant.tracks.values());
      detachTracks(tracks);
    }

    useEffect(()=>{
        setRemoteParticipants(Array.from(room.participants.values()));

        room.on('participantConnected', participant => addParticipant(participant));
        room.on('participantDisconnected', participant => {
          removeParticipant(participant)
        });
        room.on('disconnected', room => {
          detachParticipantTracks(room.localParticipant);
          room.participants.forEach(detachParticipantTracks);
          navigate("/session/end")
        });
        const beforeunloadListener = () => { handleLeave()};
        window.addEventListener('beforeunload', beforeunloadListener, true);
        return () => {
          handleLeave();
          window.removeEventListener('beforeunload', beforeunloadListener);
        }
    },[])

    const handleEndCall = () => {
      stopSession(shareId as string);
    }

    const handleLeave = () => {
      if(room)
      {
        const partisipantTracks = room.localParticipant.tracks as any;
        partisipantTracks.forEach(function(trackPublication: any) {
          if(trackPublication.track.stop)
            trackPublication.track.stop();
        });
        room.disconnect();
      }
    }


    return (
          <SessionContainer>
            {sessionInfo.security === SessionSecurityEnum.PERMISSION && <ListOfWaiters isMySession={isMySession} waiters={waiters} handleApprove={handleApprove} handleDecline={handleDecline}/>}
            <Partisipants
              localParticipantSid={room.localParticipant.sid}
              participants={[room.localParticipant, ...remoteParticipants]} />
            <SessionSideSection>
              {isMySession && <Button color="error" variant='contained' onClick={handleEndCall}> End call </Button>}
              <Chat socket={socket} displayName={displayName as string}/>
            </SessionSideSection>
            <ControllerSection>
              <SessionController room={room} handleLeave={handleLeave} />
            </ControllerSection>
          </SessionContainer>
      );
}

export default Session;