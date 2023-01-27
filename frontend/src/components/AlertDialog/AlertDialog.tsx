import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { DialogDescription, LoadingButtonCircle } from './AlertDialog.styled';
import CircularProgress from '@mui/material/CircularProgress';

interface IAlertDialog {
    onAgree: () => void;
    onDisagree: () => void;
    open: boolean;
    loading: boolean;
    title: string;
    description?: string;
    agreeText?: string;
    disagreeText?: string;
}

const AlertDialog = ({
    onAgree,
    onDisagree,
    open,
    title,
    loading,
    description = "This action cannot be undone",
    agreeText = "Agree",
    disagreeText = "Disagree"
}: IAlertDialog) => {

  return (
    <div>
      <Dialog
        open={open}
        onClose={onDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogContent>
        <DialogActions>
          {loading ? (<LoadingButtonCircle size={25}/>): (
            <>
            <Button disabled={loading} onClick={onDisagree} autoFocus>
              {disagreeText}
            </Button>
            <Button disabled={loading} color="error" onClick={onAgree}>{agreeText}</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog;
