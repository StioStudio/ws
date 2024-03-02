// socket.addEventListener("open", (event) => {
//   socket.send("Hello Server!");
// });


// socket.on('send name', (username) => {
// });

// socket.on('send message', (chat) => {
// });


const socket = new WebSocket("wss://server.stio.studio/ws");


let form = document.getElementById('form');
let myname = document.getElementById('myname');
let message = document.getElementById('message');
let messageArea = document.getElementById('messageArea');


function createJSON() {
    return {

    }
}

// Create WebSocket connection.
// Connection opened
socket.addEventListener("open", (event) => {
    socket.send(JSON.stringify(
        {
            type: "get",
            do: "get all messages"
        }
    ));
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (message.value) {
            socket.send(JSON.stringify(
                {
                    type: "set",
                    do: "send message",
                    text: message.value,
                    user: myname.value
                }
            ));
        }
    });
});


// Listen for messages
socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data)
    const eventPath = data.callBack_type + " / " + data.callBack_do
    const input = data[eventPath]
    
    console.log(data, eventPath, input);
    switch (eventPath) {
        case "set / send message":
            appendMessage(input.user, input.text)            
            break;

        case "get / get all messages":
            input.forEach(message => {
                appendMessage(message.user, message.text)
            });
            break;
    
        default:
            break;
    }
});

function appendMessage(_user, _text) {
    const name = document.createElement('p');
    name.classList.add('message');
    name.innerHTML = `<span class="username">${_user}:</span>`;
    messageArea.appendChild(name);
    
    const chatContent = document.createElement('p');
    chatContent.classList.add('message');
    chatContent.textContent = _text;
    messageArea.appendChild(chatContent);
}