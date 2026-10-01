const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
    let version = `HTTP/${req.httpVersion}`;
    let time = new Date().toISOString();
    let agent = req.get("user-agent");
    agent = agent.replace(/,/g, "");
    let status = 200;
    let log = `${agent},${time},${req.method},${req.url},${version},${status}`;
    console.log(log);
    fs.appendFile("log.csv", log + "\n", function(error) {
        if (error) {
            console.log(error);
        }
    });
    next();
});

app.get('/', (req, res) => {
    res.send("ok");
});
app.get('/logs', (req, res) => {
    fs.readFile("log.csv", "utf8", function(error, data) {
        let rows = data.split("\n");
        let logs = [];
        for (let i = 1; i < rows.length - 1; i++) {
             let values = rows[i].split(",");
             let logObject = {
                 Agent: values[0],
                 Time: values[1],
                 Method: values[2],
                 Resource: values[3],
                 Version: values[4],
                 Status: values[5]
             };

             logs.push(logObject);
        }
        res.json(logs);    
    });
});
module.exports = app;
