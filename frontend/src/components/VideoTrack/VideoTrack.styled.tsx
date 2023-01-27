import { styled } from '@mui/system';

const Video = styled('video')<{isPinned: boolean}>` 
    max-width: ${({isPinned}) => !isPinned ? '100%':'30vw'};
    margin:0;
    padding:0;
    float:'left';
`

export { Video };