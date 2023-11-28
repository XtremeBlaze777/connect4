// make a 7x6 table
player = "red";
board = document.getElementById("board");
msg = document.getElementById("message");
msg.setAttribute("id", "message");


function renderTable(grid) {
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

            td.appendChild(circle);
            // td.style.border = "1px solid black";

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

function checkWin() {
    // Check for horizontal wins
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 4; j++) {
            var cell = document.getElementById(i + "-" + j + "-circle");
            if (cell.style.backgroundColor === "red" && document.getElementById(i + "-" + (j + 1) + "-circle").style.backgroundColor === "red" && document.getElementById(i + "-" + (j + 2) + "-circle").style.backgroundColor === "red" && document.getElementById(i + "-" + (j + 3) + "-circle").style.backgroundColor === "red") {
                return "red";
            } else if (cell.style.backgroundColor === "yellow" && document.getElementById(i + "-" + (j + 1) + "-circle").style.backgroundColor === "yellow" && document.getElementById(i + "-" + (j + 2) + "-circle").style.backgroundColor === "yellow" && document.getElementById(i + "-" + (j + 3) + "-circle").style.backgroundColor === "yellow") {
                return "yellow";
            }
        }
    }

    // Check for vertical wins
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 7; j++) {
            var cell = document.getElementById(i + "-" + j + "-circle");
            if (cell.style.backgroundColor === "red" && document.getElementById((i + 1) + "-" + j + "-circle").style.backgroundColor === "red" && document.getElementById((i + 2) + "-" + j + "-circle").style.backgroundColor === "red" && document.getElementById((i + 3) + "-" + j + "-circle").style.backgroundColor === "red") {
                return "red";
            } else if (cell.style.backgroundColor === "yellow" && document.getElementById((i + 1) + "-" + j + "-circle").style.backgroundColor === "yellow" && document.getElementById((i + 2) + "-" + j + "-circle").style.backgroundColor === "yellow" && document.getElementById((i + 3) + "-" + j + "-circle").style.backgroundColor === "yellow") {
                return "yellow";
            }
        }
    }

    // Check for diagonal wins
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            var cell = document.getElementById(i + "-" + j + "-circle");
            if (cell.style.backgroundColor === "red" && document.getElementById((i + 1) + "-" + (j + 1) + "-circle").style.backgroundColor === "red" && document.getElementById((i + 2) + "-" + (j + 2) + "-circle").style.backgroundColor === "red" && document.getElementById((i + 3) + "-" + (j + 3) + "-circle").style.backgroundColor === "red") {
                return "red";
            } else if (cell.style.backgroundColor === "yellow" && document.getElementById((i + 1) + "-" + (j + 1) + "-circle").style.backgroundColor === "yellow" && document.getElementById((i + 2) + "-" + (j + 2) + "-circle").style.backgroundColor === "yellow" && document.getElementById((i + 3) + "-" + (j + 3) + "-circle").style.backgroundColor === "yellow") {
                return "yellow";
            }
        }
    }

    // Check for diagonal wins
    for (var i = 0; i < 3; i++) {
        for (var j = 3; j < 7; j++) {
            var cell = document.getElementById(i + "-" + j + "-circle");
            if (cell.style.backgroundColor === "red" && document.getElementById((i + 1) + "-" + (j - 1) + "-circle").style.backgroundColor === "red" && document.getElementById((i + 2) + "-" + (j - 2) + "-circle").style.backgroundColor === "red" && document.getElementById((i + 3) + "-" + (j - 3) + "-circle").style.backgroundColor === "red") {
                return "red";
            } else if (cell.style.backgroundColor === "yellow" && document.getElementById((i + 1) + "-" + (j - 1) + "-circle").style.backgroundColor === "yellow" && document.getElementById((i + 2) + "-" + (j - 2) + "-circle").style.backgroundColor === "yellow" && document.getElementById((i + 3) + "-" + (j - 3) + "-circle").style.backgroundColor === "yellow") {
                return "yellow";
            }
        }
    }

    return "none";
}