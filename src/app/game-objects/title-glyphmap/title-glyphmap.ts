import { Glyphmap } from '../glyphmap';

/**
 * Title glyphmap.
 */
export class TitleGlyphmap extends Glyphmap {
  /**
   * Title data.
   */
  protected static title = [
    `                     .                          `,
    `                     M                          `,
    `                    dM                          `,
    `                    MMr                         `,
    `                   4MMML                  .     `,
    `                   MMMMM.                xf     `,
    `   .              "MMMMM               .MM-     `,
    `    Mh..          +MMMMMM            .MMMM      `,
    `    .MMM.         .MMMMML.          MMMMMh      `,
    `     )MMMh.        MMMMMM         MMMMMMM       `,
    `      3MMMMx.     'MMMMMMf      xnMMMMMM"       `,
    `      '*MMMMM      MMMMMM.     nMMMMMMP"        `,
    `        *MMMMMx    "MMMMM\    .MMMMMMM=         `,
    `         *MMMMMh   "MMMMM"   JMMMMMMP           `,
    `           MMMMMM   3MMMM.  dMMMMMM            .`,
    `            MMMMMM  "MMMM  .MMMMM(        .nnMP"`,
    `=..          *MMMMx  MMM"  dMMMM"    .nnMMMMM*  `,
    `  "MMn...     'MMMMr 'MM   MMM"   .nMMMMMMM*"   `,
    `   "4MMMMnn..   *MMM  MM  MMP"  .dMMMMMMM""     `,
    `     ^MMMMMMMMx.  *ML "M .M*  .MMMMMM**"        `,
    `        *PMMMMMMhn. *x > M  .MMMM**""           `,
    `           ""**MMMMhx/.h/ .=*"                  `,
    `                    .3P"%....                   `,
    `                  nP"     "*MMnx                `,
    `                                                `,
    `                DANKEST DUNGEON                 `
  ];

  /**
   * Instantiate title glyphmap.
   *
   * @param scene Phaser scene.
   * @param x X coordinate.
   * @param y Y coordinate.
   */
  public constructor(scene: Phaser.Scene, x?: number, y?: number) {
    super(scene, x, y, TitleGlyphmap.title[0].length, TitleGlyphmap.title.length);

    TitleGlyphmap.title.forEach((row, y, array) => {
      const length = row.length;

      for (let x = 0; x < length; ++x) {
        const ch = row.charAt(x);

        if (y === array.length - 1) {
          this.putGlyphAt(x, y, ch, '#20B2AA');
        } else {
          switch (ch) {
            case 'M':
              if (Phaser.Math.RND.integerInRange(0, 1)) {
                this.putGlyphAt(x, y, ch, '#228B22');
              } else {
                this.putGlyphAt(x, y, ch, '#32CD32');
              }

              break;
            default:
              this.putGlyphAt(x, y, ch, '#ADFF2F');
              break;
          }
        }
      }
    });
  }
}
