import axiosInstance from './AxiosInstance';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const PostAxiosInstance = async <T = any>(
  url: string, 
  data?: any, 
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const res = await axiosInstance.post<T>(url, data, config);
  return res;
};

export const GetAxiosInstance = async <T = any>(
  url: string, 
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const res = await axiosInstance.get<T>(url, config);
  return res;
};

export const PatchAxiosInstance = async <T = any>(
  url: string, 
  data?: any, 
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const res = await axiosInstance.patch<T>(url, data, config);
  return res;
};

export const DeleteAxiosInstance = async <T = any>(
  url: string, 
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const res = await axiosInstance.delete<T>(url, config);
  return res;
};

export const PutAxiosInstance = async <T = any>(
  url: string, 
  data?: any, 
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const res = await axiosInstance.put<T>(url, data, config);
  return res;
};