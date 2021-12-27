import { ActionReducerMapBuilder, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../redux/store';
import localStorageService from '../../services/LocalStorageService';

interface AccountState {
  loading: boolean;
  authenticated: boolean;
  account: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  businessAcc?: {
    businessId: number;
  };
  clientAcc?: {
    website: string;
    businessName: string;
    status: string;
    industry: string;
  };
  employeeAcc?: {
    title?: string;
  };
  admin?: boolean;
}

const initialState: AccountState = {
  loading: true,
  authenticated: false,
  account: {
    email: '',
    firstName: '',
    lastName: '',
    role: '',
  },
  businessAcc: undefined,
  clientAcc: undefined,
  employeeAcc: undefined,
  admin: false,
};

export const getAccount = createAsyncThunk('getAccount', async () => {
  const response = await axios.get('/redux/accounts/');
  return response.data;
});

export const logout = createAsyncThunk('logout', async () => {
  const response = await axios.delete('/auth/logout', {
    params: { refresh_token: localStorageService.getRefreshToken() },
  });
  return response.data;
});

export const AccountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<AccountState>) => {
    builder
      .addCase(getAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccount.fulfilled, (state, action) => {
        if (action.payload.account) {
          state.authenticated = true;
          state.account = action.payload.account;
          state.businessAcc = action.payload.businessAcc!;
          state.clientAcc = action.payload.clientAcc!;
          state.employeeAcc = action.payload.employeeAcc!;
          state.admin = action.payload.admin === true;
          state.loading = false;
        }
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authenticated = false;
        state.account = { email: '', firstName: '', lastName: '', role: '' };
        state.businessAcc = undefined;
        state.clientAcc = undefined;
        state.employeeAcc = undefined;
        state.admin = false;
        localStorageService.clearAllTokens();
        state.loading = false;
      })
      .addCase(logout.rejected, (state) => {
        console.log('error while logging out');
      });
  },
});

export const selectAccount = (state: RootState) => state.account;

export default AccountSlice.reducer;
