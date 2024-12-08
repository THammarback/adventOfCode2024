import { preParse } from "./tools.ts";
const input = preParse(Deno.readTextFileSync("./day7.txt"), Number, "\n", ":", " ");
const test = preParse(`
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`, Number, "\n", ":", " ",);

const OPS = {
  "*": (tot: number, factor: number) => {
    return tot * factor;
  },
  "+": (tot: number, factor: number) => {
    return tot + factor;
  },
  "||": (tot: number, factor: number) => {
    return Number(tot.toString() + factor.toString());
  },
} as const;

function* combinations(parts: number, opKeys: (keyof typeof OPS)[]) {
  const currentCount: number[] = Array(parts - 1).fill(0);
  const max: number[] = Array(parts - 1).fill(opKeys.length - 1);
  while (true) {
    yield currentCount.map((x) => opKeys[x]);
    currentCount[0] += 1;
    for (let i = 0; i < currentCount.length; i++) {
      if (currentCount[i] > max[i]) {
        currentCount[i] = 0;
        currentCount[i + 1] += 1;
      }
    }
    if (currentCount.every((curr, i) => curr === max[i])) {
      yield currentCount.map((x) => opKeys[x]);
      break;
    }
  }
}

function calculate(data: number[][][], ops: Partial<typeof OPS>) {
  let sum = 0;
  for (const [res, terms] of data) {
    const result = res[0];
    for (const combination of combinations(terms.length, Object.keys(ops) as (keyof typeof ops)[])) {
      let total = terms[0];
      let str = terms[0].toString()
      for (const [i, hole] of combination.entries()) {
        total = ops[hole]!(total, terms[i + 1]);
        str += hole+terms[i+1]
      }
      if (total === result) {
        sum += total;
        break;
      }
    }
  }
  return sum;
}

function part1(data: number[][][]) {
  const { "||": _, ...rest } = OPS;
  return calculate(data, rest);
}
function part2(data: number[][][]) {
  return calculate(data, OPS);
}

console.log("Part 1:", part1(test));
console.log("Part 1:", part1(input));
console.log("Part 2:", part2(test))
console.log("Part 2:", part2(input))
