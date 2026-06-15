interface useXHRType<T> {
  apiURL: string;
  param?: object | FormData;
  onProgress?: (value: number) => number;
  resolve: (value: T) => void;
  reject: (value: unknown) => void;
  method?: string;
  contentType?: string;
}

function useXHR() {
  const callApi = ({
    apiURL,
    param,
    onProgress,
    resolve,
    reject,
    method = "POST",
    contentType = "application/json",
  }: useXHRType<object>) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, apiURL);
    xhr.withCredentials = true;

    if (!(param instanceof FormData)) {
      xhr.setRequestHeader("Content-Type", contentType);
    }

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        onProgress(Math.round(percent));
      }
    };

    xhr.onload = () => {
      resolve(JSON.parse(xhr.response));
    };

    xhr.onerror = reject;
    if (param instanceof FormData) {
      xhr.send(param);
    } else {
      xhr.send(JSON.stringify(param));
    }
  };

  return {
    callApi,
  };
}

export default useXHR;
