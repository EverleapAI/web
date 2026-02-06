// src/types/d3-cloud.d.ts
declare module "d3-cloud" {
  // Minimal, no-`any` type surface (enough for strict lint).
  // If you later use more of the API, we can extend this safely.
  export type CloudWord = {
    text: string;
    size: number;
    x?: number;
    y?: number;
    rotate?: number;
    padding?: number;
    font?: string;
    style?: string;
    weight?: string | number;
  };

  export type CloudSprite = {
    x: number;
    y: number;
    width: number;
    height: number;
    data: CloudWord;
  };

  export type CloudCallback = (words: CloudWord[], bounds?: [CloudSprite, CloudSprite]) => void;

  export type Cloud = {
    start(): Cloud;
    stop(): Cloud;

    // config
    size(size: [number, number]): Cloud;
    words(words: CloudWord[]): Cloud;
    padding(padding: number | ((w: CloudWord) => number)): Cloud;
    rotate(rotate: number | ((w: CloudWord) => number)): Cloud;
    font(font: string | ((w: CloudWord) => string)): Cloud;
    fontSize(fontSize: number | ((w: CloudWord) => number)): Cloud;
    spiral(spiral: "archimedean" | "rectangular" | ((size: [number, number]) => unknown)): Cloud;
    random(rng: () => number): Cloud;

    // events
    on(event: "word" | "end", callback: CloudCallback): Cloud;
  };

  export default function cloud(): Cloud;
}

