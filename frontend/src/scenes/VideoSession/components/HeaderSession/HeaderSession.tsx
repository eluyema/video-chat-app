import {SessionDateBlock, SessionDescriptionBlock, SessionNameBlock} from './HeaderSession.styled';
import { Typography } from '@mui/material';
import moment from 'moment';
import { SessionInfoI } from '../../../../common/types/sessions';

interface HeaderSessionProps {
    sessionInfo: SessionInfoI;
}

const HeaderSession = ({sessionInfo}: HeaderSessionProps) => {
    return (
        <div><SessionNameBlock>
            <Typography variant="h3" component="h1">
                {sessionInfo.title}
            </Typography>
        </SessionNameBlock><SessionDescriptionBlock>
                <Typography variant="h5" component="h6">
                    {sessionInfo.description && sessionInfo.description.length > 120 ?
                        sessionInfo.description.slice(0, 120) + '...' : sessionInfo.description}
                </Typography>
            </SessionDescriptionBlock><SessionDateBlock>
                <Typography variant="h6" component="h3">
                    {sessionInfo.plannedDate !== null && moment(sessionInfo.plannedDate).format('MMMM Do YYYY, h:mm:ss a')}
                </Typography>
            </SessionDateBlock>
        </div>
    )
}

export default HeaderSession;
