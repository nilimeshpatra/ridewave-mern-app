import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const bookRide = createAsyncThunk(
  "ride/book",
  async (rideData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/rides/book", rideData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getMyRides = createAsyncThunk(
  "ride/myRides",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/rides/my-rides");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAvailableRides = createAsyncThunk(
  "ride/available",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/rides/available");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const rideSlice = createSlice({
  name: "ride",
  initialState: {
    rides: [],
    availableRides: [],
    currentRide: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearRideError: (state) => {
      state.error = null;
    },
    setCurrentRide: (state, action) => {
      state.currentRide = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookRide.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRide = action.payload;
      })
      .addCase(bookRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyRides.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyRides.fulfilled, (state, action) => {
        state.loading = false;
        state.rides = action.payload;
      })
      .addCase(getMyRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAvailableRides.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAvailableRides.fulfilled, (state, action) => {
        state.loading = false;
        state.availableRides = action.payload;
      })
      .addCase(getAvailableRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRideError, setCurrentRide } = rideSlice.actions;
export default rideSlice.reducer;
