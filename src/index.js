import "./style.css";
import _ from 'lodash';
import createGrid from "./mazeGenerator";
import createShortestPathGrid from "./pathFinding";





const selectProblem = document.querySelector("#select-problem");

const mazeContainer = document.querySelector(".maze-container");
const mazeShortestPathContainer = document.querySelector(".maze-container-shortest-path");



mazeContainer.style.display = "grid";


selectProblem.addEventListener("change", function(event) {
    
    const value = event.target.value;

    switch (value) {

        case "Maze":
            mazeContainer.style.display = "grid";
            mazeShortestPathContainer.style.display = "none";
            break;
        case "Path-finding":
            mazeContainer.style.display = "none";
            mazeShortestPathContainer.style.display = "grid";
            break;
    }



});

