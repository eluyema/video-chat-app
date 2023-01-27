import { useContext } from 'react';
import { useFormik } from "formik";
import { SessionInfoI } from "../../../../common/types/sessions";
import { FormContainer, FormContent } from "../VideoSessionStyled/VideoSessionStyled";
import * as yup from 'yup';
import HeaderSession from "../HeaderSession/HeaderSession";
import { Button, TextField } from '@mui/material';
import { UserContext } from "../../../../Providers/UserProvider/UserProvider";
import PasswordField from '../../../../components/PasswordField/PasswordField';

const validationSchema = yup.object({
    displayName: yup
        .string()
        .min(2, 'Display name too Short!')
        .max(80, 'Display name too Long!')
        .required('Required'),
    password: yup
        .string()
        .min(5, 'Password too short')
        .max(18, 'Password too long')
        .required('Required'),
});

interface PasswordAccessFormProps {
    sessionInfo: SessionInfoI;
    onFormSubmit: (params: any) => void;
}

const PasswordAccessForm = ({sessionInfo, onFormSubmit}: PasswordAccessFormProps) => {
    const { user } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            displayName: user ? `${user.firstName} ${user.lastName}` : '' ,
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onFormSubmit(values)
        },
    });

    return (
        <FormContainer onSubmit={formik.handleSubmit}>
            <HeaderSession sessionInfo={sessionInfo}/>
            <FormContent>
                {!user && <TextField
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
                <PasswordField
                    fullWidth
                    name="password"
                    label="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <Button color="primary" variant="contained" type="submit">
                    Join to session
                </Button>
            </FormContent>
        </FormContainer>
    );
}

export default PasswordAccessForm;
