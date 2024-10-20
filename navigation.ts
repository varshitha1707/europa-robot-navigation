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
  private readonly DIRECTIONS: string[] = ["N", "E", "S", "W"];

  constructor(x: number, y: number, heading: string, plateau: Plateau) {
    this.x = x;
    this.y = y;
    this.heading = heading;
    this.plateau = plateau;
  }

  move() {
    // function for movement based on direction
    if (
      this.heading === "N" &&
      this.plateau.isWithinBounds(this.x, this.y + 1)
    ) {
      this.y += 1;
    } else if (
      this.heading === "E" &&
      this.plateau.isWithinBounds(this.x + 1, this.y)
    ) {
      this.x += 1;
    } else if (
      this.heading === "S" &&
      this.plateau.isWithinBounds(this.x, this.y - 1)
    ) {
      this.y -= 1;
    } else if (
      this.heading === "W" &&
      this.plateau.isWithinBounds(this.x - 1, this.y)
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

  runCommands(commands: string) {
    // function which runs the commands based on directions given by the user.
    for (let command of commands) {
      if (command === "L") {
        this.rotateL();
      } else if (command === "R") {
        this.rotateR();
      } else if (command === "M") {
        this.move();
      }
    }
  }

  getPosition(): string {
    //function to give the position of the particular robot
    return `${this.x} ${this.y} ${this.heading}`;
  }
}

class Controller {
  // class to manage multiple robots and get their final positions
  private robots: Robot[] = [];

  initializeRobots(
    plateau: Plateau,
    robotsInfo: { position: [number, number, string]; commands: string }[]
  ) {
    robotsInfo.forEach((robotInfo) => {
      const [x, y, orientation] = robotInfo.position;
      const robot = new Robot(x, y, orientation, plateau);
      robot.runCommands(robotInfo.commands);
      this.robots.push(robot);
    });
  }

  getFinalPositions(): string[] {
    return this.robots.map((robot) => robot.getPosition());
  }
}

function parseInput(inputData: string): {
  // to parse the input and get the data to be processed.
  plateauSize: [number, number];
  robotsInfo: { position: [number, number, string]; commands: string }[];
} {
  const lines = inputData.trim().split("\n");
  const plateauSize = lines[0].split(" ").map(Number) as [number, number];
  const robotsInfo: { position: [number, number, string]; commands: string }[] =
    [];

  for (let i = 1; i < lines.length; i += 2) {
    const [x, y, heading] = lines[i].split(" ");
    const position: [number, number, string] = [
      parseInt(x),
      parseInt(y),
      heading,
    ];
    const commands = lines[i + 1];
    robotsInfo.push({ position, commands });
  }

  return { plateauSize, robotsInfo };
}

function main(inputData: string) {
  //start
  const { plateauSize, robotsInfo } = parseInput(inputData);
  const plateau = new Plateau(plateauSize[0], plateauSize[1]);

  const controller = new Controller();
  controller.initializeRobots(plateau, robotsInfo);

  const finalPositions = controller.getFinalPositions();
  finalPositions.forEach((position) => console.log(position));
}

const inputData = `5 5
6 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM
4 6 E
LMRRMMRLRM`;

main(inputData);
