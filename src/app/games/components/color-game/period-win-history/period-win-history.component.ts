import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GamesService } from 'src/app/games/services/games.service';
import { periodWinResponse } from 'src/app/games/models/bet.model';
import { PaginationEvent } from 'src/app/models/pagination-event';

@Component({
  selector: 'app-period-win-history',
  templateUrl: './period-win-history.component.html',
  styleUrls: ['./period-win-history.component.css']
})
export class PeriodWinHistoryComponent implements OnInit {

  constructor(private game: GamesService,) { }

  pageNo: number = 1
  pageSize: number = 10
  periodHistory: periodWinResponse = new periodWinResponse();

  ngOnInit(): void {

  }

  bindHistory() {
    this.game.periodWinHistory(this.pageNo, this.pageSize)
      .subscribe(resp => {
        this.periodHistory.data = resp.data;
        this.periodHistory.total = resp.total;
      })
  }

  onPageChange(e) {
    this.pageSize = e.pageSize
    this.pageNo = e.pageIndex+1
    this.bindHistory()

  }

  getColor(colorName: string) {
    return colorName
  }

}
