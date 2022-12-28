const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const { WebSocketServer } = require("ws");

const whitelist = ['https://support.itbsutah.com']

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

const app = express();

app.use(express.json());
app.use(cors(corsOptionsDelegate));


const server = app.listen(3000, () => {
    console.log('ITBS Utah Database server is running');
});

const wss = new WebSocketServer({ port: 9000 });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log(JSON.parse(data));
    });

    ws.send('something');
});