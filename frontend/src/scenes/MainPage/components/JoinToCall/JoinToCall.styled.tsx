import Button from '@mui/material/Button/Button';
import { styled } from '@mui/system';


const JoinToCallWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '32vh',
    gap: '20px',
    height: '90%',
    width: '42%'
})

const FormContainer = styled('form')({
    display: 'flex',
    gap: '15px',
    alignItems: 'start',
    height: "90px"
})

const SessionJoinButton = styled(Button)({
    padding: "10px 20px",
    marginTop: '5px'
})

export { JoinToCallWrapper, FormContainer, SessionJoinButton };
