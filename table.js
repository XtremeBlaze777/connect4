player = "red";
board = document.getElementById("board");
msg = document.getElementById("message");
msg.setAttribute("id", "message");
const url = 'http://localhost:3000';

function load() {
    fetch(url + '/state')
    .then(response => response.json())
    .then(gridData => {
        data = JSON.parse(gridData);
        console.log(data);
        if (data["Ongoing Game"]) {
            renderGrid(data.Gameboard);
        }
        else {
            reset();
        }
    })
    .catch(error => console.error('Error fetching grid status:', error));
}

function reset() {
    fetch(url + '/startgame')
    .then(response => response.json())
    .then(gridData => {
        data = JSON.parse(gridData);
        console.log(data);
        renderGrid(data.Gameboard);
    })
    .catch(error => console.error('Error fetching grid data:', error));

    for (var i = 0; i < 7; i++) {
        var button = document.getElementById("button-" + i);
        button.disabled = true;
    }
}

function dropToken(col) {
    fetch(url + '/droptoken?column=' + col)
    .then(response => response.json())
    .then(gridData => {
        data = JSON.parse(gridData);
        console.log(data);
        renderGrid(data.Gameboard);
    })
    .catch(error => console.error('Error fetching grid data:', error));

    // check if we have a winner
    let winner = checkWin(data.Gameboard);
    if (winner != "none") {
        console.log(winner + " player won!");
        msg.innerHTML = winner + " player won!";

        fetch(url + '/winner');
        // make the buttons unclickable
        for (var i = 0; i < 7; i++) {
            var button = document.getElementById("button-" + i);
            button.disabled = true;
        }
    }
    else {
        player = player == "red" ? "yellow" : "red";
        console.log("It's " + player + " player's turn");
        // msg.innerHTML = "It's " + player + " player's turn";
    }
}

function renderGrid(grid) {
    rows = 6;
    cols = 7;
    player = "red";
    var table = document.createElement("table");
    table.setAttribute("id", "table");
    table.style.borderCollapse = "collapse";
    // make the table blue
    table.style.backgroundColor = "blue";

    var tbody = document.createElement("tbody");
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var td = document.createElement("td");
            td.setAttribute("id", i + "-" + j);
            td.setAttribute("class", "empty");

            var circle = makeCircle();
            circle.setAttribute("id", i + "-" + j + "-circle");

            // Set the color of the circle based on the grid value
            if (grid[i][j] === 1) {
                circle.style.backgroundColor = "red";
            } else if (grid[i][j] === 2) {
                circle.style.backgroundColor = "yellow";
            }

            td.appendChild(circle);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    board.innerHTML = "";
    board.append(table);
    board.appendChild(msg);
}

function isCellColored(row, col) {
    var cell = document.getElementById(row + "-" + col + "-circle");
    return cell && (cell.style.backgroundColor === "red" || cell.style.backgroundColor === "yellow");
}

function makeCircle() {
    var circle = document.createElement("span");
    circle.appendChild(document.createTextNode("\u25ef")); // circle
    circle.style.backgroundColor = "black";
    circle.style.display = "inline-block"; // Ensure inline-block for setting width and height
    circle.style.borderRadius = "50%"; // Set border-radius to create a circle

    return circle;
}

function checkWin(gameboard) {
    // Check for horizontal wins
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 4; j++) {
            if (gameboard[i][j] != 0 && gameboard[i][j] == gameboard[i][j + 1] && gameboard[i][j] == gameboard[i][j + 2] && gameboard[i][j] == gameboard[i][j + 3]) {
                return gameboard[i][j] == 1 ? "red" : "yellow";
            }
        }
    }

    // Check for vertical wins
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 7; j++) {
            if (gameboard[i][j] != 0 && gameboard[i][j] == gameboard[i + 1][j] && gameboard[i][j] == gameboard[i + 2][j] && gameboard[i][j] == gameboard[i + 3][j]) {
                return gameboard[i][j] == 1 ? "red" : "yellow";
            }
        }
    }

    // Check for diagonal wins
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if (gameboard[i][j] != 0 && gameboard[i][j] == gameboard[i + 1][j + 1] && gameboard[i][j] == gameboard[i + 2][j + 2] && gameboard[i][j] == gameboard[i + 3][j + 3]) {
                return gameboard[i][j] == 1 ? "red" : "yellow";
            }
        }
    }

    // Check for diagonal wins
    for (var i = 0; i < 3; i++) {
        for (var j = 3; j < 7; j++) {
            if (gameboard[i][j] != 0 && gameboard[i][j] == gameboard[i + 1][j - 1] && gameboard[i][j] == gameboard[i + 2][j - 2] && gameboard[i][j] == gameboard[i + 3][j - 3]) {
                return gameboard[i][j] == 1 ? "red" : "yellow";
            }
        }
    }

    return "none";
}

function addListenerDepracated(circle) {
    circle.addEventListener("click", function() {
        var indices = this.parentElement.id.split("-");
        var row = parseInt(indices[0]);
        var col = parseInt(indices[1]);

        // Check if the cell below has been colored (red or yellow)
        bottomRow = row == rows - 1;
        if (bottomRow || isCellColored(row + 1, col)) {
            // Change the color to red on click
            this.style.backgroundColor = player;
            player = player == "red" ? "yellow" : "red";
            // Remove the click event listener
            this.removeEventListener("click", arguments.callee);
            
            // Check if the player won
            var winner = checkWin();
            if (winner != "none") {
                console.log(winner + " player won!");
                msg.innerHTML = winner + " player won!";
                makeTable(6, 7);
                return;
            }
            else {
                console.log("It's " + player + " player's turn (accessed " + row + ", " + col + ")");
                msg.innerHTML = "It's " + player + " player's turn";
            }
        } else {
            console.log("Brother, gravity?? (accessed " + row + ", " + col + ")");
            msg.innerHTML = "Brother, gravity??";
        }
    });
}