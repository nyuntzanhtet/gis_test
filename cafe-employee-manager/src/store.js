import { configureStore } from '@reduxjs/toolkit';
import cafesReducer from './features/cafesSlice';
import employeesReducer from './features/employeesSlice';

export const store = configureStore({
  reducer: {
    cafes: cafesReducer,
    employees: employeesReducer,
  },
});
