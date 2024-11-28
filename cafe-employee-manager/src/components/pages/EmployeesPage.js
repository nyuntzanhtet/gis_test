import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '../../features/employeesSlice';
import { AgGridReact } from 'ag-grid-react';
import { useParams } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddEditEmployeePage from './AddEditEmployeePage';
import DeleteDialog from '../common/DeleteDialog';

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const { cafeId } = useParams();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const employees = useSelector((state) => state.employees.employees);

  useEffect(() => {
    dispatch(fetchEmployees(cafeId));
  }, [dispatch]);

  const columns = [
    { headerName: 'Employee ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Email', field: 'email_address' },
    { headerName: 'Phone Number', field: 'phone_number' },
    { headerName: 'Days worked in the café', field: 'total_days' },
    { headerName: 'Café Name', field: 'cafe_name' },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: ({ value }) => (
        <>
          <Button onClick={() => handleDelete(value)}>Delete</Button>
          <Button onClick={() => handleEdit(value)}>Edit</Button>
        </>
      ),
    },
  ];

  const handleEdit = (editId) => {
    setOpenDialog(true);
    setEmployee(employees.filter(e => e.id === editId)[0]);
  }

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const onYes = async (id) => {
    await dispatch(deleteEmployee(id));
    await dispatch(fetchEmployees(cafeId));
    setDeleteId(null);
  };

  const onNo = () => {
    setDeleteId(null);
  };

  const handleAddEmployee = () => {
    setOpenDialog(true);
    setEmployee({
      name: '',
      email_address: '',
      phone_number: '',
      gender: 'M',
      cafe_id: '',
    });
  }

  const handleCloseDialog = async () => {
    setOpenDialog(false);
    await dispatch(fetchEmployees(cafeId));
  };

  return (
    <div>
      <h1>Employees</h1>
      <Button variant="contained" onClick={handleAddEmployee}>
        Add Employee
      </Button>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact rowData={employees} columnDefs={columns} />
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{employee?.id ? 'Edit' : 'Add'} Employee</DialogTitle>
        <DialogContent>
          <AddEditEmployeePage
            employee={employee}
            handleCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
      <DeleteDialog id={deleteId} onYes={onYes} onNo={onNo} />
    </div>
  );
};

export default EmployeesPage;
