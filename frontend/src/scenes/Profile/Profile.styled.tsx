import { styled } from '@mui/system';


const ProfileContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const ProfileHeader = styled('div')({
    marginTop: '60px',
    marginBottom: '30px',

});

const FormContainer = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
})

const FieldWrapper = styled('div')({
    width: '300px',
    height: '60px',
})

const ButtonsWrapper = styled('div')({
    width: '300px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
})

const UploadImage = styled('div')({
    height: '150px',
    width: '100%',
    border: 'dashed blue',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

export { ProfileContainer, ProfileHeader, FormContainer, FieldWrapper, ButtonsWrapper, UploadImage };
