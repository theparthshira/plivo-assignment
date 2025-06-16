import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosMiddleware from "../lib/axios";
import type { MembersList } from "../types/organisation";
import type { IMember } from "../types/user";
import { nl } from "zod/v4/locales";

export const getMembers = createAsyncThunk(
  "admin/get-organisation-members",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/get-organisation-members/${data}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const addMember = createAsyncThunk(
  "admin/add-organisation-member",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/add-organisation-member`,
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const getMemberRole = createAsyncThunk(
  "admin/get-user-role",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/get-user-role/${data?.user_id}`,
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

type MemberType = {
  teamMembers: MembersList[] | null;
  currentMember: IMember | null;
};

const initialState: MemberType = {
  teamMembers: [],
  currentMember: null,
};

export const MemberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMembers.fulfilled, (state, action) => {
      state.teamMembers = action.payload.data;
    });
    builder.addCase(getMemberRole.fulfilled, (state, action) => {
      state.currentMember = action.payload.data;
    });
  },
});

export default MemberSlice.reducer;
