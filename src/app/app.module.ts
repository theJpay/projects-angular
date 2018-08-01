import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ListComponent } from "./list/list.component";

import { RouterModule, Routes } from "@angular/router";

import { KonamiModule } from "ngx-konami";

const appRoutes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "todolist",
    component: ListComponent
  },
  {
    path: "**",
    redirectTo: "home"
  }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, ListComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes), KonamiModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
