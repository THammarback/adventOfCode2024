import {preParse} from "./tools.ts";
const text = preParse(await Deno.readTextFile("data/day2.txt"), Number, "\n", " ");
const test = preParse(`
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`, Number, "\n", " ")



function part1(input:number[][]):number{
  return input.reduce<number>((sum, report)=>{
    const diff = report.slice(1).map((level, i) => Number(level) - Number(report[i]))
    const safe = diff.every(x => x > 0 && x <= 3) || diff.every(x => x < 0 && x >= -3)
    return sum + (safe ? 1 : 0)
  }, 0);
}

function part2(input:number[][]):number{
  function removeByIndex(arr:any[], index:number){ return arr.filter((_,i)=>index !== i)}
  return input.reduce<number>((sum, report)=>{
    const safe = report.some((_, index) => {
      const levels = removeByIndex(report, index)
      const diff = levels.slice(1).map((level, i) => Number(level) - Number(levels[i]))
      return diff.every(x => x > 0 && x <= 3) || diff.every(x => x < 0 && x >= -3)
    })
    return sum + (safe ? 1 : 0)
  }, 0);
}

console.log("Part 1:", part1(test))
console.log("Part 1:", part1(text))
console.log("Part 2:", part2(test))
console.log("Part 2:", part2(text))

