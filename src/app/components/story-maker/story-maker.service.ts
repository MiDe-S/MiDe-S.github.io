import { Injectable } from '@angular/core';
import { Character, Page, SaveData } from './models';

@Injectable({
  providedIn: 'root',
})
export class StoryMakerService {
  public currentPageIndex: number = 0;
  private data: SaveData = {
    width: '1500px',
    height: '844px',
    mapFile: '',
    pages: [{ timestamp: '', characters: {} }],
    characters: [],
  };

  get characters(): Character[] {
    return this.data.characters;
  }

  get currentPage(): Page {
    return this.data.pages[this.currentPageIndex];
  }

  get pageCount(): number {
    return this.data.pages.length;
  }

  get mapFile(): string {
    return this.data.mapFile;
  }

  set mapFile(file: string) {
    this.data.mapFile = file;
  }

  get height(): string {
    return this.data.height;
  }

  get width(): string {
    return this.data.width;
  }

  public findCharacterByName(name: string): Character {
    return this.characters.find((char) => char.name === name) as Character;
  }

  public createCharacter(character: Character): void {
    this.data.characters.push(character);
  }

  public addCharacterToPage(name: string): void {
    this.currentPage.characters[name] = {
      x: 250,
      y: 250,
    };
  }

  public removeCharacterFromPage(name: string): void {
    delete this.currentPage.characters[name];
  }

  public insertPage() {
    this.data.pages.splice(this.currentPageIndex + 1, 0, {
      characters: JSON.parse(JSON.stringify(this.currentPage.characters)),
      timestamp: '',
    });
  }

  public save() {
    localStorage.setItem('iconPositions', JSON.stringify(this.data));
  }
  public load() {
    const saved = localStorage.getItem('iconPositions');
    if (saved) {
      this.data = JSON.parse(saved);
    }
  }

  public exportData(): void {
    const dataStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'pageCharacters.json';
    a.click();

    window.URL.revokeObjectURL(url); // Clean up
  }

  // Import JSON file and load into variable
  public importData(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        this.data = json;
        this.save();
      } catch (error) {
        console.error('Invalid JSON file:', error);
      }
    };

    reader.readAsText(file);
  }
}
