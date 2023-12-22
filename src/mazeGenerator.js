
import { solveMazeDfs, recursiveDivision, mazePrim, kruskal, binaryTree, sideWinder, setStop } from "./algorithms";

const mazeContainer = document.querySelector(".maze-container");

const canvas = mazeContainer.querySelector("canvas");
const context = canvas.getContext("2d");

const createMaze = mazeContainer.querySelector("#create-maze");

const mazeSizeValue = mazeContainer.querySelector("#maze-number-value");
const mazeSize = mazeContainer.querySelector("#maze-size");
const algo = mazeContainer.querySelector("#select-algo");

let isRunning = false;
let maze;

let sizeVal = mazeSize.value;




export default async function createGrid(sizeVal) {

    maze = new Maze(500, sizeVal, sizeVal); 

    context.clearRect(0, 0, canvas.width, canvas.height);
    maze.setup();

    switch (algo.value) {
      case "dfs":
        maze.displayMaze();
        await solveMazeDfs(maze, true);
        maze.displayMaze();
        break;
      case "prim":
        maze.displayMaze();
        await mazePrim(maze, true);
        maze.displayMaze();
        break;
      case "kruskal":
        maze.displayMaze();
        await kruskal(maze, true);
        maze.displayMaze();
        break;
      case "division":
        maze.setupDivision();
        maze.displayMaze();
        await recursiveDivision(true, maze, 0, maze.rows, 0, maze.cols);
        maze.displayMaze();
        break;
      case "tree":
        maze.displayMaze();
        await binaryTree(maze, true);
        maze.displayMaze();
        break;
      case "sidewinder":
        maze.displayMaze();
        await sideWinder(maze, true);
        maze.displayMaze();
        break;
      default:
        maze.displayMaze();
        await solveMazeDfs(maze, true);
        maze.displayMaze(); 
    }

}




class Maze {
  constructor(size, rows, cols) {
    this.size = size;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.cells = [];
    this.end = undefined;

  }

  setupDivision() {
    this.grid = [];
    this.cells = [];
    for (let r = 0; r < this.rows; r++) {     
      let row = [];
      for (let c = 0; c < this.cols; c++) {
        let cell = new CellDivision(this.size, this.grid, this.rows, this.cols, r, c);
        row.push(cell);
      }
      this.grid.push(row);
    }
    this.end = this.grid[this.rows-1][this.cols-1];
    this.addCells();
    this.addBorders();

  }
  setup() {
    this.grid = [];
    this.cells = [];
    let value = 0;
    for (let r = 0; r < this.rows; r++) {     
      let row = [];
      for (let c = 0; c < this.cols; c++) {
        let cell = new Cell(this.size, this.grid, this.rows, this.cols, r, c, value);
        value++;
        row.push(cell);
      }
      this.grid.push(row);
    }
    this.end = this.grid[this.rows-1][this.cols-1];
    this.addCells();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  displayMaze() {

    canvas.width = this.size;
    canvas.height = this.size;
    canvas.style.background = "#ffffff";

    this.cells.forEach(cell =>  cell.show());
  
  }

  addCells() {
   
    this.grid.forEach(row => {
      row.forEach(cell => {
        this.cells.push(cell);
      });
    });


  }

  addBorders() {

    for (let i = 0; i < this.cols; i++) {
      this.grid[0][i].walls.top = true;
      this.grid[i][0].walls.left = true;
      this.grid[this.rows-1][i].walls.bottom = true;
      this.grid[i][this.cols-1].walls.right = true;
    } 

  }
  
}


class Cell {
  constructor(parentSize, parentGrid, rows, cols, rowNum, colNum, value) {
    this.parentSize = parentSize;
    this.parentGrid = parentGrid;
    this.rows = rows;
    this.cols = cols;
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.size = Math.floor(parentSize / rows);
    this.walls = {
      top: true,
      bottom: true,
      left: true,
      right: true
    }
    this.value = value;
    this.visited = false,
    this.neighbours = [];
    this.color = "white";

  }

  highlight(color) {

    context.fillStyle = color;
    context.fillRect((this.colNum * this.size) + 1, (this.rowNum * this.size) + 1, this.size - 2, this.size - 2);
  }

  setNeighbours() {

    this.neighbours = [];

    let x = this.colNum;
    let y = this.rowNum
    let left = x > 0 ? this.parentGrid[y][x - 1] : undefined;
    let right = x < this.cols - 1 ? this.parentGrid[y][x + 1] : undefined;
    let up = y > 0 ? this.parentGrid[y - 1][x] : undefined;
    let down = y < this.rows - 1 ? this.parentGrid[y + 1][x] : undefined;

    if (left && !left.visited) {
      this.neighbours.push(left);
    }
    if (right && !right.visited) {
      this.neighbours.push(right);
    }
    if (up && !up.visited) {
      this.neighbours.push(up);
    }
    if (down && !down.visited) {
      this.neighbours.push(down);
    }


  }

  getRandomCell() {
    
    this.setNeighbours();

    if (this.neighbours.length === 0) return undefined;

    let rand = Math.floor(Math.random() * this.neighbours.length);

    return this.neighbours[rand];

  }

  drawLine(fromX, fromY, toX, toY) {
    
    context.strokeStyle = "black";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();

  }

  removeLine(fromX, fromY, toX, toY) {
    
    context.strokeStyle = "white";

    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();

  }

  removeWalls(curr, next) {
    
    let xDiff = next.colNum - curr.colNum;

    if (xDiff === 1) {
    
        curr.walls.right = false;
        next.walls.left = false;
    
    } else if (xDiff === -1) {
      
        next.walls.right = false;
        curr.walls.left = false;
    
    }

    let yDiff = next.rowNum - curr.rowNum;

    if (yDiff === 1) {

        curr.walls.bottom = false;
        next.walls.top = false;
    
    } else if (yDiff === -1) {
    
        next.walls.bottom = false;
        curr.walls.top = false;
    
    }
  }


  drawWalls() {

    let fromX = 0;
    let fromY = 0;
    let toX = 0;
    let toY = 0;
    
    if (this.walls.top) {
      fromX = this.colNum * this.size;
      fromY = this.rowNum * this.size;
      toX = fromX + this.size;
      toY = fromY;   
      this.drawLine(fromX, fromY, toX, toY);
    } 

    if (this.walls.bottom) {
      fromX = this.colNum * this.size;
      fromY = (this.rowNum * this.size) + this.size;
      toX = fromX + this.size;
      toY = fromY;
      this.drawLine(fromX, fromY, toX, toY);
    } 

    if (this.walls.left) {
      fromX = this.colNum * this.size;
      fromY = this.rowNum * this.size;
      toX = fromX;
      toY = fromY + this.size;
      this.drawLine(fromX, fromY, toX, toY);
    } 

    if (this.walls.right) {
      fromX = (this.colNum * this.size) + this.size;
      fromY = this.rowNum * this.size;
      toX = fromX;
      toY = fromY + this.size;
      this.drawLine(fromX, fromY, toX, toY);
    } 
  }

  clearWalls() {
    
    let fromX = 0;
    let fromY = 0;
    let toX = 0;
    let toY = 0;
    
    if (!this.walls.top) {
      fromX = this.colNum * this.size;
      fromY = this.rowNum * this.size;
      toX = fromX + this.size;
      toY = fromY;   
      this.removeLine(fromX, fromY, toX, toY);
    } 

    if (!this.walls.bottom) {
      fromX = this.colNum * this.size;
      fromY = (this.rowNum * this.size) + this.size;
      toX = fromX + this.size;
      toY = fromY;
      this.removeLine(fromX, fromY, toX, toY);
    } 
    
    if (!this.walls.left) {
      fromX = this.colNum * this.size;
      fromY = this.rowNum * this.size;
      toX = fromX;
      toY = fromY + this.size;
      this.removeLine(fromX, fromY, toX, toY);
    } 

    if (!this.walls.right) {
      fromX = (this.colNum * this.size) + this.size;
      fromY = this.rowNum * this.size;
      toX = fromX;
      toY = fromY + this.size;
      this.removeLine(fromX, fromY, toX, toY);
    } 


  }



  show() {

    
    this.drawWalls();

    context.fillStyle = this.color
    context.fillRect((this.colNum * this.size) + 1, (this.rowNum * this.size) + 1, this.size - 2, this.size - 2);
    
  }


}

class CellDivision extends Cell {
  constructor(parentSize, parentGrid, rows, cols, rowNum, colNum, value) {
    super(parentSize, parentGrid, rows, cols, rowNum, colNum, value);
    this.size = Math.floor(parentSize / rows);
    this.walls = {
      top: false,
      bottom: false,
      left: false,
      right: false
    }
    this.visited = false,
    this.neighbours = [];
    this.color = "white";
  }



}


createMaze.addEventListener("click", async function() {

  if (!isRunning) {
    createMaze.disabled = true;
    isRunning = true;
    await createGrid(sizeVal);
    isRunning = false;
    createMaze.disabled = false;
    
    setStop(false);

  }

}); 

mazeSize.addEventListener("input", function() {

  sizeVal = mazeSize.value;
  mazeSizeValue.textContent = `${sizeVal}x${sizeVal}`

});



export { Maze as MazeGeneration };
export { Cell as CellGeneration };



