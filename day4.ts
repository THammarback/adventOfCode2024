import { preParse } from "./tools.ts"

const test = preParse(`
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`, (x)=>x, "\n", "")
const input = preParse(Deno.readTextFileSync('./day4.txt'), (x)=>x, "\n", "")

type Kernel = {x:number, y:number}[]

function search(map:string[][], kernels:Kernel[], goals:string[]){
    let count = 0
    for(let yy=0; yy<map.length; yy++){
        for(let xx=0; xx<map[yy].length; xx++){
            for(const kernel of kernels){
                for(const goal of goals){
                    if(kernel.length !== goal.length){ throw Error("Kernel length not matching goal length")}
                    if(kernel.every(({x, y}, i)=>(map[yy+y]?.[xx+x] === goal[i]))){
                        count += 1
                    }
                }
            }
        }
    }
    return count
}

function part1(data:string[][]){
    const kernels: Kernel[] = [
        [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}],
        [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}],
        [{x:0, y:0}, {x:1, y:1}, {x:2, y:2}, {x:3, y:3}],
        [{x:3, y:0}, {x:2, y:1}, {x:1, y:2}, {x:0, y:3}]
    ]
    return search(data, kernels, ["XMAS", "SAMX"])
}
function part2(data:string[][]){
    const kernel: Kernel = [{x:0, y:0},{x:2, y:0},{x:1, y:1},{x:0, y:2},{x:2, y:2}]
    return search(data, [kernel], ["MSAMS", "SMASM", "MMASS", "SSAMM"])
}

console.log("part1:", part1(input))
console.log("part2:", part2(input))

