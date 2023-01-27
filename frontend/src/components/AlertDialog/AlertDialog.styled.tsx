import { styled } from '@mui/system';
import DialogContentText from '@mui/material/DialogContentText';
import CircularProgress from '@mui/material/CircularProgress';

const DialogDescription = styled(DialogContentText)({
    fontSize: '17px',
    color: "rgba(0 0 0 / 0.8)"
})

const LoadingButtonCircle = styled(CircularProgress)({
    margin: '0 auto',
    color: "rgba(0, 0, 0, 0.87)"
})

export { DialogDescription, LoadingButtonCircle };