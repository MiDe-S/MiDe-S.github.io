import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ShopItems } from './const/shop-items';
import { LasagaBuyComponent } from './lasaga-buy/lasaga-buy.component';
import { LasagaClickerService } from './lasaga-clicker.service';
import { Subscription, interval } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-lasaga-clicker-2',
  standalone: true,
  imports: [MatButtonModule, LasagaBuyComponent, DecimalPipe, MatCardModule],
  templateUrl: './lasaga-clicker-2.component.html',
  styleUrl: './lasaga-clicker-2.component.scss'
})
export class LasagaClicker2Component implements OnInit, OnDestroy {
  subscription: Subscription;
  shopItems = ShopItems;
  clickValue = 1;

  constructor(public service: LasagaClickerService) {}

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
}
