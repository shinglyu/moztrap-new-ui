var config = {
  baseUrl: "https://moztrap.mozilla.org",
  //baseUrl: "http://localhost:8000",
  //baseUrl: "http://localhost:8080", //wiremock
  //baseUrl: "https://moztrap.allizom.org",
  //baseUrl: "http://10.247.24.126:8181",
  defaultProduct: "Firefox OS",
  //defaultProduct: "MozTrap",
  defaultListLimit: 20,
  username:"",
  api_key:"",
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
