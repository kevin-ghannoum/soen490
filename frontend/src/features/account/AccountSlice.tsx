import { ActionReducerMapBuilder, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface AccountState {
  loading: boolean;
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
  loading: false,
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

const getBusinessAccount = createAsyncThunk('getBusinessAccount', async (email: string) => {
  const response = await axios.get('/redux/accounts/business/:email');
  return response.data;
});

export const AccountSlice = createSlice({
  name: 'businessAccount',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<AccountState>) => {
    builder
      .addCase(getBusinessAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBusinessAccount.fulfilled, (state, action) => {
        console.log(action.payload);
        state.account = action.payload.account;
        state.businessAcc = action.payload.businessAcc;
      });
  },
});
