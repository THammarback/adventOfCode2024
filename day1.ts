import {preParse} from "./tools.ts";
const text = preParse(await Deno.readTextFile("data/day1.txt"), Number, '\n', '   ');
const test = preParse(`
3   4
4   3
2   5
1   3
3   9
3   3`, (x)=>Number(x.trim()), '\n', '   ')

function part1(input:number[][]) {
  const lefts: number[] = [];
  const rights: number[] = [];

  input.forEach(([left, right]) => {
    lefts.push(left);
    rights.push(right);
  });

  lefts.sort();
  rights.sort();

  let sum = 0;
  for (let i = 0; i < lefts.length; i++) {
    sum += Math.abs(lefts[i] - rights[i]);
  }
  return sum;
}

function part2(input:number[][]) {
  const lefts: number[] = [];
  const rights: Record<number, number> = {};

  input.forEach(([left, right]) => {
    lefts.push(left)

    if (right in rights) {
      rights[right] += 1;
    } else {
      rights[right] = 1;
    }
  });

  let sum = 0
  for(const value of lefts){
    sum += value * (rights[value] ?? 0)
  }
  return sum
}
console.log("Part 1:", part1(test))
console.log("Part 1:", part1(text))
console.log("Part 2:", part2(test))
console.log("Part 2:", part2(text))

