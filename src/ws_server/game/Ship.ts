export class Ship {
  positions: { x: number; y: number }[];
  hits: boolean[];
  length: number;
  type: "small" | "medium" | "large" | "huge";

  constructor(
    x: number,
    y: number,
    direction: boolean,
    length: number,
    type: "small" | "medium" | "large" | "huge"
  ) {
    this.length = length;
    this.type = type;
    this.positions = [];
    this.hits = new Array(length).fill(false);

    for (let i = 0; i < length; i++) {
      this.positions.push({
        x: direction ? x + i : x,
        y: direction ? y : y + i,
      });
    }
  }

  isHit(x: number, y: number): boolean {
    return this.positions.some(
      (pos, index) => pos.x === x && pos.y === y && !this.hits[index]
    );
  }

  recordHit(x: number, y: number): "shot" | "killed" {
    const index = this.positions.findIndex((pos) => pos.x === x && pos.y === y);
    if (index !== -1 && !this.hits[index]) {
      this.hits[index] = true;
      return this.isSunk() ? "killed" : "shot";
    }
    throw new Error("Invalid hit position");
  }

  isSunk(): boolean {
    return this.hits.every((hit) => hit);
  }
}
