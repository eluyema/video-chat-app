import { styled } from '@mui/system';

const NotAllowedFrameWrapper = styled('div')({
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center'
})

const NotAllowedFrameMessageBlock = styled('div')({
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
})

export { NotAllowedFrameWrapper, NotAllowedFrameMessageBlock };
