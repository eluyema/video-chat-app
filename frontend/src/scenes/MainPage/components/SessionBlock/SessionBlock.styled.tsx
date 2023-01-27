import { styled } from '@mui/system';


const SessionBlockWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '32vh',
    gap: '20px',
    height: '90%',
    width: '42%'
})

const SessionsButtonsBlock = styled('div')({
    display: 'flex',
    gap: '15px',
    height: '45px',
})


export { SessionBlockWrapper, SessionsButtonsBlock };
