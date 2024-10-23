var Plateau = /** @class */ (function () {
    function Plateau(x, y) {
        this.length = x;
        this.height = y;
    }
    Plateau.prototype.isWithinBounds = function (x, y) {
        return x >= 0 && x <= this.length && y >= 0 && y <= this.height;
        // will return true if within bounds otherwise false and that move will be ignored.
    };
    return Plateau;
}());
var Robot = /** @class */ (function () {
    function Robot(x, y, heading, plateau) {
        this.DIRECTIONS = ["N", "E", "S", "W"];
        this.COMMANDS = ["L", "R", "M"];
        if (!this.isValidHeading(heading)) {
            throw new Error("Invalid heading '".concat(heading, "'. Allowed values: N, E, S, W."));
        }
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.plateau = plateau;
    }
    Robot.prototype.isValidHeading = function (heading) {
        return this.DIRECTIONS.indexOf(heading) !== -1;
    };
    Robot.prototype.isValidCommand = function (command) {
        return this.COMMANDS.indexOf(command) !== -1;
    };
    Robot.prototype.move = function (invalidPositions) {
        // function for movement based on direction
        console.log("currentPosition", this.x, this.y);
        if (this.heading === "N" &&
            this.plateau.isWithinBounds(this.x, this.y + 1) &&
            this.isValidPosition({ position: [this.x, this.y + 1] }, invalidPositions)) {
            this.y += 1;
        }
        else if (this.heading === "E" &&
            this.plateau.isWithinBounds(this.x + 1, this.y) &&
            this.isValidPosition({ position: [this.x + 1, this.y] }, invalidPositions)) {
            console.log(this.isValidPosition({ position: [this.x + 1, this.y] }, invalidPositions), "is Valid position here");
            console.log(invalidPositions, "is invalid position");
            this.x += 1;
        }
        else if (this.heading === "S" &&
            this.plateau.isWithinBounds(this.x, this.y - 1) &&
            this.isValidPosition({ position: [this.x, this.y - 1] }, invalidPositions)) {
            this.y -= 1;
        }
        else if (this.heading === "W" &&
            this.plateau.isWithinBounds(this.x - 1, this.y) &&
            this.isValidPosition({ position: [this.x - 1, this.y] }, invalidPositions)) {
            this.x -= 1;
        }
    };
    Robot.prototype.rotateL = function () {
        // function to rotate anticlockwise
        var currentIdx = this.DIRECTIONS.indexOf(this.heading);
        this.heading = this.DIRECTIONS[(currentIdx + 3) % 4];
    };
    Robot.prototype.rotateR = function () {
        // function to rotate clockwise
        var currentIdx = this.DIRECTIONS.indexOf(this.heading);
        this.heading = this.DIRECTIONS[(currentIdx + 1) % 4];
    };
    Robot.prototype.runCommands = function (commands, invalidPositions) {
        // function which runs the commands based on directions given by the user.
        for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
            var command = commands_1[_i];
            if (!this.isValidCommand(command)) {
                throw new Error("Invalid command '".concat(command, "'. Allowed values: L, R, M."));
            }
            if (command === "L") {
                this.rotateL();
            }
            else if (command === "R") {
                this.rotateR();
            }
            else if (command === "M") {
                this.move(invalidPositions);
            }
        }
    };
    Robot.prototype.getPosition = function () {
        //function to give the position of the particular robot
        return "".concat(this.x, " ").concat(this.y, " ").concat(this.heading);
    };
    Robot.prototype.getInvalidPosition = function () {
        return {
            "position": [this.x, this.y]
        };
    };
    Robot.prototype.isValidPosition = function (robotNextPosition, invalidPositions) {
        for (var i = 0; i < invalidPositions.length; i++) {
            var pos = invalidPositions[i];
            if (robotNextPosition.position[0] === pos.position[0] &&
                robotNextPosition.position[1] === pos.position[1]) {
                console.log(robotNextPosition.position, "nextPosition");
                console.log("collision alert");
                return false;
            }
        }
        return true;
    };
    return Robot;
}());
var Controller = /** @class */ (function () {
    function Controller() {
        // class to manage multiple robots and get their final positions
        this.robots = [];
        this.invalidPositions = [];
    }
    Controller.prototype.initializeRobots = function (plateau, robotsInfo) {
        var _this = this;
        robotsInfo.forEach(function (robotInfo) {
            var _a = robotInfo.position, x = _a[0], y = _a[1], orientation = _a[2];
            try {
                var robot = new Robot(x, y, orientation, plateau);
                robot.runCommands(robotInfo.commands, _this.robots.map(function (robot) { return robot.getInvalidPosition(); }));
                _this.robots.push(robot);
            }
            catch (error) {
                console.error(error.message);
            }
        });
    };
    Controller.prototype.getFinalPositions = function () {
        return this.robots.map(function (robot) { return robot.getPosition(); });
    };
    return Controller;
}());
function parseInput(inputData) {
    var lines = inputData.trim().split("\n");
    var plateauSize = lines[0].split(" ").map(Number);
    var robotsInfo = [];
    for (var i = 1; i < lines.length; i += 2) {
        var _a = lines[i].split(" "), x = _a[0], y = _a[1], heading = _a[2];
        var position = [
            parseInt(x),
            parseInt(y),
            heading,
        ];
        var commands = lines[i + 1];
        robotsInfo.push({ position: position, commands: commands });
    }
    return { plateauSize: plateauSize, robotsInfo: robotsInfo };
}
function main(inputData) {
    //start
    var _a = parseInput(inputData), plateauSize = _a.plateauSize, robotsInfo = _a.robotsInfo;
    var plateau = new Plateau(plateauSize[0], plateauSize[1]);
    var controller = new Controller();
    controller.initializeRobots(plateau, robotsInfo);
    var finalPositions = controller.getFinalPositions();
    finalPositions.forEach(function (position) { return console.log(position); });
}
var inputData = "5 5\n1 2 N\nLMLMLMLMM\n0 4 S\nMLM";
main(inputData);
