const app = require('./app');

const PORT = process.env.POST || 3001;

app.listen(PORT, () => console.log("up and running"));