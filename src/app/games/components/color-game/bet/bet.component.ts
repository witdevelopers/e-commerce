import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AddBetComponent } from '../add-bet-dialog/add-bet.component';
import { PeriodWinModalComponent } from '../period-win-dialog/period-win-modal.component';
import { GamesService } from 'src/app/games/services/games.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {

  periodWinDialogRef: MatDialogRef<PeriodWinModalComponent>
  addBetDialogRef: MatDialogRef<AddBetComponent>
  disableBet: string = ''
  // isLoading:boolean=false
  constructor(private game: GamesService, private dialog: MatDialog, public auth: AuthService) {

  }

  private subscription: Subscription;
  period: string

  public timeDifference: number;
  public secRemains: number;
  public minRemains: number;

  @Output() updateEvent = new EventEmitter();
  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


  private intitiateTimer(timeDifference: number) {
    this.secRemains = Math.floor((timeDifference) % 60);
    this.minRemains = Math.floor((timeDifference) / 60);

    if (this.minRemains == 0 && this.secRemains <= 30) {
      if (this.addBetDialogRef?.getState() == MatDialogState.OPEN)
        this.addBetDialogRef?.close({ event: 'Close' })
      if (this.disableBet == '')
        this.disableBet = 'disable-bet'
    }
    else {
      if (this.disableBet == 'disable-bet')
        this.disableBet = ''
    }

    if (this.minRemains == 0 && this.secRemains == 0) {
      setTimeout(() => {
        this.getPeriodResult()
        this.refresh();
        this.updateEvent.emit();
      }, 2000);

    }
  }

  refresh() {
    // this.isLoading=true;
    if (this.subscription)
      this.subscription.unsubscribe();

    this.game.current().subscribe(resp => {
      this.period = resp.period
      this.timeDifference = resp.secRemainings;
      this.subscription = interval(1000)
        .subscribe(x => {
          if (this.timeDifference >= 0) {
            this.intitiateTimer(this.timeDifference);
            this.timeDifference = this.timeDifference - 1;
            // this.isLoading=false;
          }
        });
    })
  }

  getPeriodResult() {
    this.periodWinDialogRef?.close()
    this.game.getPeriodDetails(this.period)
      .subscribe((rs: any) => {
        if (rs) {
          this.periodWinDialogRef = this.dialog.open(PeriodWinModalComponent,
            {
              autoFocus: false,
              width: '70%', data: rs, panelClass: 'addBet-dialog-container'
            });
        }
      })
  }


  onBet(e: Event, type: string) {
    if (e.target) {
      let elem = e.target as HTMLElement;
      if (elem) {
        let val: String
        if (!['button', 'span'].filter((str) => str.toLowerCase()).includes(elem.nodeName.toLowerCase())) {
          return;
        }

        if (elem.nodeName.toLowerCase() == 'button') {
          let btn = elem as HTMLButtonElement
          val = btn.value
        }
        else if (elem.nodeName.toLowerCase() == 'span' && elem.parentElement.nodeName.toLowerCase() == 'button') {
          let btn = elem.parentElement as HTMLButtonElement
          val = btn.value
        }
        else {
          return;
        }




        if (this.minRemains == 0 && this.secRemains < 30) {
          Swal.fire({
            icon: "error",
            title: "Can't bet in this period. Timeout!"
          })
          return;
        }

        this.addBetDialogRef = this.dialog.open(AddBetComponent,
          {
            width: '70%', data: {val,type:'color-game'}, panelClass: 'addBet-dialog-container'
          });
        this.addBetDialogRef.afterClosed().subscribe(result => {
          if (result && result.type=='color-game' &&  result.event == 'Submit') {
            this.game.addOrder(result.data)
              .subscribe(resp => {
                if (resp.status) {
                  Swal.fire({
                    icon: "success",
                    title: resp.message
                  })

                }
                else {
                  Swal.fire({
                    icon: "error",
                    title: resp.message
                  })
                }
              })
            this.updateEvent.emit();
          }
        });

      }
    }
  }

}
