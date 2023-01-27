import Routing from "../Routing/Routing"
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import AlertProvider from "../../Providers/AlertProvider/AlertProvider";
import UserProvider from "../../Providers/UserProvider/UserProvider";

const App = () => {
    return <UserProvider>
        <AlertProvider>
            <ThemeProvider theme={theme}> <Routing /></ThemeProvider>
        </AlertProvider>
    </UserProvider>
}

export default App;