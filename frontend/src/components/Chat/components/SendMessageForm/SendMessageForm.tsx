import React, { useState } from "react";
import { SendMessageBlock } from "./SendMessageForm.styled";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


interface SendMessageFormProps {
    onSendMessage: (msg: string) => void
}

const SendMessageForm = ({onSendMessage }: SendMessageFormProps) => {
    const [message, setMessage] = useState("")

    const onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        setMessage(e.target.value);
    }

    return <SendMessageBlock>
    <TextField
        id="outlined-multiline-static"
        label="Message"
        multiline
        fullWidth
        rows={4}
        defaultValue="Default Value"
        onChange={onChange}
        value={message}
    />
    <Button color="primary" variant="contained" onClick={()=>{
        onSendMessage(message)
        setMessage("");
    }}>
        Send
    </Button>
    </SendMessageBlock>
}

export default SendMessageForm;