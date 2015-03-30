var config = {
  //baseUrl: "https://moztrap.mozilla.org",
  baseUrl: "http://localhost:8000",
  //baseUrl: "https://moztrap.allizom.org",
  //defaultProduct: "Firefox OS",
  defaultProduct: "MozTrap",
  defaultListLimit: 20,
  //username: "admin-django",
  //api_key: "c67c9af7-7e07-4820-b686-5f92ae94f6c9",
  username: "",
  api_key: "",
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
