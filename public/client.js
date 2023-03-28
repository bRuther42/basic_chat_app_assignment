const app = document.querySelector('.app');

let socket;
let uname;

function enableUI(){
    socket = io();
    let username = app.querySelector('.join-screen #username').value;
    if(username.length == 0){
        return;
    }
    socket.emit('newuser', username);
    uname = username;
    app.querySelector('.join-screen').classList.remove('active');
    app.querySelector('.chat-screen').classList.add('active');

    socket.on('welcome', message => {
        console.log(message);
        const spanTag = document.createElement('span');
        spanTag.innerText = message;
        app.querySelector('.chat-screen .header .logo').appendChild(spanTag);
    });

    socket.on('client-number', number=> {
        app.querySelector('.chat-screen .header .active-users span').innerText = number;
    });
    
    socket.on('server-time', serverTime=> {
        app.querySelector('.chat-screen .typebox #time-display').innerText = serverTime;
    });

    app.querySelector('.chat-screen #send-message').addEventListener('click', ()=>{
        let message = app.querySelector('.chat-screen #message-input').value;
        if(message.length == 0){
            return;
        }
        renderMessage('my', {
            username: uname,
            text: message
        });
        socket.emit('chat', {
            username: uname,
            text: message
        });
        app.querySelector('.chat-screen #message-input').value = "";
    });

    socket.on('update', (update)=>{
        renderMessage('update', update);
    });

    socket.on('chat', (message)=>{
        renderMessage('other', message);
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector('.chat-screen .messages');
        if(type == 'my'){
            let el = document.createElement('div');
            el.setAttribute('class', 'message my-message');
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        }
        else if(type == 'other'){
            let el = document.createElement('div');
            el.setAttribute('class', 'message other-message');
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        }
        else if(type == 'update'){
            let el = document.createElement('div');
            el.setAttribute('class', 'update');
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
}

function disableUI(){
    let username = app.querySelector('.join-screen #username').value;
    uname = username;
    socket.emit('exituser', uname);
    socket.on('client-number', number=> {
        app.querySelector('.chat-screen .header .active-users span').innerText = number;
    })
    socket.on('disconnect');
    window.location.href = window.location.href;
};


app.querySelector('.join-screen #join-user').addEventListener('click', ()=> {
    enableUI();
});

app.querySelector('.chat-screen #exit-chat').addEventListener('click', ()=>{
    disableUI();
});

