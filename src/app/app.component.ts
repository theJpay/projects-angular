import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private godmode: boolean = false;
  public navClass: string = " navbar-light bg-transparent";
  public navStyle: Object = {};
  public appStyle: Object = {};

  public switchMode(): void {
    if (this.godmode) {
      this.godmode = !this.godmode;
      console.log("NormalMode");
      this.navClass = " navbar-light bg-transparent";
      this.navStyle = {};
      this.appStyle = {};
    } else {
      this.godmode = !this.godmode;
      console.log("GodMode");
      console.log(document);
      this.navClass = " navbar-dark";
      this.navStyle = {
        "background-color": "#0E2748"
      };
      this.appStyle = {
        height: "100vh",
        "background-image":
          "url(https://blog.headway-advisory.com/wp-content/uploads/2017/09/Poitou-Arnaud-Directeur-Centrale-Nantes-2.jpg)",
        "background-repeat": "no-repeat",
        "background-position": "center center",
        "background-attachment": "fixed",
        "background-size": "cover",
        color: "#DBA005"
      };
    }
  }
}
