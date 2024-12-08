import { preParse } from "./tools.ts";
const input = preParse(Deno.readTextFileSync("./day8.txt"), (x) => x, "\r\n", "");

const test = preParse(`
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`, (x) => x, "\n", "");

type Pos = `${number},${number}`;

function parseMap(data: string[][]) {
  const map = new Map<string, Pos[]>();
  for (const [y, row] of data.entries()) {
    for (const [x, cell] of row.entries()) {
      if (cell !== ".") {
        if (map.has(cell)) {
          map.get(cell)?.push(`${x},${y}`);
        } else {
          map.set(cell, [`${x},${y}`]);
        }
      }
    }
  }
  return { map, width: data[0].length, height: data.length };
}

function decompose(pos: Pos): { x: number; y: number } {
  const [x, y] = pos.split(",");
  return { x: Number(x), y: Number(y) };
}

function antiNode(p1: Pos, p2: Pos): [Pos, Pos] {
  const { x: p1x, y: p1y } = decompose(p1);
  const { x: p2x, y: p2y } = decompose(p2);
  return [
    `${2 * p1x - p2x},${2 * p1y - p2y}`,
    `${2 * p2x - p1x},${2 * p2y - p1y}`,
  ];
}

function* pairs<T>(data: T[]): Generator<[T, T], void, unknown> {
  for (const d1 of data) {
    for (const d2 of data) {
      if (d1 !== d2) {
        yield [d1, d2];
      }
    }
  }
}

function print(nodes: Set<Pos>, data: string[][], width: number, height: number) {
  let str = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (nodes.has(`${x},${y}`)) {
        str += "#";
      } else {
        str += data[y][x];
      }
    }
    str += "\n";
  }
  return str;
}

function part1(data: string[][]) {
  const { map, width, height } = parseMap(data);
  const antiNodes = new Set<Pos>();
  for (const values of map.values()) {
    for (const [d1, d2] of pairs(values)) {
      const [p1, p2] = antiNode(d1, d2);
      const { x: x1, y: y1 } = decompose(p1);
      if (x1 >= 0 && y1 >= 0 && x1 < width && y1 < height) {
        antiNodes.add(p1);
      }
      const { x: x2, y: y2 } = decompose(p2);
      if (x2 >= 0 && y2 >= 0 && x2 < width && y2 < height) {
        antiNodes.add(p2);
      }
    }
  }
  return antiNodes.size
}

function * allAntiNodes(p1:Pos, p2:Pos, width:number, height:number):Generator<Pos, void, unknown>{
  const { x: p1x, y: p1y } = decompose(p1);
  const { x: p2x, y: p2y } = decompose(p2);
  const dx = p1x-p2x
  const dy = p1y-p2y
  let x = p1x
  let y = p1y
  while(x >= 0 && y >= 0 && x < width && y < height){
    yield `${x},${y}`
    x += dx
    y += dy
  }
  x = p2x
  y = p2y
  while(x >= 0 && y >= 0 && x < width && y < height){
    yield `${x},${y}`
    x -= dx
    y -= dy
  }
}

function part2(data:string[][]){
  const { map, width, height } = parseMap(data);
  const antiNodes = new Set<Pos>();
  for (const values of map.values()) {
    for (const [d1, d2] of pairs(values)) {
      for (const p of allAntiNodes(d1, d2, width, height)){
        antiNodes.add(p)
      }
    }
  }
  return antiNodes.size
}

// console.log("part1: ", part1(test));
// console.log("part1: ", part1(input))
console.log("part2: ", part2(test)) 
console.log("part2: ", part2(input)) 
