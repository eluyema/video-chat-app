import { styled } from "@mui/material";

const WaiterWrapper = styled('div')({
    display: 'flex',
    gap: '10px',
    height: '50px',
    padding: '0 10px',
    alignItems: 'center'
})

const DisplayNameBlock = styled('div')({
    width: "200px"
})

export { WaiterWrapper, DisplayNameBlock }