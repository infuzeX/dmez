const origins = {
     api:["http://127.0.0.1:3000", "https://dmezapi.herokuapp.com"],
     img:["http://127.0.0.1:4000", "https://dmez.herokuapp.com"],
     getApi:function(data) {
        const prod = window.location.protocol.startsWith('https');
        return data[Number(prod)];
     }
}