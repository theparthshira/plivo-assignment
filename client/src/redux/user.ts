import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosMiddleware from "../lib/axios";
import type { IUser } from "../types/user";
import type { IOrganisation } from "../types/organisation";

export const logInUser = createAsyncThunk("admin/signin", async (data: any) => {
  const response = axiosMiddleware.request({
    url: `/v1/admin/signin`,
    method: "POST",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
});

export const getUserOrganisations = createAsyncThunk(
  "admin/get-user-organisation",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/get-user-organisation/${data}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

type UserType = {
  user: IUser | null;
  organisations: IOrganisation[] | null;
  isUserLoading: boolean;
};

const initialState: UserType = {
  user: null,
  organisations: [],
  isUserLoading: false,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(logInUser.pending, (state) => {
      state.isUserLoading = true;
    });
    builder.addCase(logInUser.fulfilled, (state, action) => {
      state.isUserLoading = false;
      console.log("state, action =====", state, action);

      const response = action.payload.data;

      if (response?.Organisations) {
        state.organisations = response?.Organisations;
      }

      if (response?.User) {
        state.user = response?.User;
      }
    });
    builder.addCase(logInUser.rejected, (state) => {
      state.isUserLoading = false;
    });
    builder.addCase(getUserOrganisations.fulfilled, (state, action) => {
      const response = action.payload.data;

      if (response) {
        state.organisations = response;
      }
    });
  },
});

export default UserSlice.reducer;
