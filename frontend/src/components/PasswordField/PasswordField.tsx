import { ChangeEvent, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { FormHelperText, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordFieldI {
    fullWidth?: boolean;
    name?: string;
    label?: string;
    value?: string;
    onChange: (e: ChangeEvent ) => void;
    error?: boolean;
    helperText?: string | boolean;
}

const PasswordField = (props: PasswordFieldI) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    return <FormControl fullWidth={props.fullWidth} variant="outlined">
    <InputLabel error={props.error} htmlFor="outlined-adornment-password">{props.label || 'Password'}</InputLabel>
    <OutlinedInput
      type={showPassword ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
      {!!props.helperText && (
    <FormHelperText error id="accountId-error">
      {props.helperText}
    </FormHelperText>
  )}
  </FormControl>
}

export default PasswordField;