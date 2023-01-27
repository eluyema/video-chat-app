import { useContext, useState } from 'react';
import TextField from "@mui/material/TextField/TextField";
import Typography from "@mui/material/Typography";
import { FormContainer, JoinToCallWrapper, SessionJoinButton } from "./JoinToCall.styled";
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { fetchSessionInfo } from '../../../../services/sessionsService';
import { AxiosError } from 'axios';
import { AlertContext } from '../../../../Providers/AlertProvider/AlertProvider';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
    sessionCode: yup
        .string()
        .min(4, 'Session code too short')
        .max(10, 'Session code too long')
        .required('Required'),
});

const JoinToCall = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const { showAlert } = useContext(AlertContext);

    const handleJoin = async (sessionCode: string)=> {
        setLoading(true);
        try {
            await fetchSessionInfo(sessionCode)
            navigation("/session/" + sessionCode);
        } catch (e) {
            if(e instanceof AxiosError && e.response) {
                switch(e.response.status) {
                    case 404: showAlert("error", `Session with code "${sessionCode}" doesn't exist`, 6)
                }
            }
        } finally {
            setLoading(false)
        }
    }

    const formik = useFormik({
        initialValues: {
            sessionCode: ""
        },
        validationSchema: validationSchema,
        onSubmit: ({sessionCode}) => {
            handleJoin(sessionCode)
        },
    });

    return <JoinToCallWrapper>
        <Typography variant="h5" component="h5">
            Enter name of session for join
        </Typography>
        <FormContainer onSubmit={formik.handleSubmit}>
            <TextField
                label="Session Code"
                name="sessionCode"
                value={formik.values.sessionCode}
                onChange={formik.handleChange}
                error={formik.touched.sessionCode && Boolean(formik.errors.sessionCode)}
                helperText={formik.touched.sessionCode && formik.errors.sessionCode}
            />
            <SessionJoinButton disabled={loading} color="primary" variant="contained" type="submit">
                Join to session
            </SessionJoinButton>
        </FormContainer>
    </JoinToCallWrapper>
}

export default JoinToCall;