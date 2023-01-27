import React, {useContext} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';
import { FormContainer, FormContent } from '../VideoSessionStyled/VideoSessionStyled';
import { SessionInfoI } from '../../../../common/types/sessions';
import HeaderSession from '../HeaderSession/HeaderSession';
import { UserContext } from '../../../../Providers/UserProvider/UserProvider';

const validationSchema = yup.object({
    displayName: yup
        .string()
        .min(2, 'Too Short!')
        .max(80, 'Too Long!')
        .required('Required'),
});

interface FreeAccessFormProps {
    sessionInfo: SessionInfoI;
    onFormSubmit: (params: any) => void;
}

const FreeAccessForm = ({ sessionInfo, onFormSubmit }: FreeAccessFormProps) => {
    const {user} = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            displayName:  user ? undefined : '',
        },
        validationSchema: user ? undefined : validationSchema,
        onSubmit: (values) => {
            onFormSubmit(values)
        },
    });

    return (
        <FormContainer onSubmit={formik.handleSubmit}>
            <HeaderSession sessionInfo={sessionInfo}/>
            <FormContent>
                {!user && 
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
                <Button color="primary" variant="contained" type="submit">
                    Join to session
                </Button>
            </FormContent>
        </FormContainer>
    );
};

export default FreeAccessForm;