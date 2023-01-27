import { useEffect, useRef, useState } from "react";
import Participant from "../Participant/Participant";
import { PageNavigator, ParticipantsContainer, PartisipantsSection } from "./Partisipants.styled";

const basePageCapacity = 12;

interface PartisipantsContainerI {
    localParticipantSid: string;
    participants: any[];
}

const PartisipantsContainer = ({localParticipantSid, participants}: PartisipantsContainerI) => {
    const [page, setPage] = useState(0);
    const [pinnedSid, setPinnesSid] = useState("");



    const partisipantsCount = participants.length;

    const pageCapacity = pinnedSid ? 4 : basePageCapacity;
    const currentIndex = page * pageCapacity;

    const pagePartisipants = [ ...participants]
        .slice(currentIndex, currentIndex + pageCapacity);
    console.log(pagePartisipants);
    const showLeftNavigator = currentIndex + 1 > pageCapacity;
    const showRightNavigator = currentIndex + pageCapacity < partisipantsCount;

    const pinnedPart = participants.find(({sid})=>pinnedSid === sid);

    const increaseCurrentPage = (num: number) => ()=> {
        setPage(page =>page + num)
    };

    const fixParticipant = (newSid: string)=>{
        const isExist = participants.some(({sid})=>newSid === sid);
        if(newSid === pinnedSid) {
            setPinnesSid("");
        } else if (isExist) {
            setPinnesSid(newSid);
        }
    }

    useEffect(()=>{
        const isExist = participants.some(({sid})=>pinnedSid === sid);
        if(!isExist) {
            setPinnesSid("");
        }
    },[participants])

    console.log(currentIndex + pageCapacity, partisipantsCount)
    return <PartisipantsSection>
        {showLeftNavigator && <PageNavigator onClick={increaseCurrentPage(-1)} isLeft color="primary" fontSize="large" />}
        <ParticipantsContainer count={pinnedPart ? 20 : participants.length}>
            {
            pagePartisipants && pagePartisipants.filter(({sid})=>pinnedSid !== sid).map(participant => 
                <Participant
                    fixMe={fixParticipant}
                    fixed={false}
                    key={participant.identity}
                    participant={participant}
                    isLocal={participant.sid === localParticipantSid}
                />
            )
            }
        </ParticipantsContainer>
        {
            pagePartisipants && pinnedPart
                 &&(<Participant
                    fixMe={fixParticipant}
                    fixed={true}
                    key={pinnedPart.identity}
                    participant={pinnedPart}
                    isLocal={pinnedPart.sid === localParticipantSid}
                />
            ) || false
            }
        {showRightNavigator && <PageNavigator onClick={increaseCurrentPage(1)} color="primary" fontSize="large" />}
  </PartisipantsSection>
}

export default PartisipantsContainer;