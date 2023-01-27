import { useState } from 'react';
import { ParticipantSettingsWrapper, StyledIconButton } from "./ParticipantSettings.styled";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import Volume from '../Volume/Volume';


interface ParticipantSettings {
    pinned: boolean;
    mySid: string;
    fixMe: (sid: string) => void
}

const ParticipantSettings = ({pinned, fixMe, mySid}: ParticipantSettings) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return <>
    <StyledIconButton onClick={handleClick}>
        <MoreVertIcon fontSize='large' />
    </StyledIconButton>
    <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={()=>{
            fixMe(mySid)
            handleClose()
        }}>{pinned?"Unpin": "Pin" }</MenuItem>
        <MenuItem onClick={handleClose}>Mute for all</MenuItem>
        <MenuItem onClick={handleClose}>Mute for me</MenuItem>
        <MenuItem onClick={handleClose}><Volume/></MenuItem>

        <MenuItem onClick={handleClose}>Add to approved users</MenuItem>
        <MenuItem onClick={handleClose}><Typography color="error">Expel</Typography></MenuItem>

      </Menu>
    </>
}

export default ParticipantSettings;