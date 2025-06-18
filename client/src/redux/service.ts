import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosMiddleware from "../lib/axios";
import type { ILog, IMaintenance, IService } from "../types/service";

export const createService = createAsyncThunk(
  "admin/create-service",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/create-service`,
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const deleteService = createAsyncThunk(
  "admin/delete-service",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/delete-service/${data?.id}`,
      method: "DELETE",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const updateService = createAsyncThunk(
  "admin/update-service",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/update-service/${data?.id}`,
      method: "PUT",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const getServices = createAsyncThunk(
  "admin/get-organisation-services",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/get-organisation-services/${data}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

export const getServiceDetails = createAsyncThunk(
  "admin/get-service",
  async (data: any) => {
    const response = axiosMiddleware.request({
      url: `/v1/admin/get-service/${data}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
);

type ServiceType = {
  isServicesLoading: boolean;
  services: Partial<IService>[] | null;
  serviceDetail: {
    Logs: ILog[] | null;
    Service: IService | null;
    Maintenances: IMaintenance[] | null;
  };
};

const initialState: ServiceType = {
  isServicesLoading: false,
  services: [],
  serviceDetail: {
    Logs: [],
    Service: null,
    Maintenances: [],
  },
};

export const ServiceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServices.pending, (state) => {
      state.isServicesLoading = true;
    });
    builder.addCase(getServices.fulfilled, (state, action) => {
      state.isServicesLoading = false;

      const response = action.payload.data;

      state.services = response;
    });
    builder.addCase(getServices.rejected, (state) => {
      state.isServicesLoading = false;
    });
    builder.addCase(getServiceDetails.fulfilled, (state, action) => {
      const response = action.payload.data;

      state.serviceDetail = {
        Logs: response?.Logs,
        Service: response?.Service,
        Maintenances: response?.Maintenances,
      };
    });
  },
});

export const {} = ServiceSlice.actions;
export default ServiceSlice.reducer;
