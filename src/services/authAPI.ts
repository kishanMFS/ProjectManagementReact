// const loginAPI: string = process.env.VITE_loginAPI || "";
const loginAPI: string = import.meta.env.VITE_API + "/auth/login";
const logoutAPI: string = import.meta.env.VITE_API + "/auth/logout";
const verifyAPI: string = import.meta.env.VITE_API + "/auth/verify";

type loginUserServiceType = {
  access_token?: string;
  statusCode?: number;
  message?: string;
};
interface callApiType {
  apiURL: string;
  param?: object;
  onProgress: (value: number) => void;
  resolve: (value: loginUserServiceType) => void;
  reject: (value: unknown) => void;
}
interface loginUserType {
  callApi: (args: callApiType) => void;
  credentials: { email: string; password: string };
  onProgress: (value: number) => void;
}
interface logoutUserType {
  callApi: (args: callApiType) => void;
  onProgress: (value: number) => void;
}
interface verifyUserType {
  callApi: (args: callApiType) => void;
  onProgress: (value: number) => void;
}


export function loginUserService({
  callApi,
  credentials,
  onProgress,
}: loginUserType): Promise<loginUserServiceType> {
  return new Promise<loginUserServiceType>((resolve, reject) => {
    callApi({
      apiURL: loginAPI,
      param: credentials,
      onProgress,
      resolve,
      reject,
    });
  });
}

type logoutUserServiceType = {

}

export function logoutUserService({
  callApi,
  onProgress
}: logoutUserType): Promise<logoutUserServiceType> {
  return new Promise<logoutUserServiceType>((resolve, reject) => {
    callApi({
      apiURL: logoutAPI,
      onProgress,
      resolve,
      reject,
    });
  });
}

type verifyUserServiceType = {
  isValid : boolean,
  message : string
}

export function verifyUserService({
  callApi,
  onProgress
}: verifyUserType): Promise<verifyUserServiceType> {
  return new Promise<verifyUserServiceType>((resolve, reject) => {
    callApi({
      apiURL: verifyAPI,
      onProgress,
      resolve,
      reject,
    });
  });
}

