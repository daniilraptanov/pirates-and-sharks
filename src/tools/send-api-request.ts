import { LocalStorageKeys } from "../enums/local-storage-keys";
import { LocalStorageServiceImpl } from "../services/LocalStorageServiceImpl";

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
    // TODO :: replace api url to config
    const response = await fetch("http://localhost:5000/api" + url, {
      method: method,
      body: body,
      headers: headers,
    });
    // TODO
    if (response.status !== 200) {
        throw new Error(response.status.toString());
    }
    return (await response.json())["data"];
  } catch (err) {
    console.log(`Response error...`, err);
    return null;
  }
}
