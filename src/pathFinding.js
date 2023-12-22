
import { solveMazeDfs, recursiveDivision, mazePrim, kruskal, binaryTree, sideWinder } from "./algorithms";
import { MinHeap, CustomHeap } from "./heapStrategy";

const mazeContainer = document.querySelector(".maze-container-shortest-path");

const canvas = mazeContainer.querySelector("#grid-canvas");
const context = canvas.getContext("2d");

const dijkstraCanvas = mazeContainer.querySelector("#dijkstra-canvas");
const dijkstraContext = dijkstraCanvas.getContext("2d");

const bfsCanvas = mazeContainer.querySelector("#bfs-canvas");
const bfsContext = bfsCanvas.getContext("2d");

const dfsCanvas = mazeContainer.querySelector("#dfs-canvas");
const dfsContext = dfsCanvas.getContext("2d");

const createMaze = mazeContainer.querySelector("#create-maze");
const solveMazeButton = mazeContainer.querySelector("#solve-maze");
const solveForm = mazeContainer.querySelector("#solve-form");
const stopMaze = mazeContainer.querySelector("#stop-maze");
const mazeSizeValue = mazeContainer.querySelector("#maze-number-value");
const mazeSize = mazeContainer.querySelector("#maze-size");
const solveSpeed = mazeContainer.querySelector("#solve-speed");
const mazeType = mazeContainer.querySelector("#maze-type");

const algo = mazeContainer.querySelector("#select-algo");


let curr;
let isRunning = false;
let isSolved = false;
let maze;
let mazeDijkstra;
let mazeBfs;
let mazeDfs;
let stopExecution = false;
let sizeVal = mazeSize.value;

let value = 100;




export default async function createShortestPathGrid(sizeVal) {

  context.clearRect(0, 0, canvas.width, canvas.height);
  dijkstraContext.clearRect(0, 0, dijkstraCanvas.width, dijkstraCanvas.height);
  bfsContext.clearRect(0, 0, bfsCanvas.width, bfsCanvas.height);
  dfsContext.clearRect(0, 0, dfsCanvas.width, dfsCanvas.height);
  
  maze = new Maze(400, sizeVal, sizeVal);

    
  maze.setup();

  mazeDijkstra = _.cloneDeep(maze);
  mazeBfs = _.cloneDeep(maze);
  mazeDfs = _.cloneDeep(maze);


  maze.displayMaze();

  switch (algo.value) {
    case "dfs":
      await solveMazeDfs(maze, false);
      break;
    case "prim":
      await mazePrim(maze, false);
      break;
    case "kruskal":
      await kruskal(maze, false);
      break;
    case "division":
      maze.setupDivision();
      maze.displayMaze();
      await recursiveDivision(false, maze, 0, maze.rows, 0, maze.cols);
      break;
    case "tree":
      await binaryTree(maze, false);
      break;
    case "sidewinder":
      await sideWinder(maze, false);
      break;
    default:
      await solveMazeDfs(maze, false);

  }

  maze.displayMaze();

  maze.unvisitCells();
  stopExecution = false;

  mazeDijkstra = _.cloneDeep(maze);
  mazeBfs = _.cloneDeep(maze);
  mazeDfs = _.cloneDeep(maze);

  maze.copyCanvas(canvas, dijkstraCanvas, dijkstraContext);
  maze.copyCanvas(canvas, bfsCanvas, bfsContext);
  maze.copyCanvas(canvas, dfsCanvas, dfsContext);



}


class Maze {
  constructor(size, rows, cols) {
    this.size = size;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.end = undefined;
    this.cells = [];
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
  
  
  async mazeDfs() {

    const stack = [];

    do {

      curr.visited = true;
      let next = curr.getRandomCell();
  
      if (next) {
         
        stack.push(curr);
        curr.removeWalls(curr, next);
        curr = next;

  
      } else if (stack.length > 0) {
    
        curr = stack.pop();
  
  
      }
  
    } while (stack.length !== 0 && !stopExecution);
    
  }
  

  unvisitCells() {

    this.grid.forEach((row) => {
      row.forEach((cell) => {
        cell.visited = false;
      });
    });

  }

  async displayMaze() {

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

  async solveMazeDijkstra() {

    const parentMap = new Map();

    const heap = new MinHeap();

    const rows = [-1, 1, 0, 0];
    const cols = [0, 0, -1, 1];

    const dist = [];

    for (let i = 0; i < this.rows; i++) {
      let r = [];
      for (let j = 0; j < this.cols; j++) {
        r.push(Math.floor(1e9));
      }
      dist.push(r);
    }


    dist[0][0] = 0;

    heap.insert(new Pair(this.grid[0][0], 0));

    while (!heap.isEmpty() && !stopExecution) {

      const curr = heap.delete();
      const currEl = curr.cell;
      const currWeight = curr.weight;

      if (currEl === this.end) {
        break;
      }


      currEl.highlight("red", "dijkstra");
      await this.sleep(value);
      currEl.highlight("#DED9E2", "dijkstra");
      await this.sleep(value);


      const currWalls = [currEl.walls.top, currEl.walls.bottom, currEl.walls.left, currEl.walls.right];

      for (let i = 0; i < 4; i++) {

        const coord = [currEl.rowNum, currEl.colNum];
        const newRow = coord[0] + rows[i];
        const newCol = coord[1] + cols[i];


        const isValid = newRow >= 0 && newRow <= this.grid.length-1 && newCol >= 0 && newCol <= this.grid.length-1 && !currWalls[i];

        if (isValid && currWeight + 1 < dist[newRow][newCol]) {

          const nextEl = this.grid[newRow][newCol];

          dist[newRow][newCol] = currWeight + 1;
          parentMap.set(nextEl, currEl);
          heap.insert(new Pair(nextEl, dist[newRow][newCol]));

        }


      }

    }
    if (!stopExecution) await this.reconstructPath(parentMap, this.end, "#8ECDDD", "dijkstra");
  }

  async solveMazeBfs() {

    const parentMap = new Map();

    const rows = [-1, 1, 0, 0];
    const cols = [0, 0, -1, 1]; 

    const queue = new Queue();


    queue.offer(this.grid[0][0]);
    this.grid[0][0].visited = true;

    while (queue.length > 0 && !stopExecution) {

      if (!stopExecution) {

        const curr = queue.poll();

        curr.highlight("black", "bfs");
        await this.sleep(value);
        curr.highlight("#F1EB90", "bfs");
        await this.sleep(value);
        
        if (curr === this.end) {
          break;

        }

        const currWalls = [curr.walls.top, curr.walls.bottom, curr.walls.left, curr.walls.right];

        for (let i = 0; i < 4; i++) {

          const coord = [curr.rowNum, curr.colNum];

          const row = coord[0] + rows[i];
          const col = coord[1] + cols[i];

          const isValid = row >= 0 && row <= this.grid.length-1 && col >= 0 && col <= this.grid.length-1 && !currWalls[i] && !this.grid[row][col].visited;
      
          if (isValid) {
            
            queue.offer(this.grid[row][col]);
            this.grid[row][col].visited = true;
            parentMap.set(this.grid[row][col], curr);

          }
        }

      } else {

        break;
      
      }
      
    }

    if (!stopExecution) await this.reconstructPath(parentMap, this.end, "#F0B86E", "bfs");
  }

  async solveMazeDfs(row, col, prevRow, prevCol) {

    if (!isSolved && !stopExecution) {

      const currWalls = this.grid[row][col].walls;

      let up = currWalls.top;
      let down = currWalls.bottom;
      let left = currWalls.left;
      let right = currWalls.right;
  
      const isValid = row > this.grid.length-1 || row < 0 || col > this.grid.length -1 || col < 0 || this.grid[row][col].visited;

      if (isValid) {
        return;
      }
  
      if (this.grid[row][col] === this.end) {
        this.grid[prevRow][prevCol].highlight("#B1FFCA", "dfs");
        this.grid[row][col].highlight("#B1FFCA", "dfs");
        isSolved = true;
        return;
      }
  
      this.grid[row][col].visited = true;

      this.grid[prevRow][prevCol].highlight("#B1FFCA", "dfs");
      this.grid[row][col].highlight("red", "dfs");

      await this.sleep(value);
      if (!up) await this.solveMazeDfs(row - 1, col, row, col);
      if (!down) await this.solveMazeDfs(row + 1, col, row, col);
      if (!left) await this.solveMazeDfs(row, col - 1, row, col);
      if (!right) await this.solveMazeDfs(row, col + 1, row, col);
      await this.sleep(value);

      if (!isSolved && !stopExecution) {
        this.grid[row][col].highlight("white", "dfs");
      }
    }
  

  }

  async solveMazeAStar() {

    const parentMap = new Map();

    const minHeap = new CustomHeap();

    const start = this.grid[0][0];
    const gScore = [];
    const fScore = [];

    for (let r = 0; r < this.rows; r++) {
        const temp = [];
        for (let c = 0; c < this.cols; c++) {
          temp.push(Math.round(1e9));
        }
        gScore.push(temp);
    }

    for (let r = 0; r < this.rows; r++) {
      const temp = [];
      for (let c = 0; c < this.cols; c++) {
        temp.push(Math.round(1e9));
      }
    fScore.push(temp);
  }

    const rows = [-1, 1, 0, 0];
    const cols = [0, 0, -1, 1];

    gScore[0][0] = 0;
    fScore[0][0] = this.distance(start, this.grid[this.rows-1][this.cols-1]);


    minHeap.insert(new Tuple(fScore[0][0], this.distance(start, this.grid[this.rows-1][this.cols-1]), start));

    while (!minHeap.isEmpty() && !stopExecution) {

      const curr = minHeap.delete();
      const currCell = curr.cell;
      const currRow = currCell.rowNum;
      const currCol = currCell.colNum;

      currCell.highlight("#05A8AA", "aStar");
      await this.sleep(value);
      currCell.highlight("#CEEDC7", "aStar");
      await this.sleep(value);

      if (currCell === this.end) {
        break;
      }

      const currWalls = [currCell.walls.top, currCell.walls.bottom, currCell.walls.left, currCell.walls.right];


      for (let i = 0; i < 4; i++) {

        const newRow = currRow + rows[i];
        const newCol = currCol + cols[i];

        const isValid = newRow >= 0 && newRow <= this.rows-1 && newCol >= 0 && newCol <= this.cols-1 && !currWalls[i];

        if (isValid) {

          const newCell = this.grid[newRow][newCol];
          
          const tempGScore = gScore[currRow][currCol] + 1;
          const tempFScore = tempGScore + this.distance(newCell, this.grid[this.rows-1][this.cols-1]);
 
          if (tempFScore < fScore[newRow][newCol]) {

            gScore[newRow][newCol] = tempGScore;
            fScore[newRow][newCol] = tempFScore;  
   
            minHeap.insert(new Tuple(fScore[newRow][newCol], this.distance(newCell, this.grid[this.rows-1][this.cols-1]), newCell));

            parentMap.set(newCell, currCell);
          }


        }

      }

    }

    if (!stopExecution) await this.reconstructPath(parentMap, this.end, "#FD8A8A", "aStar");

  }

  distance(cell1, cell2) {

    const x1 = cell1.rowNum;
    const x2 = cell2.rowNum;
    const y1 = cell1.colNum;
    const y2 = cell2.colNum;

    return Math.abs(x1 - x2) + Math.abs(y1 - y2);

  }

  async reconstructPath(parentMap, end, color, ctx) {

    let current = end;

    while (current !== this.grid[0][0]) {

      current.color = color;
      current.highlight(color, ctx);
      await this.sleep(value);
      current = parentMap.get(current);
    
    }
    
    this.grid[0][0].highlight(color, ctx);
  }

  
  copyCanvas(orgCanvas, canvas, context) {

    // Mirror the contents of the first canvas onto the second canvas
    context.clearRect(0, 0, canvas.width, canvas.height);


    context.drawImage(orgCanvas, 0, 0, canvas.width, canvas.height);

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
    this.visited = false,
    this.neighbours = [];
    this.color = "white";
    this.value = value;
  }

  highlight(color, ctx) {

    switch (ctx) {
      case "aStar":
        ctx = context;
        break;
      case "dijkstra":
        ctx = dijkstraContext;
        break;
      case "bfs":
        ctx = bfsContext;
        break;
      case "dfs":
        ctx = dfsContext;
        break;
      default:
        ctx = context;
    }

    ctx.fillStyle = color;
    ctx.fillRect((this.colNum * this.size) + 1, (this.rowNum * this.size) + 1, this.size - 2, this.size - 2);
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

    
    this.getDifference(curr, next);


    let newNext = this.getRandomCell();

    // introduce randomness to generate multiple paths
    // increase to create a more scuffed maze 

    if (mazeType.value !== "perfect-maze" && algo.value === "dfs") {

      if (newNext !== next && Math.random() < 0.7) {

        this.getDifference(curr, newNext);
    
      } 
  
    }
  }

  getDifference(curr, next) {

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

class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  offer(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  poll() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}


class Pair {
  constructor(cell, weight) {
    this.cell = cell;
    this.weight = weight;
  }
}

class Tuple {
  constructor(fScore, distance, cell) {
    this.fScore = fScore;
    this.distance = distance;
    this.cell = cell;
  }
}

createMaze.addEventListener("click", async function() {

  if (!isRunning) {
    createMaze.disabled = true;
    solveMazeButton.disabled = true;
    
    isRunning = true;

    await createShortestPathGrid(sizeVal);
    
    isSolved = false;
    isRunning = false;
    solveMazeButton.disabled = false;
    
    createMaze.disabled = false;
    
    if (stopExecution) {
      solveMazeButton.disabled = true;
      
      stopExecution = false;
    }

  }

}); 

mazeSize.addEventListener("input", function() {

  sizeVal = mazeSize.value;
  mazeSizeValue.textContent = `${sizeVal}x${sizeVal}`

});


function solveMaze() {

  const promieses = [maze.solveMazeAStar(), mazeBfs.solveMazeBfs(), 
    mazeDijkstra.solveMazeDijkstra(), mazeDfs.solveMazeDfs(0, 0, 0, 0)];
  
    return Promise.all(promieses);
}
  
solveForm.addEventListener("submit", async function(event) {

  event.preventDefault();

  if (!isRunning && !isSolved) {

    isRunning = true;
    createMaze.disabled = true;
    solveMazeButton.disabled = true;

    await solveMaze();
    
    isRunning = false;
    solveMazeButton.disabled = false;
    
    createMaze.disabled = false;

  }

});

algo.addEventListener("change", function() {

  algo.value === "dfs" ? mazeType.style.display = "block" : mazeType.style.display = "none";


});

stopMaze.addEventListener("click", function() {

  stopExecution = true;
  
});

solveSpeed.addEventListener("change", function(event) {

  switch(event.target.value) {
      case "slow":
          value = 100;
          break;
      case "medium":
          value = 50;
          break;
      case "fast":
          value = 25;
          break;
      case "super-fast":
          value = 0;
          break;
  }

});






