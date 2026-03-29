// const loginAPI: string = process.env.VITE_loginAPI || "";
const loginAPI: string = import.meta.env.VITE_loginAPI || "";

type responseType = {
  access_token: string;
  statusCode: number;
  message: string;
};
interface callApiType {
  apiURL: string;
  param: object;
  onProgress: (value: number) => void;
  resolve: (value: responseType) => void;
  reject: (value: unknown) => void;
}
interface loginUserType {
  callApi: (args: callApiType) => void;
  credentials: { email: string; password: string };
  onProgress: (value: number) => void;
}
function loginUserService({
  callApi,
  credentials,
  onProgress,
}: loginUserType): Promise<responseType> {
  return new Promise<responseType>((resolve, reject) => {
    callApi({
      apiURL: loginAPI,
      param: credentials,
      onProgress,
      resolve,
      reject,
    });
  });
}

export default loginUserService;
