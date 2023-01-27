import React, { useContext, useState } from 'react';
import { ButtonsWrapper, FieldWrapper, FormContainer, ProfileContainer, ProfileHeader, UploadImage } from './Profile.styled';
import { Typography, TextField } from '@mui/material';
import * as yup from 'yup';
import { UserContext } from '../../Providers/UserProvider/UserProvider';
import { useFormik } from 'formik';
import { updateMyUser } from '../../services/userService';
import PasswordField from '../../components/PasswordField/PasswordField';
import Button from '@mui/material/Button';
import { UserUpdateData } from '../../common/types/users';
import { AlertContext } from '../../Providers/AlertProvider/AlertProvider';
import { AxiosError } from 'axios';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

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
        .max(18, 'Password too long'),
    passwordConfirmation: yup.string()
        .test('passwords-match', 'Passwords must match', function(value){
            return this.parent.password === value
        })
});

const Profile = () => {
    const { user, fetchMyProfile } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext);
    const [loading, setLoading] = useState(false);

    const removeExistedOrEmptyField = (data: UserUpdateData) => {
        const preparedData: any = {};
        for(const [key, value] of Object.entries(data)) {
            if(!value || user && key in user && user[key as keyof typeof user] === value) {
                continue;
            }
            preparedData[key] = value;
        }
        return preparedData;
    }

    const isNewValues = ()  => {
        const currentData: UserUpdateData = removeExistedOrEmptyField({
            firstName: formik.values.firstName || undefined,
            lastName: formik.values.lastName || undefined,
            email: formik.values.email || undefined,
            password: formik.values.password || undefined,
        });
        let isNew = false;
        for(const [key, value] of Object.entries(currentData)) {
            if(!value || user && key in user && user[key as keyof typeof user] === value) {
                continue;
            }
            isNew = true;
        }
        return isNew;
    }

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName as string,
            lastName: user?.lastName as string,
            email: user?.email as string,
            password: '',
            passwordConfirmation: ''
        },
        validationSchema: validationSchema,
        onSubmit: (data, { resetForm }) => {
            const preparedData: UserUpdateData = removeExistedOrEmptyField({
                firstName: data.firstName || undefined,
                lastName: data.lastName || undefined,
                email: data.email || undefined,
                password: data.password || undefined,
            });
            setLoading(true);
            updateMyUser(preparedData).then(()=>{
                return fetchMyProfile();
            }).then(()=>{
                showAlert('success', "Your profile was updated", 6);
                resetForm({
                    values: {
                        firstName: user?.firstName as string,
                        lastName: user?.lastName as string,
                        email: user?.email as string,
                        ...preparedData,
                        password: '',
                        passwordConfirmation: '',
                    }
                });
            }).catch((e)=>{
                if(e instanceof AxiosError && e.request && e.request.status === 409){
                    showAlert('error', `Email "${data.email}" already exist`, 6);
                } else {
                    showAlert('error', `Something goes wrong`, 6);

                }
            }).finally(()=>{
                setLoading(false)
            })
        },
    });

    return <ProfileContainer>
        <ProfileHeader>
            <Typography component="h2" variant='h4'>
                Profile Settings
            </Typography>
        </ProfileHeader>
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
            <UploadImage >
                Drop you image here...
                <AddPhotoAlternateIcon />
            </UploadImage>
            <ButtonsWrapper>
                <Button disabled={loading} onClick={()=>formik.resetForm()} color="primary" variant="outlined" type="reset">
                    Reset Settings
                </Button>
                <Button disabled={loading || !isNewValues()} color="primary" variant="contained" type="submit">
                    Save Settings
                </Button>
            </ButtonsWrapper>
        </FormContainer>
    </ProfileContainer>
}

export default Profile;