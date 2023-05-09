const fs = require('fs')
const { WebSocketServer } = require('ws')

const https = require('https')

const server = https.createServer({
    cert: fs.readFileSync('localcert.cert'),
    key: fs.readFileSync('localkey.key'),
})

const wss = new WebSocketServer({ server })

wss.on('connection', function connection(ws) {
    ws.on('error', console.error)

    ws.on('message', function message(data) {
        console.log('received: %s', data.slice(0, 25))
    })

    ws.send('Server hello')
})

server.listen(6000)
