import { Typography } from '@mui/material';
import * as React from 'react';
import { AuthWrapper, FormWrapper, TitleBlock } from './AuthContainer.styled';


interface AuthContainerI {
    children: React.ReactNode;
    title: string;
}

const AuthContainer = ({children, title}: AuthContainerI) => {
    return <AuthWrapper>
        <FormWrapper elevation={3}>
            <TitleBlock>
                <Typography component={"h3"} variant="h5"> {title} </Typography>
            </TitleBlock>
            {children}
        </FormWrapper>
    </AuthWrapper>
}

export default AuthContainer;