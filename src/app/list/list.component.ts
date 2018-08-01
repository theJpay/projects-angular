import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
  todosArray: string[] = [];
  newValue: string = "";

  ngOnInit() {
    this.todosArray = this.getTodos();
  }

  public addAString(): void {
    if (this.newValue !== "") {
      this.todosArray.push(this.newValue);
      this.setLocalArrayTodos(this.todosArray);
      this.newValue = "";
    }
  }

  public dellAString(i: number): void {
    this.todosArray.splice(i, 1);
    this.setLocalArrayTodos(this.todosArray);
  }

  private getTodos(): string[] {
    let localArray = JSON.parse(localStorage.getItem("todosAngular"));
    return localArray ? localArray.todos : [];
  }

  private setLocalArrayTodos(todos: string[]): void {
    localStorage.setItem("todosAngular", JSON.stringify({ todos: todos }));
  }
}
