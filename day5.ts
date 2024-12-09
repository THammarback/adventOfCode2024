import { preParse } from "./tools.ts";
const input = preParse(Deno.readTextFileSync("./day5.txt"), (x)=>x, '<---- split here ---->', '\r\n')
const test = preParse(`
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
(x)=>x, '\n\n', '\n')

function part1([rawRules, rawManuals]:string[][]){
    const rules = new Set(rawRules)
    const manuals = rawManuals.map(x=>x.split(',').map(Number))
    return manuals.reduce((total, manual) => {
        for(let i = 0; i<manual.length; i++){
            for(let j = i+1; j<manual.length; j++){
                if(rules.has(`${manual[j]}|${manual[i]}`)){
                    return total
                }
            }
        }
        // console.log(manual[Math.floor(manual.length/2)], Math.floor(manual.length/2), manual.length)
        return total+manual[Math.floor(manual.length/2)]
    }, 0)
}

function part2([rawRules, rawManuals]:string[][]){
    const rules = new Set(rawRules)
    const manuals = rawManuals.map(x=>x.split(',').map(Number))
    return manuals.reduce((total, manual) => {
        const newManual = manual.toSorted((a,b)=>{
            if(rules.has(`${a}|${b}`)){
                return -1
            }else if(rules.has(`${b}|${a}`)){
                return 1
            }else{
                return 0
            }
        })
        if(newManual.toString() === manual.toString()){
            return total
        }
        return total+newManual[Math.floor(newManual.length/2)]
    }, 0)
}

console.log("part1: ", part1(test))
console.log("part1: ", part1(input))
console.log("part2: ", part2(test))
console.log("part2: ", part2(input))
