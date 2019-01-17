let headers = new Headers({
  "Accept": "application/json;charset=utf-8",
  "Content-Type": "application/json;charset=utf-8",
  "Access-Control-Allow-Origin": "*",
});

function get(url) {
  return fetch(url, {
    method: "GET",
    headers: headers,
  }).then(response => {
    return handleResponse(url, response);
  }).catch(err => {
    console.error(`Request GET failed. Url = ${url} . Message = ${err}`);
    return {error: {message: "Request GET failed."}};
  })
}

function getfile(url) {
    return fetch(url, {
        method: "GET",
        headers: headers,
    }).then(response => {
        return handleGetFileResponse(url, response);
    }).catch(err => {
        console.error(`Request GET failed. Url = ${url} . Message = ${err}`);
        return {error: {message: "Request GET failed."}};
    })
}

function post(url, data) {
  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data)
  }).then(response => {
    return handleResponse(url, response);
  }).catch(err => {
    console.error(`Request POST failed. Url = ${url} . Message = ${err}`);
    return {error: {message: "Request POST failed."}};
  })
}

function put(url, data) {
  return fetch(url, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data)
  }).then(response => {
    return handleResponse(url, response);
  }).catch(err => {
    console.error(`Request PUT failed. Url = ${url} . Message = ${err}`);
    return {error: {message: "Request PUT failed."}};
  })
}

function del_remove(url) {
  return fetch(url, {
    method: "DELETE",
    headers: headers,
  }).then(response => {
    return handleResponse(url, response);
  }).catch(err => {
    console.error(`Request DELETE failed. Url = ${url} . Message = ${err}`);
    return {error: {message: "Request DELETE failed."}};
  })
}

function handleResponse(url, response) {
  if(response.status < 500){
    return response.json();
  }else{
    console.error(`Request failed. Url = ${url} . Message = ${response.statusText}`);
    return {error: {message: "Request failed due to server error "}};
  }
}
function handleGetFileResponse(url, response) {
    if(response.status < 500){
        return response.blob();
    }else{
        console.error(`Request failed. Url = ${url} . Message = ${response.statusText}`);
        return {error: {message: "Request failed due to server error "}};
    }
}


export default {get, post, put, del_remove, getfile}
