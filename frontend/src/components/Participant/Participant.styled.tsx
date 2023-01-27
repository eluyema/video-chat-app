import { styled } from '@mui/system';

const ParticipantBlock = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',

});

const VideoContainer = styled('div')({
    position: "relative",
    height: '100%',
    maxwidth: '20vw'
})

const ParticipantNameBlock = styled('div')({
    position: 'absolute',
    backgroundColor: 'rgba(25,118,210, 0.7);',
    bottom: '0',
    padding: '0 4px'
});

const YouBlock = styled('div')({
    position: 'absolute',
    left: '5px',
    top: '5px',
    backgroundColor: 'white',
    zIndex: '2',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center'
})

const DisabledMicBlock = styled('div')({
    position: 'absolute',
    padding: '8px',
    right: '5px',
    bottom: '5px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50%',
    backgroundColor: '#d32f2f',
    zIndex: '3'
});

const AvaImg = styled('img')({
    maxWidth: '100%',
    width: 'max-content',
    maxHeight: "100%",
    position: "absolute",
    left: '50%',
    transform: 'translatex(-50%)',
    height: '100%',
})

const FixedBlock = styled('div')({
    position: 'absolute',
    padding: '8px',
    left: '5px',
    top: '5px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50%',
    backgroundColor: 'white',
    zIndex: '3'
});

export {ParticipantBlock, ParticipantNameBlock, VideoContainer, YouBlock, DisabledMicBlock,FixedBlock, AvaImg }