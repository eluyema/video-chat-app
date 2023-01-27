import { useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useSearchParams } from "react-router-dom";
import { SessionInfoI } from "../../../../common/types/sessions";
import HeaderSession from "../HeaderSession/HeaderSession";
import { StartSessionWrapper } from "./MySessionForm.styled";

interface MySessionFormProps {
    isJoinCall: boolean;
    sessionInfo: SessionInfoI;
    handleSubmit: () => void;
}

const MySessionForm = ({isJoinCall, sessionInfo, handleSubmit }: MySessionFormProps) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [clicked, setCLicked] = useState(false);
    const autoStart = searchParams.get("autoStart")
    useEffect(()=>{
        if(autoStart) {
            handleSubmit();
            setCLicked(true);
        }
    },[autoStart])
    return <StartSessionWrapper>
        <HeaderSession sessionInfo={sessionInfo}/>
        <Button disabled={clicked} variant="contained" onClick={handleSubmit}>
            {isJoinCall? "Join call" : "Start session"}
            <CircularProgress />
        </Button>
    </StartSessionWrapper>
}

export default MySessionForm;