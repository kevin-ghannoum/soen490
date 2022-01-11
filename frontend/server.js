const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()

app.use('/', serveStatic(path.join(__dirname, '/build')))

app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + "/build/index.html")
})

const port = process.env.PORT || 3000

app.listen(port, () => { console.log("Server started") })