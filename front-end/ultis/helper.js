export async function postRequest({
  url,
  body,
  handleError,
  handleSuccess,
  token,
  opt,
}) {
  return await fetch(url, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    ...opt,
  })
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json();
    })
    .then((data) => {
      handleSuccess(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      try {
      error?.json().then((jsonError) => {
        handleError(jsonError?.errors);
      });
      }catch(e) {}
    });
}

export async function getRequest({
  url,
  token,
  handleError,
  handleSuccess,
  opt,
}) {
  return await fetch(url, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...opt,
  })
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json();
    })
    .then((data) => {
      handleSuccess(data);
      return data;
    })
    .catch((error) => {
      try {
        error.json().then((jsonError) => {
          handleError(jsonError?.errors);
        });
      } catch (e) {}
    });
}
