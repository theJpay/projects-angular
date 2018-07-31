import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  arrayExample: string[] = [];
  newValue: string = "";

  ngOnInit() {
    this.arrayExample.push("Tableau Initialisé");
  }

  addAString() {
    if (this.newValue !== "") {
      this.arrayExample.push(this.newValue);
      this.newValue = "";
    }
  }
}
