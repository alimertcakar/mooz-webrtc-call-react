const fs = require('fs')
const { WebSocketServer } = require('ws')
const child_process = require('child_process')

const https = require('https')

const server = https.createServer({
    cert: fs.readFileSync('localcert.cert'),
    key: fs.readFileSync('localkey.key'),
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
    console.log('On connection')
    ws.send('Server hello')

    const rtmpUrl = 'rtmp://global-live.mux.com:5222/app/2b11f85c-f649-3819-6a47-0567451a4455'
    const videoCodec = [
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-tune',
        'zerolatency',
        '-vf',
        'scale=w=-2:0',
    ]
    const audioCodec = ['-c:a', 'aac', '-ar', '44100', '-b:a', '64k']

    const ffmpeg = child_process.spawn('ffmpeg', [
        '-i',
        '-',
        //force to overwrite
        '-y',
        // used for audio sync
        '-use_wallclock_as_timestamps',
        '1',
        '-async',
        '1',
        ...videoCodec,
        ...audioCodec,
        //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
        //'-strict', 'experimental',
        '-bufsize',
        '1000',
        '-f',
        // "fifo", " -fifo_format " ,"flv", "-map", "0:v", "-map", "0:a", "-attempt_recovery", "1", "-max_recovery_attempts", "20", "-recover_any_error", "1", "-tag:v", "7", "-tag:a", "10", "-recovery_wait_time", "5" ,
        'flv',
        // "-timeout", "0",
        // "-reconnect", "1", "-reconnect_at_eof", "1", "-reconnect_streamed", "1", "-reconnect_delay_max", "9999",
        rtmpUrl,
    ])

    ffmpeg.on('close', (code, signal) => {
        console.log('FFmpeg child process DIED!, code ' + code + ', signal ' + signal)
        // ws.terminate()
    })

    // Handle STDIN pipe errors by logging to the console.
    // These errors most commonly occur when FFmpeg closes and there is still
    // data to write.f If left unhandled, the server will crash.
    ffmpeg.stdin.on('error', e => {
        console.log('FFmpeg STDIN Error', e)
    })

    // FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
    ffmpeg.stderr.on('data', data => {
        console.log('FFmpeg STDERR:', data.toString())
    })

    ws.on('message', msg => {
        if (Buffer.isBuffer(msg)) {
            console.log('(StreamData)')
            ffmpeg.stdin.write(msg)
        } else {
            console.log('other msg received', msg)
        }
    })

    ws.on('close', e => {
        // console.log('Socket closed')
        // ffmpeg.kill('SIGINT')
    })
})

server.listen(6000)
