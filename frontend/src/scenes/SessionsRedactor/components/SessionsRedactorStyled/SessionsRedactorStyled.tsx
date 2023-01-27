import { styled } from '@mui/system';
import { Form } from 'formik';

const HeaderBlock = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginTop: '30px',
    padding: '0 50px',
    height: "80px"
})

const TitleHeader = styled('div')({
    marginTop: "30px"
})

const FieldWrapper = styled('div')({
    width: '300px',
})

const HeaderSpace = styled('div')({
    width: '200px'
});

const FormContainer = styled(Form)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
    gap: '16px',
})

export { HeaderBlock, TitleHeader, FieldWrapper, FormContainer, HeaderSpace };