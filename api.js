/* eslint-disable no-console */
const express = require('express')
const app = express()
const cors = require('cors')
const connect = require('connect-history-api-fallback')
const session = require('express-session')
const bodyParser = require('body-parser')
const db = require('./database.js')

app.use(cors())
app.use(connect())
app.use(session({secret:'sshh'}))
app.use(bodyParser.json())

app.post('/',(req,res)=>{
    var data = req.body
    sockets.emit(data.tipo,data)
    res.send({type:'success',title:'Mensaje enviado correctamente'})
})
const server = app.listen('3355',()=>{
    console.log("server iniciado en http://localhost:3355")
})
app.post('/get',(req,res)=>{
    var data=req.body
    db.get(data.table,data.fields,data.whereFilter).then(r=>{
        res.send(r)
    })
})

const sockets = require('socket.io')(server)
sockets.on('connection',socket=>{
    console.log('se conectó el cliente con id: ' + socket.id)
    socket.emit('confirm','te conectaste')
})
