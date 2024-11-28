import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const DeleteDialog = (props) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(null);

  useEffect(() => {
    if (props.id) {
      setOpenDeleteDialog(true);
    } else {
      setOpenDeleteDialog(false);
    }
  }, [props.id]);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    props.onNo();
  };

  const onYesHandle = () => {
    props.onYes(props.id);
    setOpenDeleteDialog(false);
  };

  const onNoHandle = () => {
    handleCloseDeleteDialog();
  };

  return (
    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Record</DialogTitle>
      <DialogContent>
        Are you sure to delete this record?
      </DialogContent>
      <DialogActions>
        <Button onClick={onNoHandle} color="secondary">
          No
        </Button>
        <Button onClick={onYesHandle} color="primary" variant="contained">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;