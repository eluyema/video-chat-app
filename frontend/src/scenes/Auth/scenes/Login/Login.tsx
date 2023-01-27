import { useState, useContext, useEffect} from 'react';
import { Button, Chip, Divider, TextField, Typography } from "@mui/material";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ButtonBlock, DeviderBlock, FieldWrapper, FormContainer } from "../components/AuthStyled/AuthStyled";
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import PasswordField from '../../../../components/PasswordField/PasswordField';
import { AlertContext } from '../../../../Providers/AlertProvider/AlertProvider';
import { UserContext } from '../../../../Providers/UserProvider/UserProvider';

const validationSchema = yup.object({
    email: yup
        .string()
        .email()
        .required('Required'),
    password: yup
        .string()
        .min(6, 'Password too short')
        .max(18, 'Password too long')
        .required('Required'),
});

const Login = () => {
    const { showAlert } = useContext(AlertContext);
    const navigation = useNavigate();
    const { user, loading, login } = useContext(UserContext);

    useEffect(()=>{
        if(user) {
            showAlert("success","Success login", 6)
            navigation("/");
        }
    },[user])

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: ({password, email}) => {
            handleLogin(password, email)
        },
    });

    const handleLogin = async (password:string, email: string) => {
        login(email, password).catch(message=>{
            showAlert("error", message, 6)
        });
    }


    return <AuthContainer title="Sign In">
        <FormContainer onSubmit={formik.handleSubmit}>
            <FieldWrapper>
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
            </FieldWrapper>
            <FieldWrapper>
                <PasswordField
                    fullWidth
                    name="password"
                    label="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
            </FieldWrapper>
            <ButtonBlock>
                <Button disabled={loading} color="primary" variant="contained" type="submit">
                    Sign In
                </Button>
            </ButtonBlock>
        </FormContainer>
        <DeviderBlock>
            <Divider>
                <Chip label="OR" />
            </Divider>
        </DeviderBlock>
        <ButtonBlock>
            <Button component={Link} to="/register" color="primary" variant="text" type="submit">
                Sign Up
            </Button>
        </ButtonBlock>
    </AuthContainer>
}

export { Login };