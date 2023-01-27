import { Box } from '@mui/system';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { AppContainer } from './AppWrapper.styled';

const AppWrapper = () => {
    return <AppContainer>
        <Header/>
        <Outlet />
    </AppContainer>
}

export default AppWrapper;
