const cors = require('cors');
const express = require('express');
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');

const app = express();

const port = 4500;

app.use(cors());
app.use(busboy());
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: false
}));

const calls = require('./routes/db/calls');
const deploy = require('./routes/deploy/deploy');
const execute = require('./routes/execute/execute');
const compile = require('./routes/compile/compile');
const simulation = require('./routes/db/simulation');

app.use('/calls', calls);
app.use('/deploy', deploy);
app.use('/execute', execute);
app.use('/compile', compile);
app.use('/simulation', simulation);

app.listen(port, () => console.log(`Server started on port ${port}`));