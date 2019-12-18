export interface Entity {
  id: string;

  name: string;

  glyph: {
    ch: string;
    fg: string;
    bg?: string;
  };
}
