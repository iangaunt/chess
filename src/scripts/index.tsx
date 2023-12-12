import "../css/style.css";

import React from "react";
import { createRoot } from "react-dom/client";

import Board from "./components/Board";
import Data from "./components/Data"
import Pieces from "./components/Pieces";

createRoot(document.getElementById("main")).render((
    <div className="container">
        <Pieces />
        <Board />
        <Data />
    </div>
));