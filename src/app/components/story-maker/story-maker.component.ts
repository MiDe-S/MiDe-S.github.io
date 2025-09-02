import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconService } from './icon.service';
import { Character, Icon, ListValue } from './models';
import { StoryMakerService } from './story-maker.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-story-maker',
  templateUrl: './story-maker.component.html',
  styleUrls: ['./story-maker.component.scss'],
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class StoryMakerComponent implements OnInit {
  protected readonly storyMakerService: StoryMakerService =
    inject(StoryMakerService);
  private readonly iconService: IconService = inject(IconService);
  images: ListValue[];
  iconControl: FormControl<string | null> = new FormControl(null);
  nameControl: FormControl<string | null> = new FormControl(null);
  pageNameControl: FormControl<string | null> = new FormControl(null);

  set currentPageName(input: string) {
    this.storyMakerService.currentPage.timestamp = input;
  }

  get currentPageName(): string {
    return this.storyMakerService.currentPage.timestamp;
  }

  get keys(): string[] {
    const a = Object.keys(this.storyMakerService.currentPage.characters);
    console.log(a);
    return a;
  }

  get mapFile(): string {
    return `url('${this.storyMakerService.mapFile}')`;
  }

  get pageCharacters(): {
    [key: string]: Icon;
  } {
    return this.storyMakerService.currentPage.characters;
  }

  get remainingCharacters(): Character[] {
    return this.storyMakerService.characters.filter(
      (char) => !this.storyMakerService.currentPage.characters[char.name]
    );
  }

  get height(): string {
    return this.storyMakerService.height;
  }

  get width(): string {
    return this.storyMakerService.width;
  }

  onIconRightClick(event: MouseEvent, name: string): void {
    event.preventDefault(); // prevent the default context menu
    this.storyMakerService.removeCharacterFromPage(name); // call your delete method
  }

  onIconLeftClick(name: string): void {
    this.storyMakerService.addCharacterToPage(name);
  }

  getCharacter(name: string): Character {
    return this.storyMakerService.findCharacterByName(name);
  }

  ngOnInit() {
    this.images = this.iconService.gatherIcons();
    this.storyMakerService.load();
  }

  insertPage() {
    this.storyMakerService.insertPage();
  }

  addIconToPage() {
    if (this.iconControl.value && this.nameControl.value) {
      if (this.storyMakerService.findCharacterByName(this.nameControl.value)) {
        alert('Name already used');
        return;
      }
      const character: Character = {
        iconClass: this.iconControl.value,
        name: this.nameControl.value,
      };
      this.storyMakerService.createCharacter(character);
      this.storyMakerService.addCharacterToPage(character.name);
      this.iconControl.setValue(null);
      this.nameControl.setValue(null);
    }
  }

  onDragEnd(event: CdkDragEnd, icon: any) {
    const pos = event.source.getFreeDragPosition();
    icon.x = pos.x;
    icon.y = pos.y;
  }

  savePositions() {
    this.storyMakerService.save();
    alert('Saved!');
  }

  right(): void {
    this.storyMakerService.currentPageIndex++;
  }

  left(): void {
    this.storyMakerService.currentPageIndex--;
  }

  exportData(): void {
    this.storyMakerService.exportData();
  }

  importData(event: Event): void {
    this.storyMakerService.importData(event);
  }

  uploadImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      console.log(reader.result);
      this.storyMakerService.mapFile = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
