const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.promise = global.promise;
mongoose.connect('mongodb://localhost:27017/WaterBottle', { useNewUrlParser: true });

app.use(bodyParser.json());

require("./routes/user")(app);
require("./routes/order")(app);


let port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
