var solution = [];
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function clone(stack) {
    let arr = [];
    for(let i = 0; i < stack.length; i++) {
        arr[i] = stack[i];
    }
    return arr;
}
document.addEventListener('DOMContentLoaded', () => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    let btn = document.getElementById("generate");
    let solbtn = document.getElementById("solve");
    let scale = 0;
    solbtn.disabled=true;
    btn.addEventListener("click", (evt) => {
        c.style.border ="1px solid white";
        btn.disabled=true;
        let width = parseInt(document.getElementById("width").value);
        let height = parseInt(document.getElementById("length").value);
        if(isNaN(width) || width < 2 || width > 900) {
            width=10;
            alert("Please enter a width between 3 and 900, inclusive");
        }
        if(isNaN(height) || height < 2 || height > 900) {
            height=10;
            alert("Please enter a height between 3 and 900, inclusive");
        }
        scale = Math.max(5, 100 / (Math.max(width, height)/10));
        let wwidth = width * scale;
        let wheight = height*scale;
        c.setAttribute("width", ""+wwidth);
        c.setAttribute("height",""+wheight)
        maze(width, height, scale, c, btn, solbtn);
    });
    solbtn.addEventListener("click", (evt) => {
        if(solbtn.textContent === "Solve" && solution.length > 0) {
            paintSolve(solution, c, scale);
            solbtn.textContent="Hide";
        } else {
            hideSolve(solution, c, scale);
            solbtn.textContent="Solve";
        }
    });
});
async function paintSolve(solutionList, canvas, scale) {
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    for(let i = 0; i < solutionList.length-1; i++) {
        let curCell = solutionList[i];
        let nextCell = solutionList[i+1];
        topBottomWidth = Math.min(18, scale-4);
        rightLeftHeight = Math.min(18, scale-4);
        if(nextCell.column === curCell.column+1) {
            // to the right
            ctx.fillRect(curCell.column*scale + Math.floor((scale-rightLeftHeight)/2), curCell.row*scale+Math.floor((scale-rightLeftHeight)/2), scale*2-2*Math.floor((scale-rightLeftHeight)/2), rightLeftHeight);
        }
        else if(nextCell.column === curCell.column -1) {
            // to the left
            ctx.fillRect(nextCell.column*scale+Math.floor((scale-rightLeftHeight)/2), nextCell.row*scale+Math.floor((scale-rightLeftHeight)/2), scale*2-2*Math.floor((scale-rightLeftHeight)/2), rightLeftHeight);
        }
        else if(nextCell.row === curCell.row +1) {
            // below
            ctx.fillRect(curCell.column*scale+Math.floor((scale-topBottomWidth)/2), curCell.row*scale+Math.floor((scale-topBottomWidth)/2), topBottomWidth, scale*2-2*Math.floor((scale-topBottomWidth)/2));
        }
        else if(nextCell.row === curCell.row -1) {
            // above
            ctx.fillRect(nextCell.column*scale+Math.floor((scale-topBottomWidth)/2), nextCell.row*scale+Math.floor((scale-topBottomWidth)/2), topBottomWidth, scale*2-2*Math.floor((scale-topBottomWidth)/2));
        }
        else {
            console.log("Something's wrong with the solution list");
        }
    }
}
async function hideSolve(solutionList, canvas, scale) {
    let ctx = canvas.getContext("2d");
    for(let i = 0; i < solutionList.length-1; i++) {
        let curCell = solutionList[i];
        let nextCell = solutionList[i+1];
        topBottomWidth = Math.min(20, scale-2);
        rightLeftHeight = Math.min(20, scale-2);
        if(nextCell.column === curCell.column+1) {
            // to the right
            ctx.clearRect(curCell.column*scale + Math.floor((scale-rightLeftHeight)/2), curCell.row*scale+Math.floor((scale-rightLeftHeight)/2), scale*2-2*Math.floor((scale-rightLeftHeight)/2), rightLeftHeight);
        }
        else if(nextCell.column === curCell.column -1) {
            // to the left
            ctx.clearRect(nextCell.column*scale+Math.floor((scale-rightLeftHeight)/2), nextCell.row*scale+Math.floor((scale-rightLeftHeight)/2), scale*2-2*Math.floor((scale-rightLeftHeight)/2), rightLeftHeight);
        }
        else if(nextCell.row === curCell.row +1) {
            // below
            ctx.clearRect(curCell.column*scale+Math.floor((scale-topBottomWidth)/2), curCell.row*scale+Math.floor((scale-topBottomWidth)/2), topBottomWidth, scale*2-2*Math.floor((scale-topBottomWidth)/2));
        }
        else if(nextCell.row === curCell.row -1) {
            // above
            ctx.clearRect(nextCell.column*scale+Math.floor((scale-topBottomWidth)/2), nextCell.row*scale+Math.floor((scale-topBottomWidth)/2), topBottomWidth, scale*2-2*Math.floor((scale-topBottomWidth)/2));
        }
        else {
            console.log("Something's wrong with the solution list");
        }
    }
}
async function maze(width, height, scale, canvas, button, sol2) {
    sol2.disabled=true;
    hideSolve(solution, canvas);
    sol2.textContent="Solve";
    var maze = new Array(height);
    var visited = new Array(height);
    for(let i = 0; i < height; i++) {
        temp = [];
        temp2= [];
        for(let j = 0; j < width; j++) {
            temp[j] = new Tile(i, j, scale);
            temp2[j] = false;
        }
        maze[i] = temp;
        visited[i] = temp2;
    }
    let randRow = 0;//Math.floor(Math.random()*height);
    let randCol = 0;//Math.floor(Math.random()*width);
    let randCell = maze[randRow][randCol];
    visited[randRow][randCol] = true;
    let stack = [];
    maze[0][0].left = false;
    maze[height-1][width-1].right = false;
    stack.push(randCell);
    let ctx = canvas.getContext("2d");
    let sol = [];
    ctx.strokeStyle="black";
    while(stack.length > 0) {
        let curCell = stack.pop();
        let downi = curCell.row+1;
        let rightj = curCell.column+1;
        let upi=curCell.row-1;
        let leftj = curCell.column-1;
        let unvisitedNeighbors = [];
        if(!(downi >= height || downi < 0) && !visited[downi][curCell.column]) {
            unvisitedNeighbors.push([maze[downi][curCell.column], "down"]);
        }
        if(!(upi >= height || upi < 0) && !visited[upi][curCell.column]) {
            unvisitedNeighbors.push([maze[upi][curCell.column], "up"]);
        }
        if(!(rightj >= width || rightj < 0) && !visited[curCell.row][rightj]) {
            unvisitedNeighbors.push([maze[curCell.row][rightj], "right"]);
        }
        if(!(leftj >= width || leftj < 0) && !visited[curCell.row][leftj]) {
            unvisitedNeighbors.push([maze[curCell.row][leftj], "left"]);
        }
        if(unvisitedNeighbors.length != 0) {
            stack.push(curCell);
            let chosenNeighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
            if(chosenNeighbor[1] == "down") {
                chosenNeighbor[0].negateTop();
                curCell.negateBottom();
            }
            else if(chosenNeighbor[1] == "up") {
                chosenNeighbor[0].negateBottom();
                curCell.negateTop();
            }
            else if(chosenNeighbor[1] == "right") {
                curCell.negateRight();
                chosenNeighbor[0].negateLeft();
            }
            else if(chosenNeighbor[1] == "left") {
                chosenNeighbor[0].negateRight();
                curCell.negateLeft();
            } else {
                console.log("wtf are you doing bro");
            }
            visited[chosenNeighbor[0].row][chosenNeighbor[0].column] = true;
            stack.push(chosenNeighbor[0])
        } else {
            if(curCell === maze[height-1][width-1])
                sol = clone(stack);
            await sleep(5);
            curCell.paint(ctx);
        }
    }
    sol.push(maze[height-1][width-1]);
    solution = sol;
    button.disabled=false;
    sol2.disabled=false;
}
class Tile {
    constructor(row, col, scale) {
        this.scale = scale;
        this.row = row;
        this.column = col;
        this.top = true;
        this.right = true;
        this.bottom = true;
        this.left = true;
    }

    paint(context) {
        context.strokeStyle = "black";
        if(this.top) {
            context.moveTo(this.scale*this.column, this.scale*this.row);
            context.lineTo(this.scale*this.column+this.scale, this.scale*this.row);
            context.stroke();
        }
        if(this.left) {
            context.moveTo(this.scale*this.column, this.scale*this.row);
            context.lineTo(this.scale*this.column, this.scale*this.row+this.scale);
            context.stroke();
        }
        if(this.right) {
            context.moveTo(this.scale*this.column+this.scale, this.scale*this.row+this.scale);
            context.lineTo(this.scale*this.column+this.scale, this.scale*this.row)
            context.stroke();
        }
        if(this.bottom) {
            context.moveTo(this.scale*this.column+this.scale, this.scale*this.row+this.scale);
            context.lineTo(this.scale*this.column, this.scale*this.row+this.scale);
            context.stroke();
        }
    }

    negateBottom() {
        this.bottom=false;
    }

    negateTop() {
        this.top=false;
    }
    negateRight() {
        this.right=false;
    }
    negateLeft() {
        this.left=false;
    }
}

