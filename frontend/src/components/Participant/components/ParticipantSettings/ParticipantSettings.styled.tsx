import { styled } from '@mui/system';
import IconButton from '@mui/material/IconButton';

const ParticipantSettingsWrapper = styled('div')({
    position: 'absolute',
    right: '5px',
    top: '5px',
    cursor: "pointer",
    backgroundColor: 'white',
    zIndex: '2',
    padding: '4px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center'
})

const StyledIconButton = styled(IconButton)({
    position: 'absolute',
    right: '5px',
    top: '5px',
    zIndex: 3,
    cursor: "pointer !important",
    background: 'white !important'
})

export { ParticipantSettingsWrapper, StyledIconButton};