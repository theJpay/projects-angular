import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-forest-fire",
  templateUrl: "./forest-fire.component.html",
  styleUrls: ["./forest-fire.component.css"]
})
export class ForestFireComponent implements OnInit {
  public button: boolean = false;
  public started: boolean = false;
  public map: number[][] = [];
  private next: number[][] = [];
  public x: number = 50;
  public y: number = 50;
  public interval: number = 100; //interval between two steps in millisecond

  // Probas
  public PBasetree: number = 0.015;
  public Ptree: number = 0.08;
  public PBasefire: number = 0;
  public Pfire: number = 0.08;
  public Pash: number = 0.08;
  public Pground: number = 0.01;
  //

  private declareFire: any = {
    test: false,
    i: 0,
    j: 0
  };

  constructor() {}

  ngOnInit() {}

  private getRandom(): number {
    return Math.random();
  }

  private getRandomRange(min: number, max: number): number {
    if (max > min) {
      return min + Math.random() * (max - min);
    } else {
      return this.getRandomRange(max, min);
    }
  }

  public getState(i: number): string {
    switch (i) {
      case 0:
        return "ground";
      case 1:
        return "tree";
      case 2:
        return "fire";
      case 3:
        return "burned";
      default:
        return "";
    }
  }

  private init(): void {
    this.map = [];
    this.next = [];
    let frame;
    if (this.x <= 0) this.x = 1;
    if (this.x > 250) this.x = 250;
    if (this.y <= 0) this.y = 1;
    if (this.y > 250) this.y = 250;
    if (this.interval < 100) this.interval = 100;
    for (let i = 0; i < this.y + 2; i++) {
      this.map.push([]);
      this.next.push([]);
      for (let j = 0; j < this.x + 2; j++) {
        if (this.getRandom() < 0.5) {
          frame = 1;
        } else {
          frame = 0;
        }
        this.map[i].push(frame);
        this.next[i].push(0);
      }
    }
  }

  public makeFire(i, j) {
    this.declareFire = {
      test: true,
      i: i,
      j: j
    };
  }

  private loopTransition(): void {
    for (let x = 1; x < this.x + 1; x++) {
      for (let y = 1; y < this.y + 1; y++) {
        let tree_neighbors = 0;
        let fire_neighbors = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (this.map[x + i][y + j] == 1) {
              tree_neighbors += 1;
            }
            if (this.map[x + i][y + j] == 2) {
              fire_neighbors += 1;
            }
          }
        }
        if (
          this.map[x][y] == 0 &&
          Math.random() < this.PBasetree + this.Ptree * tree_neighbors
        ) {
          // Terre devient Arbre
          this.next[x][y] = 1;
        }
        if (
          this.map[x][y] == 1 &&
          Math.random() < this.PBasefire + this.Pfire * fire_neighbors
        ) {
          // Arbre devient Feu
          this.next[x][y] = 2;
        }
        if (this.map[x][y] == 2 && Math.random() < this.Pash) {
          // Feu devient Terre brûlée
          this.next[x][y] = 3;
        }
        if (this.map[x][y] == 3 && Math.random() < this.Pground) {
          // Terre brûlée devient Terre
          this.next[x][y] = 0;
        }
      }
    }
    if (this.declareFire.test) {
      this.map[this.declareFire.i][this.declareFire.j] = 2;
      this.declareFire.test = false;
    }
    this.map = this.next;
    setTimeout(() => {
      if (this.started) {
        this.loopTransition();
      }
    }, this.interval);
  }

  public pause(): void {
    this.started = !this.started;
    if (this.started) {
      this.loopTransition();
    }
  }

  public start(): void {
    this.init();
    this.started = true;
    this.loopTransition();
  }

  public toggle(): void {
    this.button = !this.button;
    if (!this.button) {
      this.map = [];
      this.started = false;
    } else {
      this.start();
    }
  }
}
