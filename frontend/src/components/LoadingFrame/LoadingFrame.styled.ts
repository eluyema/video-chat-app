import { styled } from "@mui/material";

const LoadingFrameWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '35vh'
})

const LoadingTextWrapper = styled('div')({
    paddingTop: 20
})

export { LoadingFrameWrapper, LoadingTextWrapper }
