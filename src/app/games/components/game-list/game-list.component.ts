import { Component, OnInit, ViewChild } from "@angular/core";
import { GamesService } from "../../services/games.service";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.scss"],
})
export class GameListComponent implements OnInit {
  constructor(
    private gamesService: GamesService) { }

  ngOnInit() {

  }
  ngOnDestroy() {

  }
}