import { cache } from "./tools.ts"
const test = [125, 17]
const input = [872027, 227, 18, 9760, 0, 4, 67716, 9245696]

function result(stone:number, i:number):number{
    if(i === 0){
        return 1
    } else if(stone === 0){
        return cache(result, 1, i-1)
    } else {
        const length = Math.floor(Math.log10(stone)) + 1;
        if(length % 2 === 0){
            const divisor = Math.pow(10, length / 2);
            return cache(result, Math.floor(stone / divisor), i-1) + cache(result, stone % divisor, i-1)
        } else {
            return cache(result, stone*2024, i-1)
        }
    }
}

function part1(stones:number[]){
    let sum = 0
    for(const stone of stones){
        sum += cache(result, stone, 25)
    }
    return sum
}
function part2(stones:number[]){
    let sum = 0
    for(const stone of stones){
        sum += cache(result, stone, 75)
    }
    return sum
}
console.log("Part 1:", part1(test))
console.log("Part 1:", part1(input))
console.log("Part 1:", part2(test))
console.log("Part 1:", part2(input))
