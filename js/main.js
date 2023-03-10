/* Cached Elements */
let boardSizeInp = document.getElementById("input");
let mainEl = document.querySelector("main");
let footEl = document.querySelector("footer");
let resetEl = document.getElementById("reset");

/* Global Variables */
let boardSize;
let minesPlaced = 0;

/*Class Declarations*/
class Board {
    static boardArr;

    //Text colors
    static colors = {
        1: "darkblue",
        2: "darkgreen",
        3: "#4d181c",
        4: "#1d055c",
        5: "#1B003D",
        6: "#93F1E3",
        7: "#06321E",
        8: "darkgray"
    }

    constructor(input) {
        this.rows = input;
        this.cols = input;
        this.win = false;
        this.firstClick = true;

        //This ensures there will be 99 mines on a 20x20 and 1 mine on a 3x3
        this.numMines = Math.floor((input * input) * .25) - 1;
    }

    generateBoard = () => {
        //Generating an empty 2D array
        Board.boardArr = [];
        for (let i = 0; i < this.cols; i++) {
            Board.boardArr[i] = [];
        }

        //Dynamically creating a table HTML element
        let table = document.createElement('table');
        for (let i = 0; i < this.rows; i++) {
            let eachRow = document.createElement('tr');
            for (let j = 0; j < this.cols; j++) {
                let eachCell = document.createElement('td');
                eachRow.append(eachCell);
                let square = new Square(eachCell, i, j);
                Board.boardArr[i][j] = square;
            }
            table.appendChild(eachRow);
        }
        mainEl.append(table);
    }

    placeMines = () => {
        /* 
            Places mines throughout the board based on board size
        
            Using a global variable and recursion allows us to place the correct number of mines with no duplicates.
        */
        for (minesPlaced; minesPlaced < this.numMines; minesPlaced++) {
            let r = Math.floor(Math.random() * this.rows);
            let c = Math.floor(Math.random() * this.cols);

            if (Board.boardArr[r][c].mine) {
                this.placeMines();
                break;
            } else {
                Board.boardArr[r][c].mine = true;
            }
        }
    }

    gameOver = () => {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (Board.boardArr[i][j].mine) {
                    Board.boardArr[i][j].renderCell();
                }
                Board.boardArr[i][j].stopListening();
            }
        }
        this.renderGameOverText();
    }

    checkForWin = () => {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (Board.boardArr[i][j].opened ==  false && Board.boardArr[i][j].mine == false) {
                   return
                }
                
            }
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                Board.boardArr[i][j].stopListening();
            }
        }
        this.win = true;
        this.renderGameOverText();
    }

    renderGameOverText = () => {
        footEl.classList.add('endText');
        if (this.win == true) {
            footEl.textContent = "YOU WIN!"
        } else {
            footEl.textContent = "YOU LOSE";
            
        }
    }

    revealMines = () => {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (Board.boardArr[i][j].mine) {
                    Board.boardArr[i][j].renderCell();
                }
            }
        }
    }
}

class Square {
    constructor(domSquare, i, j) {
        this.rowLocation = i;
        this.colLocation = j;
        this.mine = false;
        this.flagged = false;
        this.opened = false;

        //Binding these functions' *this* and assigning them to a variable
        this.boundClicked = this.clicked.bind(this);
        this.boundRightClicked = this.rightClicked.bind(this);

        //Giving the instance its associated DOM element as a property
        this.domEl = domSquare;
        this.domEl.addEventListener('click', this.boundClicked);
        this.domEl.addEventListener('contextmenu', this.boundRightClicked);
    }

    clicked = (evt) => {
        //First click immunity
        if (gameOn.firstClick == true && boardSize.value > 3){
            if (this.mine == true){
                this.mine = false;
            }
            gameOn.firstClick = false;
        }

        if (this.opened) return;
        if (this.flagged) return;
        if (this.mine) {
            //needs a unique class because we are using image assets for the background
            this.domEl.classList.toggle("clickedMine");
            gameOn.gameOver();
        }

        this.opened = true;

        this.renderCell();
        gameOn.checkForWin();
    }

    rightClicked = (evt) => {
        evt.preventDefault();

        if (this.opened) return;

        this.flagged == true ? this.flagged = false : this.flagged = true;

        this.renderFlag();
    }

    //The notorious flood feature
    clickAdjacent = () => {
        let currRow, currCol;
        for (let i = - 1; i < 2; i++) {
            for (let j = - 1; j < 2; j++) {
                currRow = this.rowLocation + i;
                currCol = this.colLocation + j;

                if (currRow >= 0 && currRow < gameOn.rows) {
                    if (currCol >= 0 && currCol < gameOn.cols) {
                        Board.boardArr[currRow][currCol].clicked();
                    }
                }

            }
        }
    }

    checkMines = () => {
        //currRow and currCol added for readability - my original solution was hard on the eyes and lengthy
        let count, currRow, currCol;
        count = 0;
        for (let i = - 1; i < 2; i++) {
            for (let j = - 1; j < 2; j++) {
                currRow = this.rowLocation + i;
                currCol = this.colLocation + j;

                //Making sure we only test squares for mines if they are within the board
                if (currRow >= 0 && currRow < gameOn.rows) {
                    if (currCol >= 0 && currCol < gameOn.cols) {
                        if (Board.boardArr[currRow][currCol].mine) {
                            count++
                        }

                    }
                }

            }
        }

        return count
    }

    renderCell = () => {
        let surrMines = this.checkMines();

        if (this.mine) {
            this.domEl.classList.toggle("mine");
        } else if (surrMines != 0) {
            this.domEl.style.backgroundColor = "#c46069";
            this.domEl.style.color = Board.colors[surrMines];
            this.domEl.innerHTML = `<strong>${surrMines}<strong>`;
            
        } else {
            this.domEl.style.backgroundColor = "#c46069";
            this.domEl.textContent = "";
            this.clickAdjacent()
        }
    }

    renderFlag = () => {
       this.domEl.classList.toggle("flagged");
    }

    //Remove the ability to interact with the board once the game ends
    stopListening = () => {
        this.domEl.removeEventListener('click', this.boundClicked);
        this.domEl.removeEventListener('contextmenu', this.boundRightClicked);
    }
}
/* Event Listeners */
//Submit button functionality
boardSizeInp.addEventListener('submit', (evt) => {

    evt.preventDefault();

    boardSize = document.getElementById("board-size");

    //checking for valid inputs
    if (boardSize.value > 20 || boardSize.value < 3) {

        alert("Invalid board size selected - Try Again");
    } else {
        //hides the input form and begins the game
        boardSizeInp.style.display = "none";
        init();
    }

})

//Reset button functionality
resetEl.addEventListener('click', () => {
    window.location.reload();
})

/* Global Functions */
const init = () => {
    gameOn = new Board(boardSize.value);
    gameOn.generateBoard();
    gameOn.placeMines();
}
