import React from 'react';
import { ListOfWaitersEmptyBlock, ListOfWaitersHeader, ListOfWaitersWrapper } from './ListOfWaiters.styled';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Waiter from './component/Waiter/Waiter';
import { WaiterInfo } from '../../common/types/users';
import Badge from '@mui/material/Badge';
import { Typography } from '@mui/material';


interface ListOfWaitersProps {
    waiters: WaiterInfo[];
    handleApprove: (id: string) => void;
    handleDecline: (id: string) => void;
    isMySession: boolean;
}

const ListOfWaiters = ({waiters, handleApprove, handleDecline, isMySession}: ListOfWaitersProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    console.log(waiters.length)
    return (
        <ListOfWaitersWrapper>
        <Badge showZero sx={{width: '400px'}} color="secondary" badgeContent={waiters.length} invisible={waiters.length === 0}>
            <ListOfWaitersHeader
            variant="contained"
            color="info"
            onClick={handleClick}
            sx={{textTransform: 'capitalize'}}
            >
                Waiters list
            </ListOfWaitersHeader>
        </Badge>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          sx={{width: "500px", maxHeight: '300px'}}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
            {waiters.length === 0 && <ListOfWaitersEmptyBlock>
                <Typography component={"h2"} variant="body1">
                    No waiters
                </Typography>
            </ListOfWaitersEmptyBlock>}
            {waiters.map((data)=><Waiter key={data.socketId} {...data} isMySession={isMySession} handleAprove={handleApprove} handleDecline={handleDecline}/>)}
        </Menu>
      </ListOfWaitersWrapper>
    )
}

export default ListOfWaiters;