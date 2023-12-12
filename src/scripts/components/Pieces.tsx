import React from "react";

const king = "♔";
const queen = "♕";
const rook = "♖";
const bishop = "♗";
const knight = "♘";
const pawn = "♙";
const blank = "";

const dot = "●";

let startingPosition = [
    [rook, knight, bishop, queen, king, bishop, knight, rook],
    [pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn],
    [blank, blank, blank, blank, blank, blank, blank, blank],
    [blank, blank, blank, blank, blank, blank, blank, blank],
    [blank, blank, blank, blank, blank, blank, blank, blank],
    [blank, blank, blank, blank, blank, blank, blank, blank],
    [pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn],
    [rook, knight, bishop, queen, king, bishop, knight, rook],
]

let pieces: HTMLElement;
let movingElement: HTMLElement = null;

let mouseX: number;
let mouseY: number;
let dx: number, dy: number;

let turn = "white";

function mouseMovement(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (movingElement != null) {
        movingElement.style.left = mouseX - dx + "px";
        movingElement.style.top = mouseY - dy + "px";
    }
}

function setMovingPiece(row: number, column: number) {
    if (pieces == null) pieces = document.getElementById("pieces");
    if (movingElement == null) movingElement = document.getElementById(row + "-" + column);

    dx = pieces.offsetLeft + movingElement.offsetLeft + movingElement.offsetWidth / 2;
    dy = pieces.offsetTop + movingElement.offsetTop + movingElement.offsetHeight / 2;
    calculatePossibleMoves(movingElement);
}

function dropPiece(checkForNewPosition: boolean) {
    if (movingElement == null) return;

    if (movingElement.getElementsByTagName("h1").item(0).innerHTML == blank || !checkForNewPosition || !movingElement.classList.contains(turn)) {
        movingElement.style.left = null;
        movingElement.style.top = null;
        movingElement = null;

        clearDots();
        return;
    }

    let lowestDiffElem = null;
    let lowestDiff = Infinity;

    if (movingElement != null) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + "-" + j) != movingElement.id) {
                    let elem = document.getElementById(i + "-" + j);
                    let diffX = Math.abs(movingElement.offsetLeft - elem.offsetLeft);
                    let diffY = Math.abs(movingElement.offsetTop - elem.offsetTop);

                    let diff = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
                    if (diff < lowestDiff) {
                        lowestDiffElem = elem;
                        lowestDiff = diff;
                    }
                }
            }
        }

        movingElement.style.left = null;
        movingElement.style.top = null;

        if (lowestDiff <= movingElement.offsetHeight / 2 && document.getElementById(lowestDiffElem.id + "b").innerHTML == dot) {
            let temp = movingElement.getElementsByTagName("h1").item(0).innerHTML;
            movingElement.getElementsByTagName("h1").item(0).innerHTML = blank;
            lowestDiffElem.getElementsByTagName("h1").item(0).innerHTML = temp;
    
            let movingColor = movingElement.classList.contains("black") ? "black" : "white";
            let tempColor = lowestDiffElem.classList.contains("black") ? "black" : "white";

            if (movingColor != tempColor) {
                movingElement.classList.toggle(movingColor);
                movingElement.classList.toggle(tempColor);

                lowestDiffElem.classList.toggle(movingColor);
                lowestDiffElem.classList.toggle(tempColor);
            }

            turn = turn == "white" ? "black" : "white";
            let turnElem = document.getElementById("turn");
            turnElem.classList.toggle("white");
            turnElem.classList.toggle("black");

            turnElem.innerHTML = turnElem.innerHTML == "White" ? "Black" : "White";
        }
    }

    movingElement = null;
    clearDots();
}

function calculatePossibleMoves(element: HTMLElement) {
    if (movingElement == null) return;
    const piece: string = element.getElementsByTagName("h1").item(0).innerHTML;
    const color: string = element.classList.contains("black") ? "black" : "white";

    const id: string = element.id;
    const row: number = parseInt(id.substring(0, id.indexOf("-")));
    const column: number = parseInt(id.substring(id.indexOf("-") + 1));

    if (piece == pawn) {
        if (color == "black") {
            if (isClear(row, column + 1)) {
                addDot(row, column + 1);
                if (isClear(row, column + 2) && column == 1) {
                    addDot(row, column + 2);
                }
            }
        } else {
            if (isClear(row, column - 1)) {
                addDot(row, column - 1);
                if (isClear(row, column - 2) && column == 6) {
                    addDot(row, column - 2);
                }
            }
        }
    } else if (piece == knight) {
        for (let i = -2; i <= 2; i += 4) {
            for (let j = -1; j <= 1; j += 2) {
                if (isClear(row + i, column + j)) addDot(row + i, column + j);
                if (isClear(row + j, column + i)) addDot(row + j, column + i);
            }
        }
    } else if (piece == bishop) {
        checkDiagonalCollisions(row, column, 8);
    } else if (piece == rook) {
        checkHorizontalCollisions(row, column, 8);
    } else if (piece == queen) {
        checkHorizontalCollisions(row, column, 8);
        checkDiagonalCollisions(row, column, 8);
    } else if (piece == king) {
        checkHorizontalCollisions(row, column, 1);
        checkDiagonalCollisions(row, column, 1);
    }
}

function checkDiagonalCollisions(row: number, column: number, max: number) {
    let axis = [1, 1, 1, 1];
    let offset = 1;

    let color = document.getElementById(row + "-" + column).classList.contains("black") ? "black" : "white";

    while (axis.indexOf(1) > -1 && offset <= max) {
        let currAxisPosition = 0;
        for (let i = -offset; i <= offset; i += offset * 2) {
            for (let j = -offset; j <= offset; j += offset * 2) {
                if (axis[currAxisPosition] == 1 && isClear(row + i, column + j)) {
                    addDot(row + i, column + j)
                } else {
                    axis[currAxisPosition] = 0;
                    if (isValidPosition(row + i, column + j)) {
                        if (!document.getElementById((row + i) + "-" + (column + j)).classList.contains(color)) {
                            addDot(row + i, column + j);
                        }
                    }
                }
                currAxisPosition++;
            }
        }

        offset++;
    }
}

function checkHorizontalCollisions(row: number, column: number, max: number) {
    let axis = [1, 1, 1, 1];
    let offset = 1;

    let color = document.getElementById(row + "-" + column).classList.contains("black") ? "black" : "white";

    while (axis.indexOf(1) > -1 && offset <= max) {
        let currAxisPosition = 0;
        for (let i = -offset; i <= offset; i += offset * 2) {
            if (isClear(row + i, column) && axis[currAxisPosition] == 1) {
                addDot(row + i, column);
            } else {
                axis[currAxisPosition] = 0;
                if (isValidPosition(row + i, column)) {
                    if (!document.getElementById((row + i) + "-" + (column)).classList.contains(color)) {
                        addDot(row + i, column);
                    }
                }
            }
            currAxisPosition++;
        }

        for (let i = -offset; i <= offset; i += offset * 2) {
            if (isClear(row, column + i) && axis[currAxisPosition] == 1) {
                addDot(row, column + i);
            } else {
                axis[currAxisPosition] = 0;
                if (isValidPosition(row, column + i)) {
                    if (!document.getElementById((row) + "-" + (column + i)).classList.contains(color)) {
                        addDot(row, column + i);
                    }
                }
            }
            currAxisPosition++;
        }

        offset++;
    }
}

function addDot(row: number, column: number) { 
    document.getElementById(row + "-" + column + "b").innerHTML = dot; 
}

function isValidPosition(row: number, column: number) {
    return !(row < 0 || row > 7 || column < 0 || column > 7);
}

function isClear(row: number, column: number) {
    if (!isValidPosition(row, column)) return false;
    
    let element = document.getElementById(row + "-" + column);
    return element.getElementsByTagName("h1").item(0).innerHTML == blank;
}

function clearDots() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            document.getElementById(j + "-" + i + "b").innerHTML = blank;
        }
    }
}

/**
 * Creates a new square on the chess board containing an ASCII 
 * character specifying the type of piece occupying its location.
 * 
 * @param props - Specifies the color, type of piece, row, and column of the square.
 * Note that the row and column properties do not lock the piece to a location and are
 * used to specify its current position.
 * 
 * @returns - A JSX element representing the square.
 */
function Square(props: {
    color: string,
    piece: string,
    row: number,
    column: number
}) {
    return (
        <div id={props.row + "-" + props.column} draggable={"false"} className={"square " + props.color} 
        onMouseDown={() => setMovingPiece(props.row, props.column)}>
            <h1>{props.piece}</h1>
        </div>
    )
}

/**
 * Creates a new 8x8 grid of chess pieces which can be dragged 
 * by the user, allowing two players to play chess.
 * 
 * @returns - A JSX element containing an array of pieces.
 */
export default function Pieces() {
    // Create a new array of JSX elements.
    let pieces: Array<JSX.Element> = [];

    // Build eight rows of eight pieces.
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const color: string = i > 3 ? "white" : "black";
            pieces.push(<Square row={j} column={i} color={color} piece={startingPosition[i][j]} />);
        }
    }
    
    // Return a container of pieces with mouse movement logic for placing pieces.
    return (
        <div id="pieces" className="pieces" draggable={"false"} 
        onMouseMove={(e) => { mouseMovement(e) }} onMouseLeave={() => { dropPiece(false) }} onMouseUp={() => { dropPiece(true) }}>
            {pieces}
        </div>
    )
}