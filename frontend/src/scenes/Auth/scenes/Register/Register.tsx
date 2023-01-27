import { Button, Chip, Divider, TextField, Typography } from "@mui/material";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ButtonBlock, DeviderBlock, FieldWrapper, FormContainer } from "../components/AuthStyled/AuthStyled";
import { Link, useNavigate } from "react-router-dom";
import PasswordField from "../../../../components/PasswordField/PasswordField";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../../Providers/UserProvider/UserProvider";
import { AlertContext } from "../../../../Providers/AlertProvider/AlertProvider";

const validationSchema = yup.object({
    firstName: yup
        .string()
        .min(2, 'First name too short')
        .max(20, 'First name too long')
        .required('Required'),
    lastName: yup
        .string()
        .min(2, 'Last name too short')
        .max(20, 'Last name too long')
        .required('Required'),
    email: yup
        .string()
        .email()
        .required('Required'),
    password: yup
        .string()
        .min(6, 'Password too short')
        .max(18, 'Password too long')
        .required('Required'),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
});

const Register = () => {
    const { user, loading, register } = useContext(UserContext);

    const { showAlert } = useContext(AlertContext);
    const navigation = useNavigate();

    useEffect(()=>{
        if(user) {
            showAlert("success","Success register", 6)
            navigation("/");
        }
    },[user])


    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirmation: ''
        },
        validationSchema: validationSchema,
        onSubmit: ({firstName, lastName, password, email}) => {
            handleRegister(firstName, lastName, password, email)
        },
    });

    const handleRegister = async (firstName: string, lastName: string, password: string, email: string) => {
        register(firstName, lastName, email, password).catch(message=>{
            showAlert("error", message, 6)
        });;
    }


    return <AuthContainer title="Sign Un">
        <FormContainer onSubmit={formik.handleSubmit}>
            <FieldWrapper>
                <TextField
                    fullWidth
                    name="firstName"
                    label="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                />
            </FieldWrapper>
            <FieldWrapper>
                <TextField
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                />
            </FieldWrapper>
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
            <FieldWrapper>
                <PasswordField
                    fullWidth
                    name="passwordConfirmation"
                    label="Confirm Password"
                    value={formik.values.passwordConfirmation}
                    onChange={formik.handleChange}
                    error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                    helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                />
            </FieldWrapper>
            <ButtonBlock>
                <Button disabled={loading} color="primary" variant="contained" type="submit">
                    Sign Up
                </Button>
            </ButtonBlock>
        </FormContainer>
        <DeviderBlock>
            <Divider>
                <Chip label="OR" />
            </Divider>
        </DeviderBlock>
        <ButtonBlock>
            <Button component={Link} to="/login" color="primary" variant="text" type="submit">
                Sign In
            </Button>
        </ButtonBlock>
    </AuthContainer>
}

export { Register };