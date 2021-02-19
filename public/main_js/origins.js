const origins = {
   dev: ["http://127.0.0.1:3000", "http://127.0.0.1:4000"],
   prod: ["https://dmez.herokuapp.com", "https://dmezapi.herokuapp.com"],
   getApi: function (env, api) {
      return this[env][Number(api)];
   }
}