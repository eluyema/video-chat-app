import { styled } from "@mui/material";

const ButtonBlock = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
})

const FieldWrapper = styled('div')({
    height: '50px',
})

const FormContainer = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
})

const DeviderBlock = styled('div')({
    width: '100%',
    padding: '15px 0'
})

export { ButtonBlock, FieldWrapper, FormContainer, DeviderBlock }
