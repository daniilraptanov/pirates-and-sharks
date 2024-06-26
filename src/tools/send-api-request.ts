import { StatusCodes } from "http-status-codes";
import { LocalStorageKeys } from "../enums/local-storage-keys";
import { LocalStorageServiceImpl } from "../services/LocalStorageServiceImpl";
import userServiceFactory from "../services/UserServiceImpl";

// TODO :: replace api url to config
export const SERVER_URL = "http://localhost:5000";
export const API_ROUTE = "/api";

export async function sendApiRequest(
  url: string,
  method: "get" | "post" | "patch" | "delete" = "get",
  body: any = null,
  headers: any = {}
): Promise<any> {
  if (body) {
    body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }
  
  headers["Authorization"] = `Bearer ${LocalStorageServiceImpl.pullFromStorage(LocalStorageKeys.AUTH_TOKEN)}`;

  try {
    const response = await fetch(SERVER_URL + API_ROUTE + url, {
      method: method,
      body: body,
      headers: headers,
    });
    
    if (response.status === StatusCodes.UNAUTHORIZED) {
        return userServiceFactory().logout();
    }

    if (response.status !== StatusCodes.OK) {
        throw new Error(response.status.toString());
    }
    return (await response.json())["data"];
  } catch (err) {
    console.log(`Response error...`, err);
    return null;
  }
}
