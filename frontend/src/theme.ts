import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    info: {
        light: '#787878',
        main: '#6d6d6d',
        dark: '#585858'
    }
  },
});

export default theme;