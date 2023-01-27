import { styled } from "@mui/material";
import Button from '@mui/material/Button';

const ListOfWaitersWrapper = styled('div')({
    display: 'flex',
    position: "absolute",
    top: '60px',
    left: '0px',
    width: '400px',
})

const ListOfWaitersHeader = styled(Button)({
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
})

const ListOfWaitersEmptyBlock = styled('div')({
    width: '400px',
    height:'60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
})

export { ListOfWaitersWrapper, ListOfWaitersHeader, ListOfWaitersEmptyBlock }