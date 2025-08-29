export interface Icon {
  class: string;
  name: string;
  x: number;
  y: number;
  id: number;
}

export interface Character {
  iconClass: string;
  name: string;
}

export type Page = Icon[];

export interface IconV2 {
  x: number;
  y: number;
  id: number;
}

export type PageV2 = { [key: string]: Icon };

export interface SaveData {
  mapFile: string;
  pages: PageV2[];
  characters: Character[];
}
