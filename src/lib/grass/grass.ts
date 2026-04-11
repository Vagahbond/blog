export type GrassSeed = [number, number, number, number, number, number, number, number]

interface Point {
  x: number
  y: number
}

function mkPoint(x: number, y: number) {
  return {
    x: x,
    y: y
  }
}

function addToPoint(point: Point, adderx: number, addery: number) {
  point.x += adderx;
  point.y += addery;
}

function multiplyPoint(point: Point, factorx: number, factory: number) {
  point.x *= factorx;
  point.y *= factory;
}


function randomBladeColor(rand: number) {
  const baseHue = 100; // green
  const hue = baseHue + (rand * 70 - 35);
  return {
    colorBase: `hsl(${hue}, 50%, 30%)`, // dark base
    colorMid: `hsl(${hue}, 50%, 35%)`,  // mid
    colorTip: `hsl(${hue}, 45%, 60%)`   // light tip
  };
}


class Level {
  left: Point;
  right: Point;

  constructor(lx: number, ly: number, rx: number, ry: number) {
    this.left = mkPoint(lx, ly);
    this.right = mkPoint(rx, ry);

  }

  multipy(factorx: number, factory: number) {
    this.left.x *= factorx;
    this.left.y *= factory;

    this.right.x *= factorx;
    this.right.y *= factory;
  }

  add(adderx: number, addery: number) {
    this.left.x += adderx;
    this.left.y += addery;

    this.right.x += adderx;
    this.right.y += addery;
  }
}

export class GrassBlade {
  RANDOMIZE_FACTOR = 40;

  age: number; //max age is 1

  color;
  offset;

  id: number;

  wasCut: boolean = false;

  private seed: GrassSeed;
  seedAccessIndex = 0;

  base: Level = new Level(10, 200, 30, 200);
  l1: Level = new Level(10, 180, 20, 180);
  l2: Level = new Level(0, 140, 25, 140);
  l3: Level = new Level(15, 80, 38, 100);
  l4: Level = new Level(18, 40, 45, 60);
  l5: Level = new Level(25, 10, 40, 20);
  tip: Point = mkPoint(32, 5)

  public getRandomValue(): number {
    const res = this.seed[this.seedAccessIndex]
    this.seedAccessIndex = (this.seedAccessIndex + 1) % 8
    return res
  }


  constructor(age: number = 0, seed: GrassSeed, id: number) {
    this.seed = seed;

    // need constant color to avoid color shifts
    this.color = randomBladeColor(this.seed[0]);

    // need constant offset to avoid teleportation
    this.offset = this.seed[1];

    this.age = age;

    this.id = id;

    this.applyModifier()

    this.applyThinness(this.age)
  }

  public cut() {
    this.wasCut = true;
  }

  applyThinness(growth: number) {
    this.base.multipy(1 - growth / 2, 1)

    this.l1.multipy(1 - growth / 2, 1)
    this.l2.multipy(1 - growth / 2, 1)
    this.l3.multipy(.8 - growth / 2, 1)
    this.l4.multipy(.8 - growth / 2, 1)
    this.l5.multipy(.7 - growth / 2, 1)

    multiplyPoint(this.tip, .7 - growth / 2, 1)
  }

  applyModifier() {
    const mody = this.getRandomValue() * this.RANDOMIZE_FACTOR - this.RANDOMIZE_FACTOR / 2
    const modx = mody / 2

    this.base.add(this.getRandomValue() * modx, 0)

    this.l1.add(this.getRandomValue() * modx, this.getRandomValue() * mody)
    this.l2.add(this.getRandomValue() * modx, this.getRandomValue() * mody)
    this.l3.add(this.getRandomValue() * modx, this.getRandomValue() * mody)
    this.l4.add(this.getRandomValue() * modx, this.getRandomValue() * mody)
    this.l5.add(this.getRandomValue() * modx, this.getRandomValue() * mody)

    addToPoint(this.tip, this.getRandomValue() * modx, this.getRandomValue() * mody)
  }

  public getPath() {
    return `M ${this.base.left.x} ${this.base.left.y}
       C ${this.l1.left.x} ${this.l1.left.y}, 
          ${this.l2.left.x} ${this.l2.left.y}, 
          ${this.l3.left.x} ${this.l3.left.y}
       C ${this.l4.left.x} ${this.l4.left.y}, 
          ${this.l5.left.x} ${this.l5.left.y}, 
          ${this.tip.x} ${this.tip.y}
       C ${this.l5.right.x} ${this.l5.right.y}, 
          ${this.l4.right.x} ${this.l4.right.y}, 
          ${this.l3.right.x} ${this.l3.right.y}
       C ${this.l2.right.x} ${this.l2.right.y}, 
          ${this.l1.right.x} ${this.l1.right.y}, 
          ${this.base.right.x} ${this.base.right.y}
       Z`
  }


  public getSwayedPath(dir: "left" | "right") {

    const offset = this.RANDOMIZE_FACTOR / 3 * this.getRandomValue() * (dir === "left" ? -0.5 : 1)


    return `M ${this.base.left.x} ${this.base.left.y}
       C ${this.l1.left.x + offset * 0.6} ${this.l1.left.y}, 
          ${this.l2.left.x + offset * 0.8} ${this.l2.left.y}, 
          ${this.l3.left.x + offset * 1} ${this.l3.left.y}
       C ${this.l4.left.x + offset * 1} ${this.l4.left.y}, 
          ${this.l5.left.x + offset * 2} ${this.l5.left.y}, 
          ${this.tip.x + offset * 3} ${this.tip.y}
       C ${this.l5.right.x + offset * 2} ${this.l5.right.y}, 
          ${this.l4.right.x + offset * 1} ${this.l4.right.y}, 
          ${this.l3.right.x + offset * 1} ${this.l3.right.y}
       C ${this.l2.right.x + offset * 0.8} ${this.l2.right.y}, 
          ${this.l1.right.x + offset * 0.6} ${this.l1.right.y}, 
          ${this.base.right.x + offset * 0.6} ${this.base.right.y}
       Z`
  }

}


