import axios, { type AxiosInstance } from "axios";
import { getToken, deleteToken, createTokenCookie } from "@/utils/tokenUtils";
import router from "@/router";

function transformResponse(response: string) {
  if (response === "Forbidden") {
    deleteToken();
    return response;
  }

  try {
    if (JSON.parse(response).data !== undefined) {
      return JSON.parse(response).data;
    }
    return JSON.parse(response);
  } catch (e) {
    return response;
  }
}

async function checkToken(): Promise<string> {
  let token = getToken();
  if (token === "") {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}auth/refresh`);
      token = response.data.token;
      createTokenCookie(token);
    } catch (e) {
      if (router?.currentRoute?.value?.matched?.[0]?.name !== "not-logged") {
        await router.push({ name: "login" });
      }
    }
  }
  return token;
}

// eslint-disable-next-line func-names
export default async function (): Promise<AxiosInstance> {
  const token = await checkToken();
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    transformResponse: [transformResponse]
  });
}
