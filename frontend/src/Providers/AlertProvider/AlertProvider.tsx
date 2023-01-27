import React, { createContext, useContext, useEffect, useState } from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { AlertWrapper } from './AlertProvider.styled';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow/Grow';

interface AlertValuesI {
    showAlert: (severity: AlertColor, message: string, disappearTime: number) => void
}

const AlertInitValues: AlertValuesI = {
    showAlert: () => { }
}

const AlertContext = createContext(AlertInitValues);

interface IAlertProvider {
    children: React.ReactNode
}


const AlertProvider = ({ children }: IAlertProvider) => {
    const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("error")


    const showAlert = (severity: AlertColor, message: string, disappearTime: number) => {
        setSeverity(severity);
        setMessage(message);
        const id = setTimeout(() => {
            setTimeoutId(null);
        }, disappearTime * 1000)
        setTimeoutId((lastTimeoutId)=>{
            if(lastTimeoutId) {
                clearTimeout(lastTimeoutId);
            }
            return id
        });
    }

    const closeAlert = () => {
        setTimeoutId(null);
    }

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {<AlertWrapper>
                <Grow in={!!timeoutId}>
                    <Alert variant="filled" severity={severity} onClose={closeAlert}>
                        <AlertTitle>{severity.toUpperCase()[0] + severity.slice(1, severity.length)}</AlertTitle>
                        {message}
                    </Alert>
                </Grow>
            </AlertWrapper>}
        </AlertContext.Provider>
    )
}

export default AlertProvider;
export { AlertContext };
