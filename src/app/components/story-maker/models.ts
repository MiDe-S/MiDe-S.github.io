export interface Character {
  iconClass: string;
  name: string;
}

export interface Icon {
  x: number;
  y: number;
}

export type Page = {
  timestamp: string;
  characters: {
    [key: string]: Icon;
  };
};

export interface SaveData {
  width: string;
  height: string;
  mapFile: string;
  pages: Page[];
  characters: Character[];
}

export interface ListValue {
  name: string;
  value: string;
}
