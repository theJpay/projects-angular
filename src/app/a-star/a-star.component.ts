//Import things usefull such as the type MapStarElement and Angular tools
import { Component, OnInit } from "@angular/core";
import { MapStarElement } from "../../models/MapStarElement";

//Description of the component
@Component({
  selector: "app-a-star",
  templateUrl: "./a-star.component.html",
  styleUrls: ["./a-star.component.css"]
})

//Declare that the component will be exported
export class AStarComponent implements OnInit {
  //////////     Code of the component     //////////

  // Properties
  public button: boolean = false;
  public map: string[][] = [];
  public interval: number = 200; //interval between two steps in millisecond

  public missingA: boolean = false;
  public missingB: boolean = false;

  ////// Angular logic //////
  constructor() {}

  ngOnInit() {}
  ///////////////////////////

  // Methods

  private addIn(
    openSet: MapStarElement[],
    n: MapStarElement
  ): MapStarElement[] {
    // Add a MapStarElement to the openSet while making sure that the list is still orderd by fscore
    let i = 0;
    while (i < openSet.length && n.fscore > openSet[i].fscore) {
      i++;
    }
    openSet.splice(i, 0, n) || openSet.push(n);
    return openSet;
  }

  private aStar(): void {
    // Initialization of the A* algorithm, the while loop is in the loopTransition function
    let mapStar = [];
    let start, end;
    let isA = false;
    let isB = false;

    // Initialization of the mapStar Array that will store all the infos (value, fscore, gscore, parent and state of node)
    for (let x in this.map) {
      mapStar.push([]);
      for (let y in this.map[x]) {
        mapStar[x].push({
          value: this.getValue(x, y),
          x: Number(x),
          y: Number(y),
          fscore: -1,
          gscore: -1,
          opened: false,
          closed: false,
          parent: null
        });
        // Get the start
        if (this.map[x][y] == "A") {
          mapStar[x][y].opened = true;
          start = mapStar[x][y];
          isA = true;
        }
        // Get the goal
        if (this.map[x][y] == "B") {
          end = mapStar[x][y];
          isB = true;
        }
      }
    }
    // In case their isn't any start and/or goal
    this.missingA = !isA;
    this.missingB = !isB;
    if (isA && isB) {
      start.fscore = this.manhattan(start.x, start.y, end.x, end.y);
      start.gscore = 0;
      let openSet = [start];
      this.loopTransition(mapStar, openSet, start, end);
    }
  }

  public drawMaze(text: string): void {
    // Get the map Array from the text file 
    let i = 0;
    this.map = [[]];
    for (let char of text) {
      switch (char) {
        case "\n":
          this.map.push([]);
          i++;
          break;
        default:
          this.map[i].push(char);
      }
    }
  }

  public getFile(): string {
    // Recover the last file from the local storage if no file is entered
    let maze = localStorage.getItem("Maze");
    return maze;
  }

  public getState(i: string): string {
    // Allow the client to use the right CSS class (color of the cell)
    switch (i) {
      case "#":
        return "wall";
      case "A":
        return "start";
      case "B":
        return "end";
      case "p":
        return "path";
      case "v":
        return "visited";
      case "o":
        return "opened";
      default:
        return "";
    }
  }

  private getValue(x: string, y: string): number {
    // Define the cost of each type of cell 
    switch (this.map[x][y]) {
      case ".":
        return 1;
      case "#":
        return -1;
      case "B":
        return 1;
      default:
        return 0;
    }
  }

  private loopTransition(
    mapStar: MapStarElement[][],
    openSet: MapStarElement[],
    start: MapStarElement,
    end: MapStarElement
  ): void {
    // While loop of the A* algorithm

    // Take the cell in the openSet that has the lowest fscore (openSet is ordered by fscore)
    const current = openSet[0];

    // If the current cell is the goal
    if (current.x == end.x && current.y == end.y) {
      this.button = false;
      let previous = current.parent;
      // We get the path from start to goal
      while (previous) {
        this.map[previous.x][previous.y] = "p";
        previous = previous.parent;
      }
      this.map[start.x][start.y] = "A";
      this.map[end.x][end.y] = "B";
    // If the current cell isn't the goal
    } else {
      // We take out the current cell from the openSet
      openSet.splice(0, 1);
      // And we close the current cell
      current.closed = true;

      // We get the neighbors
      const neighborsSet = this.neighbors(current.x, current.y, mapStar);
      
      // For each neighbor
      for (let n of neighborsSet) {
        let toAdd = false;
        // If this neighbor is already closed we skip it
        if (n.closed) {
          continue; // Goes to the next iteration of the for loop
        }
        // Temporary gscore from the current cell
        let tempGScore = current.gscore + n.value;

        // If the cell isn't already opened
        if (!n.opened) {
          // We open it
          n.opened = true;
          toAdd = true;
          this.map[n.x][n.y] = "o";
        // If the cell is oppened we check if the new gscore is better than the previous one 
        } else {
          // If the new gscore isn't better we skip the rest
          if (n.gscore >= 0 && tempGScore >= n.gscore) {
            continue;
          }
        }

        // Calculate the fscrore and update the parent and the gscore
        n.parent = current;
        n.gscore = tempGScore;
        n.fscore = n.gscore + this.manhattan(n.x, n.y, end.x, end.y);

        // Add the neighbor to the openSet if needed
        if (toAdd) {
          openSet = this.addIn(openSet, n);
        }
      }
      this.map[current.x][current.y] = "v";
      setTimeout(() => {
        // Continue the while loop if the openSet isn't empty
        if (openSet.length > 0 && this.button) {
          this.loopTransition(mapStar, openSet, start, end);
        } else {
          this.button = false;
        }
      }, this.interval);
    }
  }

  // Heuristic used is the manhattan distance
  private manhattan(x1: number, y1: number, x2: number, y2: number): number {
    const d1 = Math.abs(x1 - x2);
    const d2 = Math.abs(y1 - y2);
    return d1 + d2;
  }

  // Function to get the neighbors of a cell
  private neighbors(
    x: number,
    y: number,
    mapStar: MapStarElement[][]
  ): MapStarElement[] {
    let res = [];
    // North
    if (mapStar[x - 1] && mapStar[x - 1][y] && mapStar[x - 1][y].value >= 0) {
      res.push(mapStar[x - 1][y]);
    }
    // South
    if (mapStar[x + 1] && mapStar[x + 1][y] && mapStar[x + 1][y].value >= 0) {
      res.push(mapStar[x + 1][y]);
    }
    // West
    if (mapStar[x] && mapStar[x][y - 1] && mapStar[x][y - 1].value >= 0) {
      res.push(mapStar[x][y - 1]);
    }
    // East
    if (mapStar[x] && mapStar[x][y + 1] && mapStar[x][y + 1].value >= 0) {
      res.push(mapStar[x][y + 1]);
    }
    return res;
  }

  // Save the last .txt file in the local storage to be able to reset
  public saveFile(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.onloadend = e => {
        localStorage.setItem("Maze", String(reader.result));
        this.drawMaze(String(reader.result));
      };

      reader.readAsText(file);
    }
  }

  // Function triggered by the button on the web page
  public toggle(): void {
    this.button = !this.button;
    if (!this.button) {
    } else {
      this.drawMaze(this.getFile());
      this.aStar();
    }
  }
}
