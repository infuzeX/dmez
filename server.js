require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGOURI || "mongodb://127.0.0.1:27017/dmez", {
  useNewUrlParser: true,
  useUnifiedTopology:true
})
  .then(() => console.log("connected"))
  .catch(err => console.log(err.message))

app.listen(PORT, () => console.log("up and running"));
