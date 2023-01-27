import { createRef, useEffect } from 'react';
import { Video } from './VideoTrack.styled';

interface VideoTrackI {
    track:  any;
    isPinned: boolean;
}

const VideoTrack = ({ track, isPinned }: VideoTrackI) => {
    const ref = createRef<HTMLVideoElement>();
    
    useEffect(()=>{
        const el = ref.current;

        track.attach(el);
        return () => {
            track.detach(el)
            if(el)
            el.srcObject = null;
        }
    },[])

    return <Video isPinned={isPinned} ref={ref} />
}

export default VideoTrack;