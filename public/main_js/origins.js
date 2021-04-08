const ENV = 1;
const origins = {
  shop: [
    "http://127.0.0.1:3000",
    "https://dmezapi.herokuapp.com",
    "https://api.dmez.in",
  ],
  img: [
    "http://127.0.0.1:4000",
    "https://dmez.herokuapp.com",
    "https://admin.dmez.in",
  ],
  auth: [
    [
      "http://127.0.0.1:8000",
      "https://dmezauth.herokuapp.com",
      "https://auth.dmez.in",
    ], //login
    [
      "http://127.0.0.1:3000",
      "https://dmezapi.herokuapp.com",
      "https://api.dmez.in",
    ], //register
  ],
  getAuthOrigin: function (index) {
    return this.auth[index][ENV];
  },
};

const origin = "http://127.0.0.1:3001";//origins["shop"][ENV];