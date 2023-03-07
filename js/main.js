/* Cached Elements */
let boardSizeInp = document.getElementById("input");


/* Global Variables */
let boardSize;

/* Event Listeners */
boardSizeInp.addEventListener("submit", (e) =>{
    e.preventDefault();

    boardSize = document.getElementById("board-size");
    boardSizeInp.style.display = "none";
    
    init();
})

/* Global Functions */
const init = () =>{
    console.log(boardSize.value);
}
