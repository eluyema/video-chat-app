import { styled } from "@mui/material";
import { Paper } from '@mui/material';

const ChatWrapper = styled(Paper)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '75vh'
})

export {
    ChatWrapper,
}