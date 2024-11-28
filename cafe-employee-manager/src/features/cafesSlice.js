import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = '';

export const fetchCafes = createAsyncThunk('cafes/fetchCafes', async () => {
  const response = await axios.get(`${API_BASE_URL}/cafes`);
  return response.data;
});

export const addCafe = createAsyncThunk('cafes/addCafe', async (cafe) => {
  const response = await axios.post(`${API_BASE_URL}/cafes`, cafe);
  return response.data;
});

export const deleteCafe = createAsyncThunk('cafes/deleteCafe', async (id) => {
  await axios.delete(`${API_BASE_URL}/cafes/${id}`);
  return id;
});

export const updateCafe = createAsyncThunk('cafes/updateCafe', async (cafe) => {
  const response = await axios.put(`${API_BASE_URL}/cafes/${cafe.id}`, cafe);
  return response.data;
});

const cafesSlice = createSlice({
  name: 'cafes',
  initialState: {
    cafes: [],
    filteredCafes: [],
    location: '',
  },
  reducers: {
    filterCafesByLocation: (state, action) => {
      const location = action.payload;
      return {
        ...state,
        location: location ? location : '',
        filteredCafes: location ? state.cafes.filter((cafe) => cafe.location === location) : state.cafes,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCafes.fulfilled, (state, action) => {
        state.cafes = action.payload;
        state.filteredCafes = action.payload.filter(cafe => cafe.location === state.location || state.location === '');
      })
      .addCase(addCafe.fulfilled, (state, action) => {
        state.cafes.push(action.payload);
        state.filteredCafes = state.cafes.filter(cafe => cafe.location === state.location || state.location === '');
      })
      .addCase(deleteCafe.fulfilled, (state, action) => {
        state.cafes = state.cafes.filter((cafe) => cafe.id !== action.payload);
        state.filteredCafes = state.cafes.filter(cafe => cafe.location === state.location || state.location === '');
      })
      .addCase(updateCafe.fulfilled, (state, action) => {
        const updatedCafe = action.payload;
        state.cafes = state.cafes.map((cafe) =>
          cafe.id === updatedCafe.id ? updatedCafe : cafe
        );
        state.filteredCafes = state.cafes.filter(cafe => cafe.location === state.location || state.location === '');
      });
  },
});

export const { filterCafesByLocation } = cafesSlice.actions;

export default cafesSlice.reducer;
