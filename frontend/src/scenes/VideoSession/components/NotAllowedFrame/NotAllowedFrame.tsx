import { SessionInfoI } from "../../../../common/types/sessions";
import HeaderSession from "../HeaderSession/HeaderSession";
import { NotAllowedFrameWrapper, NotAllowedFrameMessageBlock } from "./NotAllowedFrame.styled";
import Typography from '@mui/material/Typography/Typography';

interface NotAllowedFrameProps {
    sessionInfo: SessionInfoI;
    text: string
}

const NotAllowedFrame = ({ sessionInfo, text }: NotAllowedFrameProps) => {
    return (
        <NotAllowedFrameWrapper>
            <HeaderSession sessionInfo={sessionInfo}/>
            <NotAllowedFrameMessageBlock>
                <Typography component="h4" variant="h5">
                    {text}
                </Typography>
                <Typography component="h6" variant="h1">😔</Typography>
            </NotAllowedFrameMessageBlock>
        </NotAllowedFrameWrapper>
    )
}

export default NotAllowedFrame;