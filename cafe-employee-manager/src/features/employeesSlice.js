import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = '';

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (cafeId) => {
  const response = await axios.get(`${API_BASE_URL}/employees`, {
    params: { cafe: cafeId },
  });
  return response.data;
});

export const addEmployee = createAsyncThunk('employees/addEmployee', async (employee) => {
  const response = await axios.post(`${API_BASE_URL}/employees`, employee);
  return response.data;
});

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id) => {
  await axios.delete(`${API_BASE_URL}/employees/${id}`);
  return id;
});

export const updateEmployee = createAsyncThunk('employees/updateEmployee', async (employee) => {
  const response = await axios.put(`${API_BASE_URL}/employees/${employee.id}`, employee);
  return response.data;
});


const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      state.employees = action.payload;
    })
    .addCase(addEmployee.fulfilled, (state, action) => {
      state.employees.push(action.payload);
    })
    .addCase(deleteEmployee.fulfilled, (state, action) => {
      state.employees = state.employees.filter((employee) => employee.id !== action.payload);
    })
    .addCase(updateEmployee.fulfilled, (state, action) => {
      const updatedEmployee = action.payload;
      state.employees = state.employees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      );
    });;
  },
});

export default employeesSlice.reducer;
