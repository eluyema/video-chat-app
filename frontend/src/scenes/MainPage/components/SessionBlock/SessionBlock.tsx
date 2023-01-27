import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {SessionBlockWrapper, SessionsButtonsBlock} from './SessionBlock.styled';
import { Link } from 'react-router-dom';

const SessionBlock = () => {
    return <SessionBlockWrapper>
        <Typography variant="h5" component="h5">
            You can create your own session or look at already created
        </Typography>
        <SessionsButtonsBlock>
            <Button component={Link} to="sessions/creator" color="primary" variant="contained">
                Create new session
            </Button>
            <Button component={Link} to="sessions/list" color="primary" variant="outlined">
                Go to my sessions
            </Button>
        </SessionsButtonsBlock>
    </SessionBlockWrapper>
}

export default SessionBlock;
