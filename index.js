import { WebSocketServer } from 'ws';
import * as http from 'http';
import * as fs from 'fs';

http.createServer(function (request, response) {
    console.log(request.url)
    switch (request.url) {
        case "/http-example":
            fs.readFile("./client/chat.html", function (error, content) {
                response.writeHead(200, { 'Content-Type': "text/html" });
                response.end(content, 'utf-8');
            });        
            break;

        case "/http-example/chat.js":
            fs.readFile("./client/chat.js", function (error, content) {
                response.writeHead(200, { 'Content-Type': "text/javascript" });
                response.end(content, 'utf-8');
            });        
            break;

        case "/http-example/style.css":
            fs.readFile("./client/style.css", function (error, content) {
                response.writeHead(200, { 'Content-Type': "text/css" });
                response.end(content, 'utf-8');
            });        
            break;
    
        default:
            response.statusCode = 404
            response.end("404")
            break;
    }
}).listen(5001)

const wss = new WebSocketServer({ port: 5000, path: "/ws" });

wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;
    console.log(ip)

    ws.on('error', console.error);
    users.push({
        ws
    })
    ws.on('message', function message(data) {
        const input = JSON.parse(data)
        switch (input.type) {
            case "get":
                get(input, ws)
                break;

            case "set":
                set(input, ws)
                break;

            default:
                break;
        }
    });
});

const users = [

]

const messages = [

]

function get(input, ws) {
    switch (input.do) {
        case "get all messages":
            // input.output = messages
            ws.send(JSON.stringify(
                {
                    callBack_type: input.type,
                    callBack_do: input.do,
                    [input.type + " / " + input.do]: messages
                }
            ))
            break;

        default:
            break;
    }
}

function set(input, ws) {
    switch (input.do) {
        case "send message":
            messages.push({
                text: input.text,
                user: input.user
            })
            users.forEach((user) => {
                user.ws.send(JSON.stringify(
                    {
                        callBack_type: input.type,
                        callBack_do: input.do,
                        [input.type + " / " + input.do]: {
                            text: input.text,
                            user: input.user
                        }
                    }
                ))
            })
            break;

        default:
            break;
    }
}
