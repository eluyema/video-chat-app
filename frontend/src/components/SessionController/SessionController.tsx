import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Fab } from '@mui/material';
import { ControllerWrapper } from './SessionController.styled';
import { useState } from 'react';
import BaseSelect from '../BaseSelect/BaseSelect';
import CallEndIcon from '@mui/icons-material/CallEnd';
import {  Room as IRoomInstance } from 'twilio-video';

interface SessionControllerProps {
    handleLeave: () => void;
    room: IRoomInstance
}

const SessionController = ({ room, handleLeave }:SessionControllerProps) => {
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [micEnabled, setMicEnabled] = useState(true);

    const onChangeMicEnabled = () => {
        setMicEnabled(enabled=>{
            if(enabled){
                room.localParticipant.audioTracks.forEach((publication) => { 
                    publication.track.disable(); 
                });
            } else {
                room.localParticipant.audioTracks.forEach((publication) => { 
                    publication.track.enable(); 
                });
            }
            return !enabled;
        });
    }

    const onChangeCameraEnabled = () => {
        setCameraEnabled(enabled=>{
            if(enabled){
                room.localParticipant.videoTracks.forEach(publication => {
                    publication.track.disable();
                });
            } else {
                room.localParticipant.videoTracks.forEach(publication => {
                    publication.track.enable();
                });
            }
            return !enabled;
        });
    }

    return <ControllerWrapper>
            <BaseSelect label="Camera" onChange ={(value)=>{}} options={[
                {name: 'camera 1', value: 'camera1'},
                {name: 'camera 2', value: 'camera2'},
            ]}/>
            <BaseSelect label="Mic" onChange ={(value)=>{}} options={[
                {name: 'mic 1', value: 'mic 1'},
                {name: 'mic 2', value: 'mic 2'},
            ]}/>
            <Fab color={micEnabled ? "info": "error"} aria-label="mic" onClick={onChangeMicEnabled}>
                {micEnabled?
                <MicIcon fontSize='large' htmlColor='white'/>
                    : <MicOffIcon fontSize='large' htmlColor='white' />}
            </Fab>
            <Fab color={cameraEnabled ? "info": "error"} aria-label="video" onClick={onChangeCameraEnabled}>
                {cameraEnabled?<VideocamIcon fontSize='large' htmlColor='white'/>
                    :<VideocamOffIcon fontSize='large' htmlColor='white' />}
            </Fab>
            <Fab color="error" aria-label="leave" onClick={handleLeave}>
                <CallEndIcon />
            </Fab>
    </ControllerWrapper>
}

export default SessionController;
