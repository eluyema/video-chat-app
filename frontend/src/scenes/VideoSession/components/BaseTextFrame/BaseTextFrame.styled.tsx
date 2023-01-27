import styled from "@emotion/styled";
import { Button } from "@mui/material";

const BaseTextFrameWrapper = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
})

const DescriptionBlock = styled.div({
    marginTop: '20vh',
    marginBottom: '3vh',
    display: 'flex',
    justifyContent: 'center',
})

const ReturnButtonBlock = styled.div({
    marginTop: '2vh',
    display: 'flex',
    justifyContent: 'center',
})

export { BaseTextFrameWrapper, DescriptionBlock, ReturnButtonBlock }