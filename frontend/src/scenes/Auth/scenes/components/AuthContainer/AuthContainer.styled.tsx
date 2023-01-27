import { Paper, styled } from "@mui/material";

const AuthWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100% - 64px)',
})

const FormWrapper = styled(Paper)({
    width: '500px',
    padding: '10px 25px',
})

const TitleBlock = styled('div')({
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

export { AuthWrapper, FormWrapper, TitleBlock };
