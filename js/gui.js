GameOfLife.init(document.querySelector("canvas"));

var dragging = false;
var toggledCells = [];

function onSpeedChange() {
    GameOfLife.setSpeed(this.value);
}
function alreadyToggled(cellCoords) {
    for (var i = 0; i < toggledCells.length; i++)
        if (toggledCells[i].x === cellCoords.x && toggledCells[i].y === cellCoords.y)
            return true;
    return false;
}
function onMouseDown(event) {
    toggledCells = [];
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var cellCoords = GameOfLife.resolveCoords(x, y);
    GameOfLife.stopSimulation();
    GameOfLife.toggleCell(cellCoords.x, cellCoords.y);
    toggledCells.push(cellCoords);
    dragging = true;
}
function onMouseUp(event) {
    dragging = false;
}
function onMouseOut(event) {
    dragging = false;
}
function onMouseMove(event) {
    if (!dragging)
        return;
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var cellCoords = GameOfLife.resolveCoords(x, y);
    if (!alreadyToggled(cellCoords)) {
        GameOfLife.toggleCell(cellCoords.x, cellCoords.y);
        toggledCells.push(cellCoords);
    }
}
function onSetCanvasSize() {
    var canvas = document.querySelector("canvas");
    var input = document.getElementById("canvasSizeInput");
    canvas.width = input.value;
    canvas.height = input.value;
    GameOfLife.init(canvas);
}
function onSetTileSize() {
    var input = document.getElementById("tileSizeInput");
    GameOfLife.setTileSize(input.value);
}

function addClickEvent(id, handler) {
    document.getElementById(id).addEventListener("click", handler);
}
addClickEvent("tickButton", GameOfLife.tick);
addClickEvent("clearButton", GameOfLife.reset);
addClickEvent("startButton", GameOfLife.startSimulation);
addClickEvent("stopButton", GameOfLife.stopSimulation);
addClickEvent("randomizeButton", GameOfLife.randomizeGrid);
addClickEvent("setCanvasSize", onSetCanvasSize);
addClickEvent("setTileSize", onSetTileSize);
document.getElementById("speedSlider").addEventListener("input", onSpeedChange);
document.querySelector("canvas").addEventListener("mousedown", onMouseDown);
document.querySelector("canvas").addEventListener("mouseup", onMouseUp);
document.querySelector("canvas").addEventListener("mouseout", onMouseOut);
document.querySelector("canvas").addEventListener("mousemove", onMouseMove);