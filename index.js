import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5000, path: "/ws" });

wss.on('connection', function connection(ws, req) {
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
