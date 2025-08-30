import { Injectable } from '@angular/core';
import { ListValue } from './models';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  public gatherIcons(): ListValue[] {
    let images: ListValue[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      if (!sheet.href) {
        try {
          const rules = sheet.cssRules || sheet.rules; // .rules is for IE
          for (const rule of Array.from(rules)) {
            if (rule instanceof CSSStyleRule) {
              if (rule.style.length === 1 && rule.style[0] === 'content') {
                const name = this.parseClassNameFromRegex(rule.selectorText);
                if (name != '') {
                  images.push({ name, value: 'ra ra-' + name });
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
    images.sort((a, b) => a.name.localeCompare(b.name));
    return images;
  }

  private parseClassNameFromRegex(input: string): string {
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
}
