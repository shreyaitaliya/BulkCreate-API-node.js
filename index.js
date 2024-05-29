const express = require('express');
const bodyparser = require('body-parser');
const db = require('./config/db');

const app = express();
const port = 8000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/', require('./routes/indexroutes'));

app.listen(port, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started on port: ${port}`);
    }
});
