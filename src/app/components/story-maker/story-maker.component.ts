import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Icon, Page } from './icon';

@Component({
  selector: 'app-story-maker',
  templateUrl: './story-maker.component.html',
  styleUrls: ['./story-maker.component.scss'],
  imports: [
    DragDropModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class StoryMakerComponent implements OnInit {
  pages: Page[] = [[]];
  images: string[] = [];
  iconControl: FormControl<string | null> = new FormControl(null);
  nameControl: FormControl<string | null> = new FormControl(null);
  page: number = 0;

  get currentPageIcons(): Icon[] {
    return this.pages[this.page];
  }

  ngOnInit() {
    const saved = localStorage.getItem('iconPositions');
    if (saved) {
      this.pages = JSON.parse(saved);
    }
    this.gatherIcons();
  }

  insertPage() {
    this.pages.splice(this.page + 1, 0, []);
  }

  addIconToPage() {
    if (this.iconControl.value && this.nameControl.value) {
      this.currentPageIcons.push({
        class: 'ra ra-' + this.iconControl.value,
        name: this.nameControl.value,
        id: this.pages.length + 1,
        x: 100,
        y: 100,
      });
    }
  }

  gatherIcons() {
    for (const sheet of Array.from(document.styleSheets)) {
      if (!sheet.href) {
        try {
          const rules = sheet.cssRules || sheet.rules; // .rules is for IE
          for (const rule of Array.from(rules)) {
            if (rule instanceof CSSStyleRule) {
              if (rule.style.length === 1 && rule.style[0] === 'content') {
                const name = this.parseClassNameFromRegex(rule.selectorText);
                if (name != '') {
                  this.images.push(name);
                }
              }
            }
          }
        } catch (e) {
          // This can happen if the stylesheet is from a different origin (CORS issue)
          console.warn('Cannot access stylesheet:', sheet.href);
        }
      }
    }
  }

  onDragEnd(event: CdkDragEnd, icon: any) {
    const pos = event.source.getFreeDragPosition();
    icon.x = pos.x;
    icon.y = pos.y;
    console.log(`Icon ${icon.id} dropped at:`, pos);
  }

  savePositions() {
    localStorage.setItem('iconPositions', JSON.stringify(this.pages));
    alert('Saved!');
  }

  parseClassNameFromRegex(input: string): string {
    const prefix = '.ra-';
    const start = input.indexOf(prefix);

    if (start !== -1) {
      const end = input.indexOf('[', start);
      if (end !== -1) {
        return input.slice(start + prefix.length, end);
      }
    }
    console.warn('Could not parse', input);
    return '';
  }

  right(): void {
    this.page++;
  }

  left(): void {
    this.page--;
  }
}
