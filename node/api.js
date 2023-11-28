player = "red";
turns = 0;
active = false;
winner = 0;

columns = Array(7).fill(6); // evil tracking hack
gameboard = Array(6).fill().map(() => Array(7).fill(0)); // what the fuck?

async function getGameboard() {
    return JSON.stringify(gameboard);
}

async function state() {
    return JSON.stringify({
        "Turn Number": turns,
        "Ongoing Game": active,
        "Winner": winner
    });
}

async function startgame() {
    active = true;
    turns = 1;
    gameboard = Array(6).fill().map(() => Array(7).fill(0));
    return JSON.stringify(gameboard);
}

async function droptoken(column) {
    if (!column) {
        console.error("didn't provide a column");
        return JSON.stringify({
            "error": "column not provided"
        });
    }
    if (!active) {
        return JSON.stringify({
            "error": "Game has not been started yet"
        });
    }
    if (winner != 0) {
        return JSON.stringify({
            "error": "Game has already ended"
        });
    }
    if (columns[column] == 0) {
        return JSON.stringify({
            "error": "Column is full"
        });
    }
    columns[column] -= 1;
    turns += 1;
    gameboard[columns[column]][column] = turns%2 + 1;
    return JSON.stringify(gameboard);
}


const url = require('url');
const http = require('http');
const server = http.createServer();
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
server.on('request', async (request, response) => {
    parse = url.parse(request.url, true);

    switch (parse.pathname) {
        case "/gameboard":
            response.setHeader("Content-Type", "application/json");
            response.end(await getGameboard());
            break;
        case "/state":
            response.setHeader("Content-Type", "application/json");
            response.end(await state());
            break;
        case "/startgame":
            response.setHeader("Content-Type", "application/json");
            response.end(await startgame());
            break;
        case "/droptoken":
            response.setHeader("Content-Type", "application/json");
            response.end(await droptoken(parse.query.column));
            break;
        case "/winner":
            active = false;
            winner = (turns+1)%2;
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end(await state());
            break;
        default:
            console.log("Received " + parse);
            response.statusCode = 404;
            response.setHeader("Content-Type", "text/html");
            response.end("404 Not Found");
            break;
    }
});