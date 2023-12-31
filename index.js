const cluster = require("cluster");
const port = process.env.PORT || 4000;
const os = require("os")
const totalcpus = os.cpus().length;

if (cluster.isPrimary) {
    for (let i = 0; i < totalcpus; i++) {
        cluster.fork()
    }
} else {
    const express = require("express");
    const server = express();
    const morgan = require("morgan")
    const fs = require("fs")
    const moment = require('moment-timezone');
    const path = require('path');

    const compression = require("compression")
    const https = require("https")
    server.use(compression())





    // Create a write stream (in append mode)
    const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

    // Custom Token Definition
    morgan.token('date', (req, res) => {
        return moment().tz('Asia/Kolkata').format();
    });
    morgan.token("ip", (req, res) => {

        return req.ip
    })
    // Custom Log Format Definition
    morgan.format('myformat', '[:date [Asia/Kolkata]] ":method :url" :status :res[content-length] :response-time ms  :ip ipAdress ');

    // Apply the Custom Log Format
    server.use(morgan('myformat', { stream: accessLogStream }));

    server.get("/", (req, res) => {
        res.json({ ok: "ok" })

    })
    const sslserver = https.createServer({
        key: process.env.KEY,
        cert: process.env.CERT,
    }, server)
    sslserver.listen(port, () => {
        console.log("server listen on port", port);
    })
}