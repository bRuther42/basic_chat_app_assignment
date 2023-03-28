const express = require('express'); 
const socketIo = require('socket.io');    
const http = require('http');   
const app = express();  

app.use(express.static(`${__dirname}/public`));


const httpServer = http.createServer(app).listen(3000, () => {console.log('Listening on Port: 3000')}); 

const io = socketIo(httpServer);    

clientNum = 0;
io.on('connection', socket=> {
    console.log('Connection');
    socket.on('newuser', (username)=> {
        console.log(`Client ${username} connected? ${socket.connected}`);
        clientNum++;
        console.log(clientNum);
        socket.broadcast.emit('update', `${username} joined the chat`);
        socket.emit('welcome', 'Welcome to the Chat Server');
        io.emit('client-number', `Number of active Users: ${clientNum}`);
    })

    socket.on('exituser', (username)=> {
        socket.broadcast.emit('update', `${username} left the chat`);
        clientNum--; 
        console.log(clientNum);
        io.emit('client-number', `Number of active Users: ${clientNum}`);
    })

    socket.on('disconnect', reason=> {
        console.log(reason);
    })

    socket.on('chat', (message)=> {
        socket.broadcast.emit('chat', message);
    })

});

setInterval(() => {
    const serverTime = new Date().toTimeString();
    io.emit('server-time', serverTime);
}, 1000);
