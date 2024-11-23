import axios from "@/utils/authorizedAxiosInstance";
import type { APIError } from "@/interfaces/error.interface";
import { Chat } from "@/interfaces/chat.interface";

const URL_BASE = import.meta.env.VITE_APP_API_URL
  ? import.meta.env.VITE_APP_API_URL.concat("chat")
  : "";

export async function sendChat(
  content: string,
  sender_id: number,
  receiver_id: number
): Promise<{ data?: Chat; error?: APIError }> {
  try {
    const axiosInstance = await axios();
    const { data } = await axiosInstance.post(URL_BASE, { content, sender_id, receiver_id });
    return { data };
  } catch (error: any) {
    return {
      error: error?.response?.data,
    };
  }
}

export async function getConversations(userId: number): Promise<{ data?: Chat[]; error?: APIError }> {
  try {
    const axiosInstance = await axios();
    const { data } = await axiosInstance.get(`${URL_BASE}/conversations/${userId}`);
    return { data };
  } catch (error: any) {
    return {
      error: error?.response?.data,
    };
  }
}

export async function getMessages(
  senderId: number,
  receiverId: number
): Promise<{ data?: Chat[]; error?: APIError }> {
  try {
    const axiosInstance = await axios();
    const { data } = await axiosInstance.get(`${URL_BASE}/messages/${senderId}/${receiverId}`);
    return { data };
  } catch (error: any) {
    return {
      error: error?.response?.data,
    };
  }
}
