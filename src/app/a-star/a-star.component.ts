import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-a-star",
  templateUrl: "./a-star.component.html",
  styleUrls: ["./a-star.component.css"]
})
export class AStarComponent implements OnInit {
  public button: boolean = false;
  public map: any[][] = [];
  private next: any[][] = [];
  public interval: number = 200; //interval between two steps in millisecond

  public missingA: boolean = false;
  public missingB: boolean = false;

  constructor() {}

  ngOnInit() {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML";
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  public drawMaze(text) {
    this.map = [[]];
    let i = 0;
    let j = 0;
    let maxJ = 0;
    for (let char of text) {
      switch (char) {
        case "\n":
          i++;
          maxJ = Math.max(maxJ, j);
          j = 0;
          this.map.push([]);
          break;
        case "#":
          this.map[i].push("#");
          j++;
          break;
        case ".":
          this.map[i].push(".");
          j++;
          break;
        case "A":
          this.map[i].push("A");
          j++;
          break;
        case "B":
          this.map[i].push("B");
          j++;
          break;
      }
    }
  }

  private getValue(x, y) {
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

  private addIn(openSet, n) {
    let i = 0;
    while (i < openSet.length && n.fscore > openSet[i].fscore) {
      i++;
    }
    openSet.splice(i, 0, n) || openSet.push(n);
    return openSet;
  }

  private aStar() {
    let mapStar = [];
    let start, end;
    let isA = false;
    let isB = false;
    for (let x in this.map) {
      mapStar.push([]);
      for (let y in this.map[x]) {
        mapStar[x].push({
          value: this.getValue(x, y),
          x: x,
          y: y,
          fscore: -1,
          gscore: -1,
          opened: false,
          closed: false,
          parent: null
        });
        if (this.map[x][y] == "A") {
          mapStar[x][y].opened = true;
          start = mapStar[x][y];
          isA = true;
        }
        if (this.map[x][y] == "B") {
          end = mapStar[x][y];
          isB = true;
        }
      }
    }
    this.missingA = !isA;
    this.missingB = !isB;
    if (isA && isB) {
      start.fscore = this.manhattan(start.x, start.y, end.x, end.y);
      start.gscore = 0;
      let openSet = [start];
      this.next = this.map;
      this.loopTransition(mapStar, openSet, start, end);
    }
  }

  private loopTransition(mapStar, openSet, start, end): void {
    const current = openSet[0];
    if (current.x == end.x && current.y == end.y) {
      this.button = false;
      let previous = current.parent;
      while (previous) {
        this.map[previous.x][previous.y] = "p";
        previous = previous.parent;
      }
      this.map[start.x][start.y] = "A";
      this.map[end.x][end.y] = "B";
    } else {
      openSet.splice(0, 1);
      current.closed = true;

      const neighborsSet = this.neighbors(current.x, current.y, mapStar);
      for (let n of neighborsSet) {
        let toAdd = false;
        if (n.closed) {
          continue;
        }
        let tempGScore = current.gscore + n.value;
        if (!n.opened) {
          n.opened = true;
          toAdd = true;
          this.next[n.x][n.y] = "o";
        } else {
          if (n.gscore >= 0 && tempGScore >= n.gscore) {
            continue;
          }
        }
        n.parent = current;
        n.gscore = tempGScore;
        n.fscore = n.gscore + this.manhattan(n.x, n.y, end.x, end.y);
        if (toAdd) {
          openSet = this.addIn(openSet, n);
        }
      }

      this.map = this.next;
      this.next[current.x][current.y] = "v";
      setTimeout(() => {
        if (openSet.length > 0 && this.button) {
          this.loopTransition(mapStar, openSet, start, end);
        } else {
          this.button = false;
        }
      }, this.interval);
    }
  }

  public saveFile(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.onloadend = e => {
        localStorage.setItem("maze", String(reader.result));
        this.drawMaze(String(reader.result));
      };

      reader.readAsText(file);
    }
  }

  public getFile() {
    let maze = localStorage.getItem("maze");
    return maze;
  }

  public getState(i: any): string {
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

  public toggle(): void {
    this.button = !this.button;
    if (!this.button) {
    } else {
      this.drawMaze(this.getFile());
      this.aStar();
    }
  }

  private manhattan(x1, y1, x2, y2) {
    const d1 = Math.abs(x1 - x2);
    const d2 = Math.abs(y1 - y2);
    return d1 + d2;
  }

  private neighbors(x, y, mapStar) {
    let res = [];
    x = Number(x);
    y = Number(y);
    // West
    if (mapStar[x - 1] && mapStar[x - 1][y] && mapStar[x - 1][y].value >= 0) {
      res.push(mapStar[x - 1][y]);
    }
    // East
    if (mapStar[x + 1] && mapStar[x + 1][y] && mapStar[x + 1][y].value >= 0) {
      res.push(mapStar[x + 1][y]);
    }
    // South
    if (mapStar[x] && mapStar[x][y - 1] && mapStar[x][y - 1].value >= 0) {
      res.push(mapStar[x][y - 1]);
    }
    // North
    if (mapStar[x] && mapStar[x][y + 1] && mapStar[x][y + 1].value >= 0) {
      res.push(mapStar[x][y + 1]);
    }
    return res;
  }
}
