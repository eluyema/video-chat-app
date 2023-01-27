import { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from '@mui/material/Typography/Typography';
import { PopoverContent } from './CopyButton.styled';

interface CopyIconProps {
    icon: JSX.Element;
    copyText: string;
}

const CopyButton = ({ icon, copyText }:CopyIconProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
    

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        const id = setTimeout(()=>{
            handleClose();
        }, 2000);
        setTimeoutId(id);
        navigator.clipboard.writeText(copyText)
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return <>
    <IconButton onClick={handleClick}>
        {icon}
    </IconButton>
    <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <PopoverContent>
            <Typography component="p" variant="subtitle1">Copied 🎉</Typography>
        </PopoverContent>
      </Popover>
    </>
}

export default CopyButton;
