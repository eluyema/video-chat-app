import React, { useState, useContext} from 'react';
import { Button, Typography, TextField } from '@mui/material';
import { FieldWrapper, FormContainer, HeaderBlock, HeaderSpace, TitleHeader } from '../components/SessionsRedactorStyled/SessionsRedactorStyled';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { SessionSecurityEnum } from '../../../common/enums/sessions';
import { Formik } from 'formik';
import { SessionCreateData } from '../../../common/types/sessions';
import { DateTimePicker } from '@mui/x-date-pickers';
import FormikDatePicker from '../../../components/FormikDatePicker/FormikDatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Collapse from '@mui/material/Collapse';
import { createSession } from '../../../services/sessionsService';
import { AlertContext } from '../../../Providers/AlertProvider/AlertProvider';

const currentDate = new Date();
currentDate.setHours(currentDate.getHours() + 2);

const validationSchema = yup.object({
    reusable: yup
        .boolean()
        .required('Required'),
    title: yup
        .string()
        .min(4, 'Title too short')
        .max(70, 'Title too long')
        .required('Required'),
    description: yup
        .string()
        .min(4, 'Description too short')
        .max(100, 'Description too long'),
    password: yup
        .string()
        .min(5, 'Password too short')
        .max(18, 'Password too long'),
    security: yup.mixed<SessionSecurityEnum>().oneOf(Object.values(SessionSecurityEnum)).required(),
    plannedDate: yup.date()
})

const removeEmptyValues = (obj: SessionCreateData) => {
    const preparedObj: any = {};

    for (const [key, value] of Object.entries(obj)) {
        switch (key) {
            case 'reusable': {
                preparedObj[key] = value;
                break;
            }
            default: {
                if (!value) {
                    break;
                }
                preparedObj[key] = value;
            }
        }
    }

    return preparedObj;
}

const SessionsCreator = () => {
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();
    const {showAlert} = useContext(AlertContext);
    const [autoStart, setAutoStart] = useState(false);


    return <div>
        <HeaderBlock>
            <Button component={Link} to="/sessions/list" variant='outlined'>
                Back to sessions list
            </Button>
            <TitleHeader>
                <Typography variant='h4' component="h4">
                    Create new session
                </Typography>
            </TitleHeader>
            <HeaderSpace />
        </HeaderBlock>
        <Formik
            initialValues={{
                reusable: true,
                title: '',
                description: '',
                password: '',
                security: SessionSecurityEnum.NONE,
                plannedDate: currentDate
            } as SessionCreateData}
            validationSchema={validationSchema}
            onSubmit={(data: SessionCreateData) => {
                setLoading(true);
                createSession(removeEmptyValues(data)).then((session)=>{
                    showAlert("success",`Session "${session.title} (${session.shareId}) was successfully created`, 10);
                    if(autoStart) {
                        const path = {
                            pathname: "/session/" + session.shareId,
                            search: createSearchParams({"autoStart": "true"}).toString()
                        };
                        navigator(path);
                    } else {
                        navigator("/sessions/list");
                    }
                }).catch(()=>{
                    showAlert("error","Something goes wrong", 6);
                })
                .finally(()=>{
                    setLoading(false);
                })
            }}
        >
            {formik =>
                <FormContainer onSubmit={formik.handleSubmit}>
                    
                    <FieldWrapper>
                        <TextField
                            fullWidth
                            name="title"
                            label="Title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </FieldWrapper>
                    <FieldWrapper>
                        <TextField
                            fullWidth
                            name="description"
                            label="Description"
                            multiline
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </FieldWrapper>
                    <FieldWrapper>
                        <FormControlLabel control={<Checkbox name="reusable" checked={formik.values.reusable} onChange={formik.handleChange} />} label="Reusable" />
                        {
                            formik.touched.reusable && Boolean(formik.errors.reusable) &&
                            formik.touched.reusable && formik.errors.reusable &&
                            <FormHelperText>{formik.errors.reusable}</FormHelperText>

                        }
                    </FieldWrapper>
                    <FieldWrapper>
                        <FormikDatePicker fieldName='plannedDate' displayName="Planned Date" formik={formik} />
                    </FieldWrapper>
                    <FieldWrapper>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Security</InputLabel>
                            <Select
                                fullWidth
                                value={formik.values.security}
                                labelId="sessions-creator-security-select-label"
                                label="Security"
                                name="security"
                                onChange={formik.handleChange}
                                error={formik.touched.security && Boolean(formik.errors.security)}
                            >
                                {Object.values(SessionSecurityEnum).map(value=>{
                                    return (<MenuItem key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}</MenuItem>)
                                })}
                            </Select>
                            {
                                formik.touched.security && Boolean(formik.errors.security) &&
                                formik.touched.security && formik.errors.security &&
                                <FormHelperText>{formik.errors.security}</FormHelperText>
                            }
                        </FormControl>
                    </FieldWrapper>
                    <Collapse in={formik.values.security === SessionSecurityEnum.PASSWORD}>
                        <FieldWrapper>
                            <TextField
                                fullWidth
                                name="password"
                                label="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </FieldWrapper>
                    </Collapse>
                    <FieldWrapper>
                        <FormControlLabel control={<Checkbox checked={autoStart} onChange={()=>{setAutoStart(value=>!value)}} />} label="Auto start session" />
                    </FieldWrapper>
                    <Button disabled={loading} color="primary" variant="contained" type="submit">
                        Create session
                    </Button>

                </FormContainer>
            }
        </Formik>
    </div>
};

export default SessionsCreator;