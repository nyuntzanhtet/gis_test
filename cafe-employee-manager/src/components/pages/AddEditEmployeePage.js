import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, updateEmployee } from '../../features/employeesSlice';
import { fetchCafes } from '../../features/cafesSlice';

const EditEmployeePage = (props) => {
  const {
    employee: editEmployee,
    handleCancel,
  } = props;
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState(editEmployee);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const cafes = useSelector((state) => state.cafes.cafes);
  const [openDialog, setOpenDialog] = useState(false); 

  useEffect(() => {
    dispatch(fetchCafes());
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
    setIsEditing(true);
  };

  // Validation logic
  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!employee.name || employee.name.length < 6 || employee.name.length > 10) {
      newErrors.name = 'Name must be between 6 and 10 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email_address)) {
      newErrors.email = 'Enter a valid email address';
    }

    // Phone number validation
    const phoneRegex = /\d{7}$/;
    if (!phoneRegex.test(employee.phone_number)) {
      newErrors.phone_number = 'Enter a valid Singapore phone number';
    }

    if (!employee.cafe_id) {
      newErrors.cafe_id = 'Select a valid cafe';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Abort if validation fails

    try {
      if (employee.id) {
        await dispatch(updateEmployee(employee));
      } else {
        await dispatch(addEmployee(employee));
      }
      setIsEditing(false); // Mark changes as saved
      handleCancel();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const onNo = () => {
    setOpenDialog(false);
  };

  const onYes = () => {
    setOpenDialog(false);
    setIsEditing(false);
    handleCancel();
  }

  const handleClose = () => {
    if (isEditing) {
      setOpenDialog(true);
    } else {
      handleCancel();
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
      <TextField
        name="name"
        label="Name"
        value={employee.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        name="email_address"
        label="Email"
        fullWidth
        required
        margin="normal"
        value={employee.email_address}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        name="phone_number"
        label="Phone Number"
        value={employee.phone_number}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        error={!!errors.phone_number}
        helperText={errors.phone_number}
      />
      <FormControl fullWidth margin="normal">
        <FormLabel>Gender</FormLabel>
        <RadioGroup
          name="gender"
          value={employee.gender}
          onChange={handleChange}
          row
        >
          <FormControlLabel value="M" control={<Radio />} label="Male" />
          <FormControlLabel value="F" control={<Radio />} label="Female" />
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Select
          name="cafe_id"
          value={employee.cafe_id}
          onChange={handleChange}
          displayEmpty
          error={!!errors.cafe_id}
          helperText={errors.cafe_id}
        >
          <MenuItem value="" disabled>
            Select a Cafe
          </MenuItem>
          {cafes.map((cafe, index) => (
            <MenuItem key={index} value={cafe.id}>
              {cafe.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Discard Changes</DialogTitle>
        <DialogContent>
          Are you sure to discard your changes?
        </DialogContent>
        <DialogActions>
          <Button onClick={onNo} color="secondary">
            No
          </Button>
          <Button onClick={onYes} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditEmployeePage;
