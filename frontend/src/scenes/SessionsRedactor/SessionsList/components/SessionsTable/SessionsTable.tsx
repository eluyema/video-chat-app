import { useState } from "react";
import { SessionInfoI } from "../../../../../common/types/sessions"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import { SessionsTableContainer } from "./SessionsTable.styled";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import AlertDialog from "../../../../../components/AlertDialog/AlertDialog";
import { deleteSession } from "../../../../../services/sessionsService";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyButton from "../../../../../components/CopyButton/CopyButton";
import { Link } from "react-router-dom";

interface ISessionsTable {
    sessions: SessionInfoI[];
    refetch: () => Promise<void>;
}

const SessionsTable = ({sessions, refetch}: ISessionsTable) => {
    const [sessionForDelete, setSessionForDelete] = useState<SessionInfoI | null>(null);
    const [removeLoading, setRemoveLoading] = useState(false);

    const navigate = useNavigate();
    const [searchBarParams, setSearchBarParams] = useSearchParams();

    const handleDeleteClick = (session: SessionInfoI) => {
        setSessionForDelete(session);
    }

    const removeSession = ()=> {
        if(sessionForDelete && sessionForDelete.shareId){
            setRemoveLoading(true);
            deleteSession(sessionForDelete.shareId).then(()=>{
                return refetch()
            }).finally(()=>{
                setRemoveLoading(false);
                setSessionForDelete(null);
            })
        }
    }

    const deniedRemoveSession = () => {
        setSessionForDelete(null);
    }

    return (
        <>
        <SessionsTableContainer elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell/>
              <TableCell/>
              <TableCell>Name</TableCell>
              <TableCell>Security</TableCell>
              <TableCell>Reusable</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow
                key={session.shareId}
                selected={!!sessionForDelete && sessionForDelete.shareId === session.shareId}
              >
                <TableCell align="center">
                    <IconButton onClick={()=>{
                        handleDeleteClick(session)
                    }} aria-label="Delete">
                        <DeleteIcon htmlColor="red" />
                    </IconButton>
                </TableCell>
                <TableCell align="center">
                    <IconButton component={Link} to={"/sessions/editor/" + session.shareId} aria-label="Edit">
                        <EditIcon htmlColor="gray" />
                    </IconButton>
                </TableCell>
                <TableCell>
                  <Button onClick={()=>{
                        const path = {
                          pathname: "/session/" + session.shareId,
                          search: createSearchParams({"autoStart": "true"}).toString()
                        };
                        navigate(path);
                  }}>
                    {session.isRanning ? "Join": "Start"}</Button>
                </TableCell>
                <TableCell >{session.title}</TableCell>
                <TableCell >{session.security[0].toUpperCase() + session.security.slice(1,session.security.length).toLowerCase()}</TableCell>
                <TableCell >{session.reusable ? "Yes" : "No"}</TableCell>
                <TableCell>
                    <CopyButton icon={<LinkIcon />} copyText={ window.location.origin + "/session/"+session.shareId}/>
                    {window.location.origin + "/session/"+session.shareId}
                </TableCell>
                <TableCell>
                <CopyButton icon={<ContentCopyIcon />} copyText={session.shareId}/>
                  {session.shareId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SessionsTableContainer>
      <AlertDialog
        open={!!sessionForDelete}
        onDisagree={deniedRemoveSession}
        onAgree={removeSession}
        title={"Remove session"}
        loading={removeLoading}
        description={`Are you sure you want delete session ${sessionForDelete?.title}(${sessionForDelete?.shareId}) ?`}
      />
      </>
    )
}

export default SessionsTable;
