var config = {
  //baseUrl: "https://moztrap.mozilla.org",
  //baseUrl: "http://localhost:8000",
  //baseUrl: "http://localhost:8080", //wiremock
  //baseUrl: "https://moztrap.allizom.org",
  baseUrl: "http://10.247.24.126:8181",
  defaultProduct: "Firefox OS",
  //defaultProduct: "MozTrap",
  defaultListLimit: 20,
  //username: "admin-django",
  //api_key: "c67c9af7-7e07-4820-b686-5f92ae94f6c9",
  username: "atsai",
  // api_key: "dec0aa2d-64ea-4b73-a9b0-43b64f0e621d",
  api_key: "190a3be2-7df8-45ad-b648-c8a32fbbdc8b"
}

function refreshConfig() {
  localforage.getItem('username').then(function(val){
    config['username'] = val;
  });
  localforage.getItem('api_key').then(function(val){
    config['api_key'] = val;
  });
}

refreshConfig();
