import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosMiddleware from "../lib/axios";
import type { MembersList } from "../types/organisation";
import type { IIncident, IIncidentComment } from "../types/incident";

export const addIncident = createAsyncThunk(
  "admin/add-new-incident",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/client/add-new-incident`,
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const getAllIncidents = createAsyncThunk(
  "admin/get-all-incidents",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/get-all-incidents/${data}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const updateIncident = createAsyncThunk(
  "admin/update-incident",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/update-incident/${data?.id}`,
      method: "PUT",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const getServiceIncident = createAsyncThunk(
  "client/get-incident/",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/client/get-incident/${data}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const getIncidentDetail = createAsyncThunk(
  "client/get-incident-detail/",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/client/get-incident-detail/${data}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const getIncidentComments = createAsyncThunk(
  "client/get-incident-comments",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/client/get-incident-comments/${data}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const addIncidentComment = createAsyncThunk(
  "client/add-incident-comment",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/client/add-incident-comment`,
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

type IncidentType = {
  incidents: IIncident[] | null;
  serviceIncidents: IIncident[] | null;
  incidentDetail: IIncident | null;
  incidentComments: IIncidentComment[] | null;
};

const initialState: IncidentType = {
  incidents: [],
  serviceIncidents: [],
  incidentDetail: null,
  incidentComments: [],
};

export const IncidentSlice = createSlice({
  name: "incident",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllIncidents.fulfilled, (state, action) => {
      state.incidents = action.payload.data;
    });
    builder.addCase(getServiceIncident.fulfilled, (state, action) => {
      state.serviceIncidents = action.payload.data;
    });
    builder.addCase(getIncidentDetail.fulfilled, (state, action) => {
      state.incidentDetail = action.payload.data;
    });
    builder.addCase(getIncidentComments.fulfilled, (state, action) => {
      state.incidentComments = action.payload.data;
    });
  },
});

export default IncidentSlice.reducer;
