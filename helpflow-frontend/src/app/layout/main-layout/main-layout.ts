import { Component } from "@angular/core";
import { Footer } from "../../shared/footer/footer";
import { Sidebar } from "../../shared/sidebar/sidebar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-main-layout",
  imports: [Sidebar, Footer, RouterOutlet],
  templateUrl: "./main-layout.html",
  styleUrl: "./main-layout.css",
})
export class MainLayout {}
