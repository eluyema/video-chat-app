import { DisplayNameBlock, WaiterWrapper } from "./Waiter.styled"
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { safeParse } from "../../../../utils/json/safeParse";
import { getEclipse } from "../../../../utils/string/getEclipse";

interface WaiterProps {
    socketId: string;
    identity: string;
    isMySession: boolean;
    handleAprove: (socketId: string) => void;
    handleDecline: (socketId: string) => void;
}

const eclipseEdge = 21;

const Waiter =({ socketId, identity, isMySession, handleAprove, handleDecline}:WaiterProps)=>{
    const data = safeParse(identity);

    return <WaiterWrapper>
        <DisplayNameBlock>
            <Typography component="p" variant="subtitle1">
                {!!data.displayName && getEclipse(data.displayName, eclipseEdge)}
            </Typography>
        </DisplayNameBlock>
        {isMySession &&(<>
        <Button variant="contained" color="success" onClick={()=>handleAprove(socketId)}>Aprove</Button>
        <Button variant="outlined" color="error" onClick={()=>handleDecline(socketId)}>Decline</Button>
        </>)
        }
    </WaiterWrapper>
}

export default Waiter;