import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCafes, deleteCafe, filterCafesByLocation } from '../../features/cafesSlice';
import { Button, Dialog, DialogTitle, DialogContent, Select, InputLabel, FormControl, MenuItem, DialogActions } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import AddEditCafePage from './AddEditCafePage';
import { Link } from "react-router";
import DeleteDialog from '../common/DeleteDialog';

const CafesPage = () => {
  const dispatch = useDispatch();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [cafe, setCafe] = useState(null);
  const [location, setLocation] = useState('-1');
  const [locations, setLocations] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const cafes = useSelector((state) => state.cafes.cafes);
  const filteredCafes = useSelector((state) => state.cafes.filteredCafes);

  useEffect(() => {
    dispatch(fetchCafes());
  }, [dispatch]);

  useEffect(() => {
    if (cafes.length > 0) {
      const cafeLocation = cafes.reduce((prev, current) => {
        if (!prev.includes(current.location)) {
          return [
            ...prev,
            current.location,
          ];
        }
        return prev;
      }, []);
      setLocations(cafeLocation);
    }
  }, [cafes]);

  const handleAddCafe = () => {
    setCafe({
      name: '',
      description: '',
      location: '',
    });
    setOpenDialog(true);
  };

  const handleDeleteCafe = (id) => {
    setDeleteId(id);
  };

  const handleEdit = (editId) => {
    setOpenDialog(true);
    setCafe(cafes.filter(c => c.id === editId)[0]);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCafe(null);
    dispatch(fetchCafes());
  }

  const columns = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Description', field: 'description' },
    { headerName: 'Location', field: 'location' },
    { 
      headerName: 'Employees',
      field: 'employee_count',
      cellRenderer: ({ value, data }) => (
        <>
          <Link to={`/employees/${data.id}`}>{value}</Link>
        </>
      ),
    },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: ({ value }) => (
        <>
          <Button onClick={() => handleDeleteCafe(value)}>Delete</Button>
          <Button onClick={() => handleEdit(value)}>Edit</Button>
        </>
      ),
    },
  ];

  const handleLocationChange = ({ target: { value } }) => {
    dispatch(filterCafesByLocation(value === '-1' ? null : value));
    setLocation(value);
  };

  const onYes = async (id) => {
    await dispatch(deleteCafe(id));
    await dispatch(fetchCafes());
    setDeleteId(null);
  };

  const onNo = () => {
    setDeleteId(null);
  };

  return (
    <div>
      <h1>Cafes</h1>
      <FormControl fullWidth margin="normal">
        <InputLabel>Location</InputLabel>
        <Select
          value={location}
          onChange={handleLocationChange}
          label="Location"
        >
          <MenuItem value="-1">All Locations</MenuItem>
          {locations.map((loc, index) => (
            <MenuItem key={index} value={loc}>
              {loc}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleAddCafe}>
        Add Cafe
      </Button>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact rowData={filteredCafes} columnDefs={columns} />
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{cafe?.id ? 'Edit' : 'Add'} Cafe</DialogTitle>
        <DialogContent>
          <AddEditCafePage
            cafe={cafe}
            handleCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
      <DeleteDialog id={deleteId} onYes={onYes} onNo={onNo} />
    </div>
  );
};

export default CafesPage;
