var debugmode=false; // set to true to display coordinates
var intV;
var targX=-1;
var targY=-1;
var arena;
var rightEdge;
var bottomEdge;
var target;
var lifeMsg;
var score;
var msg;
var start;
var point;
var crash;
var cols=0; // For the arena
var rows=0; // For the arena
var speed=75; // Speed of the snake in millisecond. Keep it above 10. 50 is all right
var walls = [];

var targets = [1,2,3,4,5,6,7,8,9];
var lengths = [1,2,5,11,20,30,41,56,68]; // Various lengths of snake at each target

var Direction = {
    RIGHT: 0,
    LEFT: 1,
    UP: 2,
    DOWN: 3
};

var snake = {
    dir: 0,
    blocks: [],
    len: 0
};

var player = {
    lives: 5,
    level: 0,
    score: 0,
    targetIdx: 0,
    gameOver: false
};

function growTheSnake() {
    var desiredLen = lengths[targets[player.targetIdx]];
    if(snake.len != desiredLen) {
        var diff = desiredLen - snake.len;
        var col = snake.blocks[0].col;
        var row = snake.blocks[0].row;
        switch(snake.dir) {
            case Direction.UP:
                for(var i=0; i < diff; i++) {
                    setTimeout(function(){
                        var next = row-1;
                        var elm = document.getElementById("r"+next+"c"+col);
                        snake.blocks.unshift({col: col, row: --row});
                        if(row == 1 ||
                           window.getComputedStyle(elm, null).getPropertyValue("background-color")
                            == "rgb(255, 0, 255)") collideWithWall();
                        else lengthenSnake();
                    }, speed);
                }
                break;
            case Direction.DOWN:
                for(var i=0; i < diff; i++) {
                    setTimeout(function(){
                        var next = row+1;
                        var elm = document.getElementById("r"+next+"c"+col);
                        snake.blocks.unshift({col: col, row: ++row});
                        if(row == rows ||
                           window.getComputedStyle(elm, null).getPropertyValue("background-color")
                            == "rgb(255, 0, 255)") collideWithWall();
                        else lengthenSnake();
                    }, speed);
                }
                break;
            case Direction.LEFT:
                for(var i=0; i < diff; i++) {
                    setTimeout(function(){
                        var next = col-1;
                        var elm = document.getElementById("r"+row+"c"+next);
                        snake.blocks.unshift({col: --col, row: row});
                        if(col == 1 ||
                           window.getComputedStyle(elm, null).getPropertyValue("background-color")
                            == "rgb(255, 0, 255)") collideWithWall();
                        else lengthenSnake();
                    }, speed);
                }
                break;
            case Direction.RIGHT:
                for(var i=0; i < diff; i++) {
                    setTimeout(function(){
                        var next = col+1;
                        var elm = document.getElementById("r"+row+"c"+next);
                        snake.blocks.unshift({col: ++col, row: row});
                        if(col == cols ||
                           window.getComputedStyle(elm, null).getPropertyValue("background-color")
                            == "rgb(255, 0, 255)") collideWithWall();
                        else lengthenSnake();
                    }, speed);
                }
                break;
        }
        snake.len += diff;
    }
}

function killEvents() {
    for(var x=intV; x > 0; x--) clearInterval(x);
}

function hideSnake(elem) {
    var el = document.getElementById(elem);
    if(el !== null)
        el.style.background = 'blue';
}

function showSnake(elem) {
    var el = document.getElementById(elem);
    if(el !== null)
        el.style.background = 'yellow';
}

function lengthenSnake() {
    var elem = "r"+snake.blocks[0].row+"c"+snake.blocks[0].col;
    showSnake(elem);
}

function moveSnake() {
    var elem = "r"+snake.blocks[0].row+"c"+snake.blocks[0].col;
    showSnake(elem);
    elem = "r"+snake.blocks[snake.blocks.length-1].row+"c"+snake.blocks[snake.blocks.length-1].col;
    hideSnake(elem);
    snake.blocks.pop(); // remove last element since we already hid it
    showDebug();
}

function getRandomCoordinate(max) {
    return Math.floor((Math.random()*max)+1);
}

function plotTarget() {
    targX = getRandomCoordinate(cols);
    targY = getRandomCoordinate(rows);
    target = document.getElementById("r"+targY+"c"+targX);
    target.innerHTML = targets[player.targetIdx];
}

function initGame() {
    lifeMsg.innerHTML = player.lives;
    plotTarget();
    showSnake("r"+snake.blocks[0].row+"c"+snake.blocks[0].col);
    showSnake("r"+snake.blocks[1].row+"c"+snake.blocks[1].col);
    snake.len = targets[player.targetIdx];

    intV = setInterval(begin, speed);
    function begin() {
        var col = snake.blocks[0].col;
        var row = snake.blocks[0].row;
        var elm = document.getElementById("r"+row+"c"+col);
        if (col == cols) {
            collideWithWall();
        } else {
            switch(snake.dir) {
                case Direction.UP:
                    moveUp();
                    break;
                case Direction.DOWN:
                    moveDown();
                    break;
                case Direction.LEFT:
                    moveLeft();
                    break;
                case Direction.RIGHT:
                    moveRight();
                    break;
                default:
                    moveRight();
                    break;
            }
            if(hitTarget()) drawNextTarget();
        }
    }
}

function moveUp() {
    killEvents(); // Kill previous direction
    intV = setInterval(goUp, speed);
    function goUp() {
        var col = snake.blocks[0].col;
        var row = snake.blocks[0].row;
        var next = row-1;
        var elm = document.getElementById("r"+next+"c"+col);
        if(row == 1 || window.getComputedStyle(elm, null).getPropertyValue("background-color")
           == "rgb(255, 0, 255)") {
            collideWithWall();
        } else {
            snake.blocks.unshift({col: col, row: --row});
            moveSnake();
            if(hitTarget()) drawNextTarget();
        }
    }
}

function moveDown() {
    killEvents(); // Kill previous direction
    intV = setInterval(goDown, speed);
    function goDown() {
        var col = snake.blocks[0].col;
        var row = snake.blocks[0].row;
        var next = parseInt(row+1, 10);
        var elm = document.getElementById("r"+next+"c"+col);
        if(row == rows || window.getComputedStyle(elm, null).getPropertyValue("background-color")
           == "rgb(255, 0, 255)") {
            collideWithWall();
        } else {
            snake.blocks.unshift({col: col, row: ++row});
            moveSnake();
            if(hitTarget()) drawNextTarget();
        }
    }
}

function moveLeft() {
    killEvents(); // Kill previous direction
    intV = setInterval(goLeft, speed);
    function goLeft() {
        var col = snake.blocks[0].col;
        var row = snake.blocks[0].row;
        var next =col-1;
        var elm = document.getElementById("r"+row+"c"+next);
        if(col == 1 || window.getComputedStyle(elm, null).getPropertyValue("background-color")
           == "rgb(255, 0, 255)") {
            collideWithWall();
        } else {
            snake.blocks.unshift({col: --col, row: row});
            moveSnake();
            if(hitTarget()) drawNextTarget();
        }
    }
}

function moveRight() {
    killEvents(); // Kill previous direction
    intV = setInterval(goRight, speed);
    function goRight() {
        var col = snake.blocks[0].col;
        var row = snake.blocks[0].row;
        var next = col+1;
        var elm = document.getElementById("r"+row+"c"+next);
        if(col == cols || window.getComputedStyle(elm, null).getPropertyValue("background-color")
           == "rgb(255, 0, 255)") {
            collideWithWall();
        } else {
            snake.blocks.unshift({col: ++col, row: row});
            moveSnake();
            if(hitTarget()) drawNextTarget();
        }
    }
}

function drawNextTarget() {
    // Snake ate a target, so we need to play the sound, increase the score,
    // lengthen Snake, and draw the next subsequent target in the arena
    point.play();
    player.score += targets[player.targetIdx]*100;
    score.innerHTML = player.score;
    if(targets[player.targetIdx] == 9) {
        player.level++;
        displayNextLevel();
    } else {
        target.innerHTML = '';
        player.targetIdx = (++player.targetIdx < 9) ? player.targetIdx : 0;
        growTheSnake();
        targX=targY=-1;
        plotTarget();
    }
}

function hitTarget() {
    return(snake.blocks[0].col==targX && snake.blocks[0].row==targY);
}

function clearBoard() {
    if(target !== undefined) target.innerHTML = '';
    for(var i=0; i < snake.blocks.length; i++) {
        var elem = "r"+snake.blocks[i].row+"c"+snake.blocks[i].col;
        hideSnake(elem);
    };
    snake.blocks = [];
    var level = levels[player.level];
    snake.dir = level.startDir;
    snake.blocks.unshift({col: level.startPos[0].col, row: level.startPos[0].row});
    snake.blocks.unshift({col: level.startPos[1].col, row: level.startPos[1].row});
}

function collideWithWall() {
    killEvents();
    clearBoard();
    drawArena();
    player.targetIdx = 0;
    lifeMsg.innerHTML = (player.lives > 0) ? --player.lives : (player.lives=0);
    if(player.lives > 0)
        displayCollisionMsg();
    else
        displayEndGameMsg();
}

function displayCollisionMsg() {
    crash.play();
    msg.innerHTML = "Sammy Dies! Push Space! -->";
    msg.style.height = '30px';
    msg.style.top = (bottomEdge-parseInt(msg.style.height, 10))/2 + 'px';
    msg.style.left = (rightEdge-260)/2 + 'px';
    msg.style.display = '';
}

function displayNextLevel() {
    killEvents();
    clearBoard();
    drawArena();
    player.targetIdx = 0;
    msg.innerHTML = "Level "+levels[player.level].level+", Push Space";
    msg.style.height = '30px';
    msg.style.top = (bottomEdge-parseInt(msg.style.height, 10))/2 + 'px';
    msg.style.left = (rightEdge-260)/2 + 'px';
    msg.style.display = '';
}

function displayEndGameMsg() {
    var over = document.getElementById("endgame");
    over.play();
    player.gameOver = true;
    msg.innerHTML = "GAME  OVER<br><br>Play Again?  (Y/N)";
    msg.style.height = '60px';
    msg.style.top = (bottomEdge-parseInt(msg.style.height, 10))/2 + 'px';
    msg.style.left = (rightEdge-260)/2 + 'px';
    msg.style.display = '';
}

function showDebug() {
    if(debugmode == false) return;
    var debug = document.getElementById("debug");
    var dblog = "<b>blocks:</b> "+snake.blocks.length+
                "<br/>Level: "+levels[player.level].level+
                "<br/>Start dir: "+levels[player.level].startDir;
    debug.innerHTML = dblog;
}

function initLevel(idx) {
    var level = levels[idx];
    snake.dir = level.startDir;
    snake.blocks = [];
    snake.blocks.unshift({col: level.startPos[0].col, row: level.startPos[0].row});
    snake.blocks.unshift({col: level.startPos[1].col, row: level.startPos[1].row});
    walls = level.walls.slice();
}

function drawArena() {
    initLevel(player.level);
    var tbl = document.getElementById("tbl");
    var grid = "";
    rows = 0;
    for(var y=0;y<55;y++) { // ROWS
        grid += "<tr style='width:800px; height:10px;'>";
        rows++;
        cols = 0;
        for(var x=0;x<73;x++) { // COLS
            grid += "<td id='r"+(y+1)+"c"+(x+1)+"' style='width:10px; height:10px;' class='";
            if(walls.length > 0 && walls[0].row == y+1 && walls[0].col == x+1){
                grid += "wall ";
                walls.shift();
            }
            if(debugmode) grid += "bordered";
            grid += "'></td>";
            cols++;
        }
        grid += "</tr>";
    }
    tbl.innerHTML = grid;
}

// Execute once document is ready
(function() {
    document.addEventListener('keydown', function(event){
        if(player.gameOver && event.keyCode == 89) {
            start.play();
            player.lives = 5;
            player.level = 0;
            player.gameOver = false;
            msg.style.display = 'none';
            displayNextLevel();
        }
        else
            switch(event.keyCode) {
                case 37:
                    if(msg.style.display == '') break;
                    if(snake.dir == Direction.RIGHT) break;
                    killEvents();
                    snake.dir = Direction.LEFT;
                    moveLeft(); // Left arrow
                    break;
                case 38:
                    if(msg.style.display == '') break;
                    if(snake.dir == Direction.DOWN) break;
                    killEvents();
                    snake.dir = Direction.UP;
                    moveUp(); // Up arrow
                    break;
                case 39:
                    if(msg.style.display == '') break;
                    if(snake.dir == Direction.LEFT) break;
                    killEvents();
                    snake.dir = Direction.RIGHT;
                    moveRight(); // Right arrow
                    break;
                case 40:
                    if(msg.style.display == '') break;
                    if(snake.dir == Direction.UP) break;
                    killEvents();
                    snake.dir = Direction.DOWN;
                    moveDown(); // Down arrow
                    break;
                case 32: // Space bar
                    if(msg.style.display == 'none') break;
                    if(player.level === 0 && player.lives === 5) start.play();
                    msg.style.display = 'none';
                    initGame();
                    break;
                case 78: // N for no new game
                    // Gracefully end game somehow. Maybe clear arena
                    break;
                case 27: // Escape key
                    // Ask to quit game, maybe?
                    break;
                case 81: // Q
                    // Ask to quit game, maybe?
                    break;
            }
    });
    start = document.getElementById("startgame");
    point = document.getElementById("point");
    crash = document.getElementById("crash");
    score = document.getElementById("score");
    lifeMsg = document.getElementById("lives");
    msg = document.getElementById("msgBox");
    msg.style.display = 'none';
    arena = document.getElementById("container");
    rightEdge = arena.clientWidth;
    bottomEdge = arena.clientHeight;

    // Once the DOM is ready, we start...
    displayNextLevel();
})();