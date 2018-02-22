var GameOfLife = (function () {
    var _canvasObject = undefined;
    var _ctx = undefined;
    var _speed = 0.1;
    var _tileSize = 10;
    var _grid = [];
    var _simulationTimer = undefined;
    var _simulationRunning = false;

    function initGrid() {
        for (var i = 0; i < _gridSize; i++)
            _grid[i] = Array(_gridSize).fill(false);
    }
    function drawGrid() {
        _ctx.clearRect(0, 0, _canvasObject.width, _canvasObject.height);
        for (var x = 0; x < _gridSize; x++)
            for (var y = 0; y < _gridSize; y++)
                if (_grid[x][y])
                    _ctx.fillRect(x * _tileSize, y * _tileSize, _tileSize, _tileSize);
    }
    function validateBounds(num) {
        if (num < 0)
            num = 0;
        if (num >= _gridSize)
            num = _gridSize - 1;
        return num;
    }
    function getNumLiveNeighbors(x, y) {
        //lol this is bad but fuck it, it works
        var result = 0;
        if (x > 0 && y > 0) {
            var topLeft = _grid[x - 1][y - 1];
            if (topLeft)
                result++;
        }
        if (y > 0) {
            var top = _grid[x][y - 1];
            if (top)
                result++;
        }
        if (y > 0 && x < _gridSize - 1) {
            var topRight = _grid[x + 1][y - 1];
            if (topRight)
                result++;
        }
        if (x > 0) {
            var left = _grid[x - 1][y];
            if (left)
                result++;
        }
        if (x < _gridSize - 1) {
            var right = _grid[x + 1][y];
            if (right)
                result++;
        }
        if (x > 0 && y < _gridSize - 1) {
            var bottomLeft = _grid[x - 1][y + 1];
            if (bottomLeft)
                result++;
        }
        if (y < _gridSize - 1) {
            var bottom = _grid[x][y + 1];
            if (bottom)
                result++;
        }
        if (x < _gridSize - 1 && y < _gridSize - 1) {
            var bottomRight = _grid[x + 1][y + 1];
            if (bottomRight)
                result++;
        }
        return result;
    }

    var publics = {
        init: function (canvasObject) {
            publics.stopSimulation();
            _canvasObject = canvasObject;
            _ctx = canvasObject.getContext("2d");
            _gridSize = parseInt(_canvasObject.width / _tileSize);
            initGrid();
            drawGrid();
        },
        startSimulation: function () {
            var delay = 200 * (1 / _speed);
            _simulationTimer = window.setInterval(publics.tick, delay);
            _simulationRunning = true;
        },
        stopSimulation: function () {
            window.clearInterval(_simulationTimer);
            _simulationRunning = false;
        },
        tick: function () {
            var nextGrid = JSON.parse(JSON.stringify(_grid));
            for (var x = 0; x < _gridSize; x++) {
                for (var y = 0; y < _gridSize; y++) {
                    var numLiveNeighbors = getNumLiveNeighbors(x, y);
                    if (_grid[x][y] && (numLiveNeighbors < 2 || numLiveNeighbors > 3))
                        nextGrid[x][y] = false;
                    if (numLiveNeighbors === 3 && !_grid[x][y])
                        nextGrid[x][y] = true;
                }
            }
            _grid = JSON.parse(JSON.stringify(nextGrid));
            drawGrid();
        },
        reset: function () {
            publics.stopSimulation();
            initGrid();
            drawGrid();
        },
        setSpeed: function (speed) {
            _speed = parseFloat(speed);
            if (_simulationRunning) {
                publics.stopSimulation();
                publics.startSimulation();
            }
        },
        resolveCoords: function (canvasX, canvasY) {
            return {
                x: validateBounds(Math.floor(canvasX / _tileSize)),
                y: validateBounds(Math.floor(canvasY / _tileSize))
            };
        },
        toggleCell: function (x, y) {
            _grid[x][y] = !_grid[x][y];
            drawGrid();
        },
        randomizeGrid: function () {
            publics.stopSimulation();
            for (var x = 0; x < _gridSize; x++)
                for (var y = 0; y < _gridSize; y++)
                    _grid[x][y] = Math.random() > 0.5;
            drawGrid();
        },
        setTileSize: function (value) {
            _tileSize = parseInt(value);
            publics.init(_canvasObject);
        }
    };
    return publics;
})();