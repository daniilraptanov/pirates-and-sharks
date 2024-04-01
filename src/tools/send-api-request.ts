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
    return await response.json();
  } catch (err) {
    return {data: null, message: "Response error...", code: parseInt(err as string) }
  }
}
