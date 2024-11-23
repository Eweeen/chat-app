import axios from "@/utils/authorizedAxiosInstance";
import type { APIError } from "@/interfaces/error.interface";

const URL_BASE = import.meta.env.VITE_APP_API_URL
  ? import.meta.env.VITE_APP_API_URL.concat("auth")
  : "";

export async function authentification(
  email: string,
  password: string
): Promise<{ data?: { token: string }; error?: APIError }> {
  try {
    const axiosInstance = await axios();
    const { data } = await axiosInstance.post(URL_BASE, { email, password });
    return { data };
  } catch (error: any) {
    return {
      error: error?.response?.data
    };
  }
}

export async function refreshToken(): Promise<{
  data?: { token: string };
  error?: APIError;
}> {
  try {
    const axiosInstance = await axios();
    const { data } = await axiosInstance.post(URL_BASE.concat("/refresh"), {});
    return { data };
  } catch (error: any) {
    return {
      error: error?.response?.data
    };
  }
}

export async function logout(): Promise<string> {
  const axiosInstance = await axios();
  const response = await axiosInstance.get(URL_BASE.concat("/logout"));
  return response.data.message;
}
