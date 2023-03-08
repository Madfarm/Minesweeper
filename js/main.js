/* Cached Elements */
let boardSizeInp = document.getElementById("input");
let mainEl = document.querySelector("main");
let footEl = document.querySelector("footer");

/* Global Variables */
let boardSize;
let minesPlaced = 0;

/*Class Declarations*/
class Board {
    static boardArr;

    constructor(input){
        this.rows = input;
        this.cols = input;

        //this ensures there will be 99 mines on a 20x20 and 1 mine on a 3x3
        this.numMines = Math.floor((input*input) * .25) - 1;
    }

    generateBoard = () => {
        //generating an empty 2D array
        Board.boardArr = [];
        for (let i =0;i<this.cols;i++){
            Board.boardArr[i] = [];
        }
        
        //Dynamically creating a table HTML element
        let table = document.createElement('table');
        for (let i=0;i<this.rows;i++){
            let eachRow = document.createElement('tr');
            for (let j=0;j<this.cols;j++){
                let eachCell = document.createElement('td');
                eachRow.append(eachCell);
                let square = new Square(eachCell,i,j);
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
        for (minesPlaced; minesPlaced < this.numMines ; minesPlaced++){
            let r = Math.floor(Math.random()*this.rows);
            let c = Math.floor(Math.random()*this.cols);
            
            if(Board.boardArr[r][c].mine){
                this.placeMines();
                break;
            } else {
                Board.boardArr[r][c].mine = true;
            }
        }   
    }

    gameOver = () => {
        for(let i=0;i<this.rows;i++){
            for(let j=0;j<this.cols;j++){
                if(Board.boardArr[i][j].mine){
                    Board.boardArr[i][j].renderCell();
                }
                Board.boardArr[i][j].stopListening();
            }
        }
        this.renderGameOverText();
    }

    renderGameOverText = () =>{
        footEl.textContent = "YOU LOSE";
        footEl.style.fontSize = "40px";
    }
}

class Square {
    constructor(domSquare, i, j){
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
    clicked = (evt) =>{
        //console.log(`click = ${this.rowLocation},${this.colLocation}`);
        if (this.flagged) return;
        if (this.mine){
            this.domEl.style.backgroundColor = "red";
            gameOn.gameOver();
        }

        this.opened = true;

        this.renderCell();
    }
    rightClicked = (evt) =>{
        evt.preventDefault();

        if (this.opened) return;

        this.flagged == true ? this.flagged = false : this.flagged = true;
        
        this.renderCell();
    }
    renderCell = () =>{
        if (this.flagged){
            this.domEl.textContent = "F";
        }else if (this.mine){
            this.domEl.textContent = "M";
        } else if (this.opened) {
            this.domEl.style.backgroundColor = "#c46069";
            this.domEl.textContent = "10";
        } else {
            this.domEl.textContent = "";
        }
    }

    stopListening = () =>{
        this.domEl.removeEventListener('click', this.boundClicked);
    }
}
/* Event Listeners */
//submit button functionality
boardSizeInp.addEventListener("submit", (e) =>{

    e.preventDefault();

    boardSize = document.getElementById("board-size");

    //checking for valid inputs
    if(boardSize.value > 20 || boardSize.value < 3){

        alert("Invalid board size selected - Try Again");
    } else {
        //hides the input form and begins the game
        boardSizeInp.style.display = "none";
        init();
    }
    
})

/* Global Functions */
const init = () =>{
    gameOn = new Board(boardSize.value);
    gameOn.generateBoard();
    gameOn.placeMines();
}
