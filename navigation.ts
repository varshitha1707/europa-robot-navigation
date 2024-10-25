class Plateau {
  //class which tells us the size of the plateau
  length: number;
  height: number;

  constructor(x: number, y: number) {
    this.length = x;
    this.height = y;
  }

  isWithinBounds(x: number, y: number): boolean {
    return x >= 0 && x <= this.length && y >= 0 && y <= this.height;
    // will return true if within bounds otherwise false and that move will be ignored.
  }
}

class Robot {
  //class which holds all the details about a specific robot
  private x: number;
  private y: number;
  private heading: string;
  private plateau: Plateau;
  private fuel: number;
  private readonly DIRECTIONS: string[] = ["N", "E", "S", "W"];
  private readonly COMMANDS: string[] = ["L", "R", "M"];

  constructor(
    x: number,
    y: number,
    heading: string,
    fuelCapacity: number,
    plateau: Plateau,
  ) {
    if (!this.isValidHeading(heading)) {
      throw new Error(
        `Invalid heading '${heading}'. Allowed values: N, E, S, W.`
      );
    }

    this.x = x;
    this.y = y;
    this.heading = heading;
    this.fuel = fuelCapacity;
    this.plateau = plateau;
  }

  private isValidHeading(heading: string): boolean {
    return this.DIRECTIONS.indexOf(heading) !== -1;
  }

  private isValidCommand(command: string): boolean {
    return this.COMMANDS.indexOf(command) !== -1;
  }

  move(invalidPositions: { position: [number, number] }[]) {
    // function for movement based on direction
    if (
      this.heading === "N" &&
      this.plateau.isWithinBounds(this.x, this.y + 1) &&
      this.isValidPosition({ position: [this.x, this.y + 1] }, invalidPositions)
    ) {
      this.y += 1;
    } else if (
      this.heading === "E" &&
      this.plateau.isWithinBounds(this.x + 1, this.y) &&
      this.isValidPosition({ position: [this.x + 1, this.y] }, invalidPositions)
    ) {
      this.x += 1;
    } else if (
      this.heading === "S" &&
      this.plateau.isWithinBounds(this.x, this.y - 1) &&
      this.isValidPosition({ position: [this.x, this.y - 1] }, invalidPositions)
    ) {
      this.y -= 1;
    } else if (
      this.heading === "W" &&
      this.plateau.isWithinBounds(this.x - 1, this.y) &&
      this.isValidPosition({ position: [this.x - 1, this.y] }, invalidPositions)
    ) {
      this.x -= 1;
    }
  }

  rotateL() {
    // function to rotate anticlockwise
    const currentIdx = this.DIRECTIONS.indexOf(this.heading);
    this.heading = this.DIRECTIONS[(currentIdx + 3) % 4];
  }

  rotateR() {
    // function to rotate clockwise
    const currentIdx = this.DIRECTIONS.indexOf(this.heading);
    this.heading = this.DIRECTIONS[(currentIdx + 1) % 4];
  }

  runCommands(
    commands: string,
    invalidPositions: { position: [number, number] }[]
  ) {
    // function which runs the commands based on directions given by the user.
    for (let command of commands) {
      if (!this.isValidCommand(command)) {
        throw new Error(
          `Invalid command '${command}'. Allowed values: L, R, M, B`
        );
      }
      if (this.isFuelLeft()) {
        if (command === "L") {
          this.rotateL();
        } else if (command === "R") {
          this.rotateR();
        } else if (command === "M") {
          this.move(invalidPositions);
        }
        this.fuel -= 1;
      }else{
        //here the fuel is not there.
      }
    }
  }

  getPosition(): string {
    //function to give the position of the particular robot
    return `${this.x} ${this.y} ${this.heading} ${this.getFinalFuel()}`;
  }

  getFinalFuel():string{
    if(this.isFuelLeft()){
      return `${this.fuel} is remaining`
    }else{
      return 'fuel ran out.'
    }
}

  getInvalidPosition(): { position: [number, number] } {
    return {
      position: [this.x, this.y],
    };
  }

  isFuelLeft() {
    if (this.fuel <= 0) {
      return false;
    } else {
      return true;
    }
  }

  isValidPosition(
    robotNextPosition: { position: [number, number] },
    invalidPositions: { position: [number, number] }[]
  ) {
    for (let i = 0; i < invalidPositions.length; i++) {
      const pos = invalidPositions[i];
      if (
        robotNextPosition.position[0] === pos.position[0] &&
        robotNextPosition.position[1] === pos.position[1]
      ) {
        console.log("collision alert");
        return false;
      }
    }
    return true;
  }
}

class Controller {
  // class to manage multiple robots and get their final positions
  private robots: Robot[] = [];
  private invalidPositions: { position: [number, number, string] }[] = [];

  initializeRobots(
    plateau: Plateau,
    robotsInfo: {
      position: [number, number, string];
      commands: string;
      fuelCapacity: number;
    }[]
  ) {
    robotsInfo.forEach((robotInfo) => {
      const [x, y, orientation] = robotInfo.position;
      const fuelCapacity = robotInfo.fuelCapacity;

      try {
        const robot = new Robot(x, y, orientation, fuelCapacity, plateau);
        robot.runCommands(
          robotInfo.commands,
          this.robots.map((robot) => robot.getInvalidPosition())
        );
        this.robots.push(robot);
      } catch (error: any) {
        console.error(error.message);
      }
    });
  }

  getFinalPositionsAndFuel(): string[] { //fix the type
    return this.robots.map((robot) => robot.getPosition());
  }
}

function parseInput(inputData: string): {
  // to parse the input and get the data to be processed.
  plateauSize: [number, number];
  robotsInfo: {
    position: [number, number, string];
    commands: string;
    fuelCapacity: number;
  }[];
} {
  const lines = inputData.trim().split("\n");
  const plateauSize = lines[0].split(" ").map(Number) as [number, number];
  const robotsInfo: {
    position: [number, number, string];
    commands: string;
    fuelCapacity: number;
  }[] = [];

  for (let i = 1; i < lines.length; i += 3) {
    const [x, y, heading] = lines[i].split(" ");
    const position: [number, number, string] = [
      parseInt(x),
      parseInt(y),
      heading,
    ];
    const fuelCapacity = parseInt(lines[i + 1]);
    const commands = lines[i + 2];
    robotsInfo.push({ position, commands, fuelCapacity });
  }

  return { plateauSize, robotsInfo };
}

function main(inputData: string) {
  //start
  const { plateauSize, robotsInfo } = parseInput(inputData);
  const plateau = new Plateau(plateauSize[0], plateauSize[1]);

  const controller = new Controller();
  controller.initializeRobots(plateau, robotsInfo);

  const finalPositions = controller.getFinalPositionsAndFuel();
  finalPositions.forEach((positionAndFuel) => console.log(positionAndFuel));
}

const inputData = `5 5
0 0 N
10
MMRMMMLMM`;

main(inputData);


// 0 3 E
// 8
// LMLMLMLMM
// 1 2 N
// 10
// LMLMLMLMM