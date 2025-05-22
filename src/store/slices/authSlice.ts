import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface AuthState {
  token: string | null;
  role: string | null;
  fullname: string | null;
  userId: number | 0;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  role: null,
  fullname: null,
  userId: 0,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; role: string; fullname: string; userId: number }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.fullname = action.payload.fullname;
      state.userId = action.payload.userId
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.fullname = null;
      state.userId = 0;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('role');
      AsyncStorage.removeItem('fullname');
      AsyncStorage.removeItem('userId');
    },
  },
});


export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;