import useAuth from "./useAuth";

const useApi = () => {
  const { logout } = useAuth();

  const authFetch = async (api_url: string) => {
    const response = await fetch(api_url, {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    response.status === 401 && logout();
    return response.status >= 400 ? Promise.reject("error") : response;
  };

  const authPost = async (api_url: string, data: FormData) => {
    const response = await fetch(api_url, {
      method: "POST",
      mode: "cors",
      body: data,
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    response.status === 401 && logout();
    return response.status >= 400 ? Promise.reject("error") : response;
  };

  const authPatch = async (api_url: string, data: FormData | string) => {
    if (typeof data === "string") {
      //If data is in JSON
      const response = await fetch(api_url, {
        method: "PATCH",
        mode: "cors",
        body: data,
        headers: {
          "Content-type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      response.status === 401 && logout();
      return response.status >= 400 ? Promise.reject("error") : response;
    } else {
      const response = await fetch(api_url, {
        method: "PATCH",
        mode: "cors",
        body: data,
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      response.status === 401 && logout();
      return response.status >= 400 ? Promise.reject("error") : response;
    }
  };

  const authDelete = async (api_url: string) => {
    const response = await fetch(api_url, {
      method: "DELETE",
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    response.status === 401 && logout();
    return response.status >= 400 ? Promise.reject("error") : response;
  };

  return { authFetch, authPost, authPatch, authDelete };
};

export default useApi;
