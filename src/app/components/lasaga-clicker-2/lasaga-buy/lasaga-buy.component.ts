import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ShopItem } from '../models/shop-item';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-lasaga-buy',
  standalone: true,
  imports: [MatButton, MatCardModule, MatTooltip, MatIcon],
  templateUrl: './lasaga-buy.component.html',
  styleUrl: './lasaga-buy.component.scss'
})
export class LasagaBuyComponent {
  @Input() item: ShopItem;
  @Input() count: number;
  @Input() hidden: boolean;
  @Output() bought = new EventEmitter<string>();
  amountOf: number[] = []

  buy() {
    this.bought.emit(this.item.name);
  }

  counter(amount: number) {
    return [...Array(amount).keys()];
  }
}
