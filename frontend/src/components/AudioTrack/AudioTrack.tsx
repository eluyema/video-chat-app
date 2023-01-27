import { createRef, useEffect } from 'react';

interface AudioTrackI {
    track:  any;
}

const AudioTrack = ({ track }: AudioTrackI) => {
    const ref = createRef<HTMLAudioElement>();
    
    useEffect(()=>{
        const el = ref.current;

        track.attach(el);
        return () => {
            track.detach(el)
            if(el)
            el.srcObject = null;
        }
    },[])

    return <audio ref={ref} />
}

export default AudioTrack;