import { AppBar, Toolbar } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';

const HeaderContainer = styled('div')({
    flexGrow: 1,
    flex: '0'
})

const HeaderBar = styled(AppBar)({
    display: 'flex',
    flexDirection: 'row',
})

const ToolbarContainer = styled(Toolbar)({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
})

const LoaderCircle = styled(CircularProgress)({
    color: "#fff",
})

export { HeaderContainer, HeaderBar, ToolbarContainer, LoaderCircle }
