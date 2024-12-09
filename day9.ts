import { preParse } from "./tools.ts";

const test = preParse('2333133121414131402', Number, '')
const input = preParse(Deno.readTextFileSync('./day9.txt'), Number, '')

function expand(data:number[]):Array<number|'.'>{
    const blocks:Array<number|'.'> = []
    let freeSpace = false
    let id = 0
    for(const digit of data){
        for(let i=0;i<digit; i++){
            if(freeSpace){
                blocks.push('.')
            }else{
                blocks.push(id)
            }
        }
        if(!freeSpace){
            id+=1
        }
        freeSpace = !freeSpace
    }
    return blocks
}

function move(blocks:Array<number|'.'>){
    let left = 0
    let right = blocks.length-1

    while(left < right){
        while(blocks[left] !== '.'){
            left++
        }
        while(blocks[right] === '.'){
            right--
        }
        blocks[left++] = blocks[right]
        blocks[right--] = '.'
    }
    return blocks
}

function checkSum(blocks:Array<number|'.'>){
    return blocks.filter(x=>x!=='.').reduce((total, current, index) => total+current*index, 0)
}

function part2(data:number[]){
    const memory:{id:number|null, len:number}[] = data.map((x,i) => ({id:i%2?null:(i/2), len:Number(x)}))
    for(let i=memory.length-1; i >= 0; i--){
        for(let j=0; j<i; j++){
            if(memory[i].id !== null && memory[j].id === null && memory[i].len <= memory[j].len){
                memory[j].len -= memory[i].len
                const copy = {id:memory[i].id, len:memory[i].len}
                memory[i].id = null
                memory.splice(j, 0, copy)
                i++
                break
            }
        }
    }
    
    return memory.reduce(([sum, i], {id, len}) => [id
        ? sum + id * (i + i + len - 1) * len / 2
        : sum, i+= len
    ], [0, 0])[0]
}
    

console.log("Part1: ", checkSum(move(expand(test))))
console.log("Part1: ", checkSum(move(expand(input))))
console.log("Part2: ", part2(test))
console.log("Part2: ", part2(input))
