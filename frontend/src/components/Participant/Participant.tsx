import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {  LocalParticipant, LocalTrack, Participant as ParticipantInstenceI, RemoteParticipant, TrackPublication  } from 'twilio-video';
import { getEclipse } from '../../utils/string/getEclipse';
import AudioTrack from '../AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';
import { AvaImg, DisabledMicBlock, FixedBlock, ParticipantBlock, ParticipantNameBlock, VideoContainer, YouBlock } from './Participant.styled';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ParticipantSettings from './components/ParticipantSettings/ParticipantSettings';
import MicOffIcon from '@mui/icons-material/MicOff';
import { ava_url } from './constant';
import PushPinIcon from '@mui/icons-material/PushPin';

interface ParticipantI {
    participant: any;
    isLocal?: boolean;
    fixMe: (sid: string)=> void;
    fixed: boolean;
}

const eclipseEdge = 20;

const Participant = ({ participant, fixed, fixMe, isLocal = false }: ParticipantI) => {
    const [disabledMic, setDisabledMic] = useState(false);
    const [disabledCamera, setDisabledCamera] = useState(false);

    const [tracks, setTracks] = useState<LocalTrack[]>([]);
    const { displayName } = JSON.parse(participant.identity);
    const addTrack = (track: LocalTrack) => {
        const alreadyExisted = tracks.some(({name})=>name===track.name)
        if(alreadyExisted) {
          return;
        }
        setTracks(
          tracks => [...tracks, track]
        );
      }

    useEffect(()=> {
        const existingPublications = Array.from(participant.tracks.values());
        const existingTracks = existingPublications.map((publication: any) => publication.track).filter(track => track !== null);
        setTracks(existingTracks);

        participant.on('trackSubscribed', (track: any) => addTrack(track));
        participant.on('trackDisabled', (track: any)=>{
          if(track.kind === "audio") {
            setDisabledMic(true);
          } else {
            setDisabledCamera(true);
          }
        })
        participant.on('trackEnabled', (track: any)=>{
          if(track.kind === "audio") {
            setDisabledMic(false);
          } else {
            setDisabledCamera(false);
          }
        })
    },[])

    return ( 
        <ParticipantBlock>
          <VideoContainer>
            {isLocal ?
            (<YouBlock>
              <PersonIcon />
              <Typography>You</Typography>
            </YouBlock>):
            (<ParticipantSettings mySid={participant.sid} fixMe={fixMe} pinned={fixed}/>)
            }
            {disabledMic && 
            <DisabledMicBlock>
              <MicOffIcon htmlColor='white'/>
            </DisabledMicBlock>
            }
            {fixed && <FixedBlock>
              <PushPinIcon />
              </FixedBlock>}
            { 
              tracks.filter(({kind}) => kind === 'audio').map(track =>{
                return <AudioTrack key={track.id} track={track}/>
              })
            }
            { disabledCamera  &&
            <AvaImg src={ava_url}/>}
            {
              tracks.filter(({kind}) => kind === 'video').map(track =>{
                return <VideoTrack isPinned={fixed} key={track.id} track={track}/>
              })
            }
            <ParticipantNameBlock>
              <Typography variant='subtitle1' component={"span"} color="white" fontSize={"0.9vw"}
              >{getEclipse(displayName, eclipseEdge)}</Typography>
            </ParticipantNameBlock>
          </VideoContainer>
        </ParticipantBlock>
      );
}

export default Participant;