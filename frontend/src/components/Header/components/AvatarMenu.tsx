import {useContext, useState, MouseEvent} from 'react';
import { Avatar, IconButton, MenuItem, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { IUser } from '../../../common/types/users';
import {AvatarDropdown} from './AvatarMenu.styled';
import { AvatarMenuOptions, Settings } from './constants';
import { AlertContext } from '../../../Providers/AlertProvider/AlertProvider';
import { useNavigate } from 'react-router-dom';

interface IAvatarMenuProps {
    user: IUser;
    logout: () => Promise<void>;
}

const AvatarMenu = ({ user, logout }: IAvatarMenuProps) => {

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const { showAlert } = useContext(AlertContext);
    const navigate = useNavigate();
    const shortName = user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
      };
    
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const onMenuItemClick = (itemName: string) => {
        switch(itemName) {
            case Settings.LOGOUT: {
                setAnchorElNav(null);
                logout().then(()=> {
                  showAlert("success", "Success logout", 6);
                })
                break;
            }
            case Settings.PROFILE: {
                setAnchorElNav(null);
                navigate("/profile")
                break;
            }
            case Settings.SESSIONS: {
              setAnchorElNav(null);
              navigate("/sessions/list")
              break;
          }
            default: {
                setAnchorElNav(null);
            }
        }
        handleCloseUserMenu();
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Box>
        <Tooltip title="Open menu">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="Remy Sharp">{shortName}</Avatar>
          </IconButton>
        </Tooltip>
        <AvatarDropdown
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {AvatarMenuOptions.map((optionName) => (
            <MenuItem key={optionName} onClick={()=>{onMenuItemClick(optionName)}}>
              <Typography textAlign="center">{optionName}</Typography>
            </MenuItem>
          ))}
        </AvatarDropdown>
      </Box>
    )
}

export default AvatarMenu;