const cluster = require("cluster");
const port = process.env.PORT || 4000;
const os = require("os")
const totalcpus = os.cpus().length;
console.log(totalcpus);
if (cluster.isPrimary) {
    for (let i = 0; i < totalcpus; i++) {
        cluster.fork()
    }
} else {
    const express = require("express");
    const server = express();
    server.get("/", (req, res) => {
        return res.json({ message: "ok" })
    })
    server.listen(port, () => {
        console.log("server listen on port", port);
    })
}