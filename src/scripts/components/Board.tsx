import React from "react";

function Square(props: {
    row: number,
    column: number
}) {
    return (
        <div className="square" id={props.row + "-" + props.column + "b"}></div>
    )
}

function Row(props: {
    squares: Array<JSX.Element>
}) {
    return (
        <div className="row">
            {props.squares}
        </div>
    )
}

export default function Board() {
    let board: Array<JSX.Element> = [];

    for (let i = 0; i < 8; i++) {
        let row = [];
        for (let j = 0; j < 8; j++) {
            row.push(<Square row={j} column={i} />);
        }

        board.push(<Row squares={row} />);
    }

    return (
        <div draggable={"false"} className="board">
            {board}
        </div>
    );
}