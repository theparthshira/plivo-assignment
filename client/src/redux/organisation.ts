import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosMiddleware from "../lib/axios";
import type { IOrganisation } from "../types/organisation";

export const createOrganisation = createAsyncThunk(
  "admin/create-organisation",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/create-organisation`,
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const updateOrganisation = createAsyncThunk(
  "admin/update-organisatiion",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/update-organisatiion/${data?.id}`,
      method: "PUT",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const getOrganisation = createAsyncThunk(
  "admin/get-organisation",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/get-organisation/${data}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

type OrganisationType = {
  currentOrganisation: IOrganisation | null;
};

const initialState: OrganisationType = {
  currentOrganisation: null,
};

export const UserSlice = createSlice({
  name: "organisation",
  initialState,
  reducers: {
    updateCurrentOrganisation: (state, action) => {
      state.currentOrganisation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrganisation.fulfilled, (state, action) => {
      state.currentOrganisation = action.payload.data;
    });
  },
});

export const { updateCurrentOrganisation } = UserSlice.actions;
export default UserSlice.reducer;
