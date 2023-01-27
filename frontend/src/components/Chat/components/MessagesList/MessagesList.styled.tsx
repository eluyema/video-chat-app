import { styled } from "@mui/material";

const MessagesListWrapper = styled('div')({
    display: "flex",
    flexDirection: 'column',
    overflowY: 'auto',
    padding: '10px 2px',
    flex: 1
})

const MessageWrapper = styled('div')({
    padding: '10px 5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
})

const MessageName = styled('div')({
    width: '200px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '16px'
})

const MessageBody = styled('div')({
    padding: '5px 7px',
    borderRadius: '5px',
    background: '#ebebff'
})

export { MessagesListWrapper, MessageWrapper, MessageName, MessageBody};
