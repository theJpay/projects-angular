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
  public interval: number = 1000; //interval between two steps in millisecond

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
          Math.random() < 0.05 + 0.03 * tree_neighbors
        ) {
          // Terre devient Arbre
          this.next[x][y] = 1;
        }
        if (
          this.map[x][y] == 1 &&
          Math.random() < 0.0005 + 0.03 * fire_neighbors
        ) {
          // Arbre devient Feu
          this.next[x][y] = 2;
        }
        if (this.map[x][y] == 2 && Math.random() < 0.05) {
          // Feu devient Terre brûlée
          this.next[x][y] = 3;
        }
        if (this.map[x][y] == 3 && Math.random() < 0.005) {
          // Terre brûlée devient Terre
          this.next[x][y] = 0;
        }
      }
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
