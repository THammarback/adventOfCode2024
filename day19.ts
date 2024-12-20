import { cache } from "./tools.ts"
const [towelsString, patternsString] = Deno.readTextFileSync('./day19.txt').split('\r\n\r\n')
const towels = towelsString.split(', ')
const patterns = patternsString.split('\r\n')
const exampleTowels = ["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]
const examplePatterns = ["brwrr", "bggr", "gbbr", "rrbgbr", "ubwu", "bwurrg", "brgr", "bbrgwb"]

function part1(patterns:string[], towels:string[]){
    let counter = 0
    for(const pattern of patterns){
        const list = [...towels]
        while(list.length){
            const current = list.pop()!
            if(pattern === current){
                counter+=1
                break
            }
            if(pattern.startsWith(current)){
                list.push(...towels.map(t => current+t))
            }
        }
    }
    return counter
}

function part2(patterns:string[], towels:string[]){
    const towelsByLength: Map<number, Set<string>> = new Map()
    for(const towel of towels){
        const byLength = towelsByLength.get(towel.length)
        if(byLength){
            byLength.add(towel)
        }else{
            towelsByLength.set(towel.length, new Set([towel]))
        }
    }
    function inner(pattern:string){
        let sum = 0
        for(const [length, set] of towelsByLength){
            if(pattern.length === length && set.has(pattern)){
                sum += 1
            }else if(set.has(pattern.substring(0, length))){
                sum += cache(inner, pattern.substring(length))
            }
        }
        return sum
    }
  
    return patterns.reduce((sum, pattern)=>sum+inner(pattern),0)
}


// console.log("Part 1:", part1(examplePatterns, exampleTowels))
// console.log("Part 1:", part1(patterns, towels))
// console.log("Part 2:", part2(examplePatterns, exampleTowels))
console.log("Part 2:", part2(patterns, towels))
