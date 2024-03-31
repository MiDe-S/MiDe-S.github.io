import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ShopItems } from './const/shop-items';
import { LasagaBuyComponent } from './lasaga-buy/lasaga-buy.component';
import { LasagaClickerService } from './lasaga-clicker.service';
import { Subscription, interval } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-lasaga-clicker-2',
  standalone: true,
  imports: [MatButtonModule, LasagaBuyComponent, DecimalPipe, MatCardModule, MatDialogModule],
  templateUrl: './lasaga-clicker-2.component.html',
  styleUrl: './lasaga-clicker-2.component.scss'
})
export class LasagaClicker2Component implements OnInit, OnDestroy {
  subscription: Subscription;
  shopItems = ShopItems;
  clickValue = 1;

  constructor(public service: LasagaClickerService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    const ms = 100;
    this.subscription = interval(ms).subscribe(() => {
      this.service.updateWinCount(ms);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  buttonClicked() {
    this.service.saveLocal();
    this.service.addToWins(this.clickValue + this.service.wps() / 10);
  }

  handleBuy(itemName: string) {
    this.service.handleBuy(itemName);
  }

  resetGame() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: 'Are you sure you want to reset?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.clearGame();
      }
    });
  }
}
