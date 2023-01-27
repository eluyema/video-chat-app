import React, { useState, useContext, useEffect } from 'react';
import { Button, Typography, TextField, Box } from '@mui/material';
import { FieldWrapper, FormContainer, HeaderBlock, HeaderSpace, TitleHeader } from '../components/SessionsRedactorStyled/SessionsRedactorStyled';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { SessionSecurityEnum } from '../../../common/enums/sessions';
import { Formik } from 'formik';
import { SessionInfoI, SessionUpdateData } from '../../../common/types/sessions';
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
import { fetchSessionInfo, updateSession } from '../../../services/sessionsService';
import { AlertContext } from '../../../Providers/AlertProvider/AlertProvider';
import BaseTextFrame from '../../VideoSession/components/BaseTextFrame/BaseTextFrame';
import LoadingFrame from '../../../components/LoadingFrame/LoadingFrame';
import { IApprovedUser } from '../../../common/enums/user';
import DeleteIcon from '@mui/icons-material/Delete';

const currentDate = new Date();
currentDate.setHours(currentDate.getHours() + 2);

const validationSchema = yup.object({
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

const removeEmptyValues = (obj: SessionUpdateData) => {
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

const SessionsEditor = () => {
    const { shareId } = useParams();
    const [updateLoading, setUpdateLoading] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);
    const navigator = useNavigate();
    const {showAlert} = useContext(AlertContext);
    const [initValues, setInitValues] = useState<SessionUpdateData | null>(null)

    const [approvedUsers, setApprovedUsers] = useState<IApprovedUser[]>([
        {
            displayName: "Danylo Hermanovych",
            email: 'danylo.hermanovych@gmail.com'
        },
        {
            displayName: "Denis Klysak",
            email: 'desis.klysak@gmail.com'
        },
        {
            displayName: "Vitaly Hromyaka",
            email: 'vitaly.hromaka@gmail.com'
        },
    ])

    useEffect(()=>{
        if(!shareId){
          return;
        }
  
        fetchSessionInfo(shareId).then(
          sessionIfo => {
            const values: SessionUpdateData = {
                title: sessionIfo.title,
                description: sessionIfo.description,
                plannedDate: sessionIfo.plannedDate,
                security: sessionIfo.security,
                password: ''
            }
            setInitValues(values);
          }
        ).finally(()=>{
          setSessionLoading(false);
        })
      },[shareId])

    if(sessionLoading || !initValues) {
        return <LoadingFrame description="Looking for session details" />
    }

    if(!initValues && !sessionLoading) {
        return <BaseTextFrame text="There is no session on this page" emoji="😞" />
    }

    return <div>
        <HeaderBlock>
            <Button component={Link} to="/sessions/list" variant='outlined'>
                Back to sessions list
            </Button>
            <TitleHeader>
                <Typography variant='h5' component="h5">
                    Update Session "{initValues?.title}" ({shareId})

                </Typography>
            </TitleHeader>
            <HeaderSpace />
        </HeaderBlock>
        <Formik 
            initialValues={initValues as SessionUpdateData}
            validationSchema={validationSchema}
            onSubmit={(data: SessionUpdateData) => {
                setUpdateLoading(true);
                updateSession(shareId as string, removeEmptyValues(data)).then((session)=>{
                    navigator("/sessions/list");
                    showAlert("success",`Session "${session.title} (${session.shareId}) was successfully updated`, 10);
                }).catch(()=>{
                    showAlert("error","Something goes wrong", 6);
                })
                .finally(()=>{
                    setUpdateLoading(false);
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

                    <FormControl sx={{width: '300px'}}>
                        <InputLabel>Approved users</InputLabel>
                        <Select
                            sx={{width: '300px'}}
                            labelId="Approved users"
                            value={!!approvedUsers ? approvedUsers[0]: ''}
                            label="Approved users"
                        >
                            {approvedUsers.map(({displayName, email})=><MenuItem sx={{cursor: 'default !important'}} value={email}>
                            <Box sx={{width: '100%', gap: '15px', display: 'flex !important', justifyContent: 'space-between !important'}}>
                            {displayName}({email})
                            <DeleteIcon sx={{cursor: 'pointer'}} htmlColor='red' onClick={
                                ()=>{
                                setApprovedUsers(users=>
                                    users.filter(({email: userEmail})=> userEmail !== email )
                                )
                            }
                            }/>
                            </Box> </MenuItem>)}
    
                        </Select>
                        </FormControl>

                    <Button disabled={updateLoading} color="primary" variant="contained" type="submit">
                        Update session
                    </Button>
                </FormContainer>
            }
        </Formik>
    </div>
};

export default SessionsEditor;