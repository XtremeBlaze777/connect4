const express = require('express');
const cors = require('cors');
const app = express();

let player = "red";
let turns = 0;
let active = false;
let winner = 0;

let columns = Array(7).fill(6); // evil tracking hack
let gameboard = Array(6).fill().map(() => Array(7).fill(0)); // what the fuck?

app.use(cors());

app.get('/gameboard', async (req, res) => {
  res.json(await getGameboard());
});

app.get('/state', async (req, res) => {
  res.json(await state());
});

app.get('/startgame', async (req, res) => {
  res.json(await startgame());
});

app.get('/droptoken', async (req, res) => {
  const column = parseInt(req.query.column);
  res.json(await droptoken(column));
});

app.get('/winner', async (req, res) => {
  active = false;
  winner = (turns + 1) % 2;
  res.status(200).json(await state());
});

const getGameboard = async () => {
  return JSON.stringify(gameboard);
};

const state = async () => {
  return JSON.stringify({
    "Turn Number": turns,
    "Ongoing Game": active,
    "Winner": winner
  });
};

const startgame = async () => {
  active = true;
  turns = 1;
  gameboard = Array(6).fill().map(() => Array(7).fill(0));
  return JSON.stringify(gameboard);
};

const droptoken = async (column) => {
  if (!column) {
    console.error("Didn't provide a column");
    return JSON.stringify({
      "error": "Column not provided"
    });
  }
  if (!active) {
    return JSON.stringify({
      "error": "Game has not been started yet"
    });
  }
  if (winner !== 0) {
    return JSON.stringify({
      "error": "Game has already ended"
    });
  }
  if (columns[column] === 0) {
    return JSON.stringify({
      "error": "Column is full"
    });
  }
  columns[column] -= 1;
  turns += 1;
  gameboard[columns[column]][column] = turns % 2 + 1;
  return JSON.stringify(gameboard);
};

const port = 3000;
app.listen(port, () => {
    console.log(`Connect4 server running at port ${port}`);
})