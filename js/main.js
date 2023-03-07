/* Cached Elements */
let boardSizeInp = document.getElementById("input");
let mainEl = document.querySelector("main");

/* Global Variables */
let boardSize;

/*Class Declarations*/
class Board {
    constructor(input){
        this.rows = input;
        this.cols = input;
    }

    generateBoard = () => {
        //generating an empty 2D array
        let boardArr = [];
        for (let i =0;i<this.cols;i++){
            boardArr[i] = [];
        }
        
        //Dynamically creating a table HTML element
        let table = document.createElement('table');
        for (let i=0;i<this.rows;i++){
            let eachRow = document.createElement('tr');
            for (let j=0;j<this.cols;j++){
                let eachCell = document.createElement('td');
                eachRow.append(eachCell);
            }
            table.appendChild(eachRow);
        }
        mainEl.append(table);
        console.log(mainEl);

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
}
