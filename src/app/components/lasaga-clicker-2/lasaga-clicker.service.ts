import { Injectable, signal } from '@angular/core';
import { ShopItems } from './const/shop-items';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShopItem } from './models/shop-item';
import { SaveData } from './models/save-data';

@Injectable({
  providedIn: 'root'
})
export class LasagaClickerService {
  wins = signal(0);
  total_wins = signal(0);
  wps = signal(0);
  itemDict: any = {};
  shopItems = ShopItems;
  constructor(private _snackBar: MatSnackBar) { this.init() }

  init(): void {
    this.loadLocal();
    for (let item of this.shopItems) {
      if (!this.itemDict.hasOwnProperty(item.name)) {
        this.itemDict[item.name] = 0;
      }
    }
  }

  handleBuy(itemName: string) {
    this.saveLocal();
    const item: ShopItem = this.shopItems.find(item => item.name === itemName)!;
    if (this.wins() >= item.cost) {
      this.wins.set(this.wins() - item.cost);
      this.itemDict[item.name] += 1;
      this.updateWps();
    }
    else {
      this._snackBar.open('Need more wins', '', {
        duration: 2000
      });
    }
  }

  updateWinCount(interval: number) {
    const MS_IN_SEC: number = 1000;
    this.addToWins(interval / MS_IN_SEC * this.wps());
  }

  private updateWps() {
    let total: number = 0;
    for (let item of this.shopItems) {
      total += this.itemDict[item.name] * item.mult;
    }
    this.wps.set(total);
  }

  addToWins(amount: number) {
    this.wins.set(this.wins() + amount);
    this.total_wins.set(this.total_wins() + amount);
  }

  getCount(name: string) {
    return this.itemDict[name];
  }

  // Set a value in local storage
  saveLocal(): void {
    const saveData: SaveData = new SaveData(this.wins(), this.total_wins(), this.wps(), this.itemDict);
    localStorage.setItem("LASAGACLICKER", JSON.stringify(saveData));
  }

  // Get a value from local storage
  loadLocal() {
    const saveDataString = localStorage.getItem("LASAGACLICKER");
    if (saveDataString != null) { 
      const saveData = JSON.parse(saveDataString);
      this.wins.set(saveData.wins);
      this.total_wins.set(saveData.total_wins);
      this.wps.set(saveData.wps);
      this.itemDict = saveData.itemDict;
    }
  }
}
