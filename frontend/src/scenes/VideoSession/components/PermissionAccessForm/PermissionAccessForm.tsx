import React, {useContext, useState} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField, Typography } from '@mui/material';
import { FormContainer, FormContent } from '../VideoSessionStyled/VideoSessionStyled';
import { SessionInfoI } from '../../../../common/types/sessions';
import HeaderSession from '../HeaderSession/HeaderSession';
import { UserContext } from '../../../../Providers/UserProvider/UserProvider';
import CircularProgress from '@mui/material/CircularProgress';


const validationSchema = yup.object({
    displayName: yup
        .string()
        .min(2, 'Too Short!')
        .max(80, 'Too Long!')
        .required('Required'),
});

interface PermissionAccessFormProps {
    sessionInfo: SessionInfoI;
    onFormSubmit: (params: any) => void;
    handledAskDecline: () => void;
}

const PermissionAccessForm = ({ handledAskDecline, sessionInfo, onFormSubmit }: PermissionAccessFormProps) => {
    const {user} = useContext(UserContext);
    const [waiting, setWaiting] = useState(false);
    const formik = useFormik({
        initialValues: {
            displayName:  user ? undefined : '',
        },
        validationSchema: user ? undefined : validationSchema,
        onSubmit: (values) => {
            setWaiting(true);
            onFormSubmit(values)
        },
    });

    return (
        <FormContainer onSubmit={formik.handleSubmit}>
            <HeaderSession sessionInfo={sessionInfo}/>
            <FormContent>
                {!user && !waiting && 
                    <TextField
                        fullWidth
                        id="displayName"
                        name="displayName"
                        label="Your name"
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                        helperText={formik.touched.displayName && formik.errors.displayName}
                    />
                }
                {!waiting && <Button color="primary" variant="contained" type="submit">
                    Ask for connect
                </Button>}
                { waiting && <>
                    <Typography component="h4" variant='h4'>
                        Waiting for permissons...
                    </Typography>
                    <CircularProgress />
                    <Button color="error" variant="outlined" type="button" onClick={handledAskDecline}>
                        Decline for connect
                    </Button>
                </>
                }
            </FormContent>
        </FormContainer>
    );
};

export default PermissionAccessForm;