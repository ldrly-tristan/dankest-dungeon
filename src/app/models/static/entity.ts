export interface Entity {
  id: string;

  name: string;

  renderable: {
    ch: string;
    fg: string;
    bg?: string;
  };
}
