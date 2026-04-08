class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(adderx: number, addery: number) {
    this.x += adderx;
    this.y += addery;
  }

  multiply(factorx: number, factory: number) {
    this.x *= factorx;
    this.y *= factory;
  }

}

class Level {
  left: Point;
  right: Point;

  constructor(lx: number, ly: number, rx: number, ry: number) {
    this.left = new Point(lx, ly);
    this.right = new Point(rx, ry);
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

  seed: number;

  base: Level = new Level(10, 200, 30, 200);
  l1: Level = new Level(10, 180, 20, 180);
  l2: Level = new Level(0, 140, 25, 140);
  l3: Level = new Level(15, 80, 38, 100);
  l4: Level = new Level(18, 40, 45, 60);
  l5: Level = new Level(25, 10, 40, 20);
  tip: Point = new Point(32, 5)


  constructor(growth: number) {
    this.seed = Math.random();

    this.applyModifier()

    this.applyGrowth(growth)

  }

  applyGrowth(growth: number) {
    this.base.multipy(1 - growth / 2, 1)

    this.l1.multipy(1 - growth / 2, 1)
    this.l2.multipy(1 - growth / 2, 1)
    this.l3.multipy(.8 - growth / 2, 1)
    this.l4.multipy(.8 - growth / 2, 1)
    this.l5.multipy(.7 - growth / 2, 1)

    this.tip.multiply(.7 - growth / 2, 1)
  }

  applyModifier() {
    const mody = this.seed * this.RANDOMIZE_FACTOR - this.RANDOMIZE_FACTOR / 2
    const modx = mody / 2

    this.base.add(Math.random() * modx, 0)

    this.l1.add(Math.random() * modx, Math.random() * mody)
    this.l2.add(Math.random() * modx, Math.random() * mody)
    this.l3.add(Math.random() * modx, Math.random() * mody)
    this.l4.add(Math.random() * modx, Math.random() * mody)
    this.l5.add(Math.random() * modx, Math.random() * mody)

    this.tip.add(Math.random() * modx, Math.random() * mody)
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

    const offset = this.RANDOMIZE_FACTOR / 3 * Math.random() * (dir === "left" ? -0.5 : 1)


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
