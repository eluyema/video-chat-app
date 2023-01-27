import { useContext } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { HeaderBar, HeaderContainer, LoaderCircle, ToolbarContainer } from './Header.styled';
import { Link } from "react-router-dom";
import { UserContext } from '../../Providers/UserProvider/UserProvider';
import AvatarMenu from './components/AvatarMenu';
import { IUser } from '../../common/types/users';

const Header = () => {
  const { user, loading, logout } = useContext(UserContext)

  return <HeaderContainer>
    <HeaderBar position="static">
      <ToolbarContainer>
        <Link to="/">
          <Typography variant="h6" component="span" color="white" sx={{ flexGrow: 1 }}>
            Video Chat App
          </Typography>
        </Link>
        {
         loading ? (<LoaderCircle variant='indeterminate' size="40px" />):
          user ? (<AvatarMenu logout={logout} user={user as IUser}/>) :
            (<Button component={Link} to={"/login"} color="inherit">Login</Button>)
        }
      </ToolbarContainer>
    </HeaderBar>
  </HeaderContainer>
}

export default Header;