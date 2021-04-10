require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGOURI || "mongodb://127.0.0.1:27017/dmez", {
  useNewUrlParser: true,
  useUnifiedTopology:true,
  useCreateIndex:true
})
  .then(() => console.log("connected"))
  .catch(err => console.log(err.message))

process.on('unhandledRejection', (error)=> {
  console.log(error.message);
  console.log(error.stack);
})

app.listen(PORT, () => console.log("up and running"));