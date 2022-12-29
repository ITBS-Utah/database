const fs = require('fs/promises')
const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

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

const expressWs = require('express-ws')(app);

app.use(express.json());
app.use(cors(corsOptionsDelegate));

app.ws('/', (ws, req) => {
    let methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

    ws.on('message', async (rawData) => {
        const data = JSON.parse(rawData)

        if (data.method && data.path && data.reqToken) {
            if (methods.includes(data.method)) {
                if (data.method === 'GET') {
                    let file;

                    try {
                        file = await fs.readFile(`./db${data.path}`);
                        const parsedFile = JSON.parse(file);

                        ws.send(JSON.stringify({
                            error: false,
                            reqToken: data.reqToken,
                            data: parsedFile
                        }));
                    } catch (err) {
                        console.log(err)

                        ws.send(JSON.stringify({
                            error: true,
                            errorMsg: err
                        }))
                    }
                }
            } else {
                ws.send(JSON.stringify({
                    error: true,
                    errorMsg: 'Invalid method type'
                }))
            }
        }
    });
});

const server = app.listen(9000, () => {
    console.log('ITBS Utah Database server is running');
});