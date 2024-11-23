import axios from "@/utils/authorizedAxiosInstance";
import type { APIError } from "@/interfaces/error.interface";
import { User } from "@/interfaces/user.interface";

const URL_BASE = import.meta.env.VITE_APP_API_URL
  ? import.meta.env.VITE_APP_API_URL.concat("users")
  : "";

export async function signUp(
  username: string,
  email: string,
  password: string
): Promise<{ data?: { token: string }; error?: APIError }> {
  try {
    const axiosInstance = await axios();
    const { data } = await axiosInstance.post(URL_BASE.concat("/sign-up"), {
      username,
      email,
      password,
    });
    return { data };
  } catch (error: any) {
    return {
      error: error?.response?.data,
    };
  }
}

export async function findAll(): Promise<{ data?: User[]; error?: APIError }> {
  try {
    const axiosInstance = await axios();
    const { data } = await axiosInstance.get(URL_BASE);
    return { data };
  } catch (error: any) {
    return {
      error: error?.response?.data,
    };
  }
}
