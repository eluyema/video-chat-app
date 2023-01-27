import { Button, Typography } from "@mui/material";
import { DescriptionBlock, BaseTextFrameWrapper, ReturnButtonBlock } from "./BaseTextFrame.styled";
import { Link } from "react-router-dom";

interface BaseTextFrameProps {
    text: string;
    emoji: string;
}

const BaseTextFrame = ({ text, emoji }: BaseTextFrameProps) => {
    return <BaseTextFrameWrapper>
        <DescriptionBlock>
            <Typography component={'h2'} variant='h4'>
                {text}
            </Typography>
        </DescriptionBlock>
        <Typography component={'span'} variant='h1'>{emoji}</Typography>
        <ReturnButtonBlock>
            <Button component={Link} to="/" variant="contained">Return to main page</Button>
        </ReturnButtonBlock>
    </BaseTextFrameWrapper>
}

export default BaseTextFrame;