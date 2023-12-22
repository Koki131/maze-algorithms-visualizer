
const mazeContainer = document.querySelector(".maze-container");

const stop = mazeContainer.querySelector("#stop-maze");

const solveSpeed = mazeContainer.querySelector("#solve-speed");

let value = 250;
let stopExecution = false;

solveSpeed.addEventListener("change", function(event) {

  switch(event.target.value) {
      case "super-slow":
        value = 500;
        break;
      case "slow":
          value = 250;
          break;
      case "medium":
          value = 150;
          break;
      case "fast":
          value = 50;
          break;
      case "super-fast":
          value = 0;
          break;
  }

});

stop.addEventListener("click", function() {
  stopExecution = true;
});


async function solveMazeDfs(maze, isAsync) {

  const stack = [];
  let curr = maze.grid[0][0];

  do {

    curr.visited = true;
    let next = curr.getRandomCell();

    if (next) {
        
      curr.color = "#B1FFCA";
      curr.highlight("#B1FFCA");  

      stack.push(curr);
      curr.removeWalls(curr, next);
      curr = next;

      curr.clearWalls();
      curr.show();


    } else if (stack.length > 0) {

      curr.color = "white";
      curr.highlight("white"); 
      curr = stack.pop();
      
      curr.clearWalls();
      curr.show();

    }
    if (isAsync) {
      await sleep(value);
    }

  } while (stack.length !== 0 && !stopExecution);
    
}

async function mazePrim(maze, isAsync) {


  const rows = [-1, 1, 0, 0];
  const cols = [0, 0, -1, 1];

  const startRow = Math.floor(Math.random() * maze.rows);
  const startCol = Math.floor(Math.random() * maze.cols);

  const arr = [];

  await addNeighbours(maze, maze.grid[startRow][startCol], rows, cols, arr);

  while (arr.length > 0 && !stopExecution) {

    const randIdx = Math.floor(Math.random() * arr.length);

    swap(arr, randIdx, arr.length-1);

    const currPair = arr.pop();
    const parent = currPair.parent;
    const curr = currPair.current;

    curr.clearWalls();
    curr.show();
    parent.clearWalls();
    parent.show();
    
    curr.color = "white";

    if (isAsync) {
      await sleep(value);
    }

  
    if (!curr.visited) {

      curr.visited = true;

      curr.removeWalls(parent, curr);
      addNeighbours(maze, curr, rows, cols, arr);

    }

  }  


}

function swap(arr, i, j) {

  const k = arr[i];
  arr[i] = arr[j];
  arr[j] = k;

}

async function addNeighbours(maze, parent, rows, cols, arr) {
  
  for (let i = 0; i < 4; i++) {

    const newRow = parent.rowNum + rows[i];
    const newCol = parent.colNum + cols[i];

    const valid = newRow >= 0 && newRow <= maze.rows-1 && newCol >= 0 && newCol <= maze.cols-1 && !maze.grid[newRow][newCol].visited;

    if (valid) {
      
      maze.grid[newRow][newCol].color = "#B1FFCA";
      arr.push(new Pair(parent, maze.grid[newRow][newCol]));
    }

  }

}

class Pair {
  constructor(parent, current) {
    this.parent = parent;
    this.current = current;
  }
}

async function kruskal(maze, isAsync) {

  const edges = [];

  const rows = [-1, 1, 0, 0];
  const cols = [0, 0, -1, 1];

  for (let cell of maze.cells) {
    
    if (stopExecution) {
      break;
    }

    for (let i = 0; i < 4; i++) {


      const row = cell.rowNum + rows[i];
      const col = cell.colNum + cols[i];

      const isValid = row >= 0 && row < maze.rows && col >= 0 && col < maze.cols;

      if (isValid) {

        const dest = maze.grid[row][col];

        const edge = new Node(cell, dest);

        edges.push(edge);
      
      }

    }

  }

  let ds = new DisjointSet(maze.grid[maze.rows-1][maze.cols-1].value);

  edges.sort(() => Math.random() - 0.5);

  for (let edge of edges) {
    
    if (stopExecution) {
      break;
    }

    const u = edge.src;
    const v = edge.dst;

    if (ds.findParent(u.value) !== ds.findParent(v.value)) {

      u.removeWalls(u, v);
      if (isAsync) {
        await sleep(value);
      }
      u.clearWalls();
      u.show();
      ds.unionBySize(u, v);
    }

  }


}

class Node {
  constructor(src, dst) {
    this.src = src;
    this.dst = dst;
  }


}

class DisjointSet {
  constructor(n) {
    this.parent = [];
    this.size = [];

    for (let i = 0; i <= n; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }
  }

  findParent(node) {

    if (node === this.parent[node]) {
      return node;
    }

    const uParent = this.findParent(this.parent[node]);
    this.parent[node] = uParent;
    return this.parent[node];

  }

  unionBySize(u, v) {

    const uParU = this.findParent(u.value);
    const uParV = this.findParent(v.value);
    
    if (uParU === uParV) {
      return;
    }

    if (this.size[uParU] < this.size[uParV]) {
      this.parent[uParU] = uParV;
      this.size[uParU] = this.size[uParU] + this.size[uParV];
    } else {
      this.parent[uParV] = uParU;
      this.size[uParV] = this.size[uParU] + this.size[uParV];
    }

  }
}



async function recursiveDivision(isAsync, maze, startRow, endRow, startCol, endCol, orientation = null) {

  if (!stopExecution) {

    if (startRow >= endRow || startCol >= endCol) {
      return;
    }

    const horizontal = orientation === null ? Math.random() < 0.5 : orientation;
  

    if (horizontal) {
        
        const randRow = randomRange(startRow, endRow);

        await addHorizontalWall(maze, randRow, startCol, endCol);
        if (isAsync) {
          await sleep(value);
        }

        await recursiveDivision(isAsync, maze, startRow, randRow, startCol, endCol, !horizontal);
        await recursiveDivision(isAsync, maze, randRow + 1, endRow, startCol, endCol, !horizontal);

    } else {

        const randCol = randomRange(startCol, endCol);

        await addVerticalWall(maze, randCol, startRow, endRow);
        if (isAsync) {
          await sleep(value);
        }
    
        await recursiveDivision(isAsync, maze, startRow, endRow, startCol, randCol, !horizontal); 
        await recursiveDivision(isAsync, maze, startRow, endRow, randCol + 1, endCol, !horizontal);

      }

  }

}



async function addHorizontalWall(maze, row, startCol, endCol) {

  const end = endCol > maze.cols-1 ? endCol - 1 : endCol
  const gap = randomRange(startCol, endCol);

  if (row + 1 >= maze.rows) {
    return;
  }

  for (let c = startCol; c <= end; c++) {

    maze.grid[row][c].walls.bottom = true;
    maze.grid[row + 1][c].walls.top = true;
    maze.grid[row][c].show();
    maze.grid[row + 1][c].show();

  }



  maze.grid[row][gap].walls.bottom = false;
  maze.grid[row + 1][gap].walls.top = false;
  maze.grid[row][gap].clearWalls();
  maze.grid[row + 1][gap].clearWalls();
  maze.grid[row][gap].show();
  maze.grid[row + 1][gap].show();



}

async function addVerticalWall(maze, col, startRow, endRow) {


  const end = endRow > maze.rows-1 ? endRow - 1 : endRow
  const gap = randomRange(startRow, endRow);

  if (col + 1 >= maze.cols) {
    return;
  }

  for (let r = startRow; r <= end; r++) {


    maze.grid[r][col].walls.right = true;
    maze.grid[r][col + 1].walls.left = true;
    maze.grid[r][col].show();
    maze.grid[r][col + 1].show();


  }


  maze.grid[gap][col].walls.right = false;
  maze.grid[gap][col + 1].walls.left = false;
  maze.grid[gap][col].clearWalls();
  maze.grid[gap][col + 1].clearWalls();
  maze.grid[gap][col].show();
  maze.grid[gap][col + 1].show();
  

}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function binaryTree(maze, isAsync) {


  for (let r = 0; r < maze.rows; r++) {
    
    if (stopExecution) {
      break;
    }

    for (let c = 0; c < maze.cols; c++) {

      if (r - 1 >= 0 && c - 1 >= 0) {

        const dirs = [maze.grid[r-1][c], maze.grid[r][c-1]];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];


        if (dir === maze.grid[r-1][c]) {
          maze.grid[r][c].walls.top = false;
          maze.grid[r-1][c].walls.bottom = false;
        } else {
          maze.grid[r][c].walls.left = false;
          maze.grid[r][c-1].walls.right = false;
        }
      
      } else if (r - 1 >= 0) {

        maze.grid[r][c].walls.top = false;
        maze.grid[r-1][c].walls.bottom = false;

      } else if (c - 1 >= 0) {

        maze.grid[r][c].walls.left = false;
        maze.grid[r][c-1].walls.right = false;
      }
      
      if (isAsync) {
        await sleep(value);
      }
      maze.grid[r][c].clearWalls();
      maze.grid[r][c].show();

    }

  }


}

async function sideWinder(maze, isAsync) {

  for (let r = 0; r < maze.rows; r++) {
    if (stopExecution) {
      break;
    }
    let start = 0;
    for (let c = 0; c < maze.cols; c++) {

      if (r > 0 && (c + 1 == maze.cols || Math.random() < 0.5)) {
        let col = start + Math.floor(Math.random() * (c - start + 1));
        maze.grid[r][col].walls.top = false;
        maze.grid[r - 1][col].walls.bottom = false;
        maze.grid[r][col].clearWalls();
        maze.grid[r][col].show();
        start = c + 1;
      } else if (c + 1 < maze.cols) {
        maze.grid[r][c].walls.right = false;
        maze.grid[r][c+1].walls.left = false;
        maze.grid[r][c].clearWalls();
        maze.grid[r][c].show();
      }
      if (isAsync) {
        await sleep(value);
      }


    }
  }


}

function setStop(value) {
  stopExecution = value
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export { solveMazeDfs, recursiveDivision, mazePrim, kruskal, binaryTree, sideWinder, setStop };