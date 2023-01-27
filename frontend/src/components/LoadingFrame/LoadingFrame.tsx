import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { LoadingFrameWrapper, LoadingTextWrapper } from './LoadingFrame.styled';

interface LoadingFrame {
    description: string;
}

const LoadingFrame = ({description}: LoadingFrame) => {
    return <LoadingFrameWrapper>
        <CircularProgress />
        <LoadingTextWrapper>
            <Typography variant="subtitle2" component="h6">
                {description}
            </Typography>
        </LoadingTextWrapper>
    </LoadingFrameWrapper>
}

export default LoadingFrame;