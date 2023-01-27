import React, {useState, useEffect, useContext} from 'react';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import SessionsTable from './components/SessionsTable/SessionsTable';
import { fetchMySessions } from '../../../services/sessionsService';
import { SessionInfoI } from '../../../common/types/sessions';
import { AlertContext } from '../../../Providers/AlertProvider/AlertProvider';
import { HeaderBlock, TitleHeader } from '../components/SessionsRedactorStyled/SessionsRedactorStyled';

const SessionsList = () => {
    const [sessions, setSessions] = useState<SessionInfoI[]>([]);
    const {showAlert} = useContext(AlertContext);
    useEffect(()=>{
        fetchSession()
    },[])
    
    const fetchSession = async () => {
        try {
            setSessions(await fetchMySessions())
        } catch (e) {
            showAlert("error", "Session deletion failed", 6);
        }
    }

    return <div>
        <HeaderBlock>
            <Button component={Link} to="/"  variant='outlined'>
                Back to main page
            </Button>
            <TitleHeader>
                <Typography variant='h4' component="h4">
                    Your sessions
                </Typography>
            </TitleHeader>
            <Button component={Link} to="/sessions/creator" variant='contained' sx={{color: "#fff !important"}}>
                Create new session
            </Button>
        </HeaderBlock>
        <SessionsTable sessions={sessions} refetch={fetchSession}/>
    </div>
}

export default SessionsList