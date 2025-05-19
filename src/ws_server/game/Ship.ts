export class Ship {
  positions: { x: number; y: number }[];
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
  hits: boolean[];

  constructor(
    position: { x: number; y: number },
    direction: boolean,
    length: number,
    type: "small" | "medium" | "large" | "huge"
  ) {
    this.length = length;
    this.type = type;
    this.direction = direction;
    this.hits = new Array(length).fill(false);

    if (direction) {
      this.positions = Array.from({ length }, (_, index) => ({
        x: position.x,
        y: position.y + index,
      }));
    } else {
      this.positions = Array.from({ length }, (_, index) => ({
        x: position.x + index,
        y: position.y,
      }));
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
