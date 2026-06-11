type responseType = {
  access_token?: string;
  statusCode?: number;
  message?: string;
};
interface useXHRType {
  apiURL: string;
  param?: object;
  onProgress: (value: number) => void;
  resolve: (value: responseType) => void;
  reject: (value: unknown) => void;
}

function useXHR() {
  const callApi = ({
    apiURL,
    param,
    onProgress,
    resolve,
    reject,
  }: useXHRType) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", apiURL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.withCredentials = true; 
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        onProgress(Math.round(percent));
      }
    };

    xhr.onload = () => {
      resolve(JSON.parse(xhr.response));
    };

    xhr.onerror = reject;
    xhr.send(JSON.stringify(param));
  };

  return {
    callApi,
  };
}

export default useXHR;
