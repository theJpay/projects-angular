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
  public x: number = 50;
  public y: number = 50;
  public interval: number = 1000; //interval between two steps in millisecond

  constructor() {}

  ngOnInit() {}

  private getRandom(): number {
    return Math.random();
  }

  private getRandomRange(min, max): number {
    if (max > min) {
      return min + Math.random()*(max-min);
    }
    else {
      return this.getRandomRange(max, min);
    }
  }

  public getState(i: number) {
    switch (i) {
      case 0:
        return "ground";
      case 1:
        return "tree";
      case 2:
        return "fire";
      case 3:
        return "burned";
    }
  }

  private init() {
    this.map = [];
    let frame;
    if (this.x <= 0) this.x = 1;
    if (this.x > 250) this.x = 250;
    if (this.y <= 0) this.y = 1;
    if (this.y > 250) this.y = 250;
    if (this.interval < 100) this.interval = 100;
    for (let i = 0; i < this.y; i++) {
      this.map.push([]);
      for (let j = 0; j < this.x; j++) {
        if (this.getRandom() > 0.9) {
          frame = 1;
        } else {
          frame = 0;
        }
        this.map[i].push(frame);
      }
    }
  }

  private loopTransition() {
    for (let row of this.map) {
      for (let i in row) {
        row[i] = parseInt(this.getRandomRange(0,4).toString());
      }
    }
    setTimeout(() => {
      if (this.started) {
        this.loopTransition();
      }
    }, this.interval);
  }

  public start() {
    this.init();
    this.started = true;
    this.loopTransition();
  }

  public toggle() {
    this.button = !this.button;
    if (!this.button) {
      this.started = false;
    } else {
      this.start();
    }
  }
}
