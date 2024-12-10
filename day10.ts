import { preParse, filterMap } from "./tools.ts";
const heightMap = preParse(Deno.readTextFileSync('./day10.txt'), Number, '\r\n', '')
const testMap = preParse(`
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`, Number, '\n', '')


function getNeighbours({x,y}:{x:number, y:number}, width:number, height:number, check:({x,y}:{x:number,y:number})=>boolean){
    const neighbours:{x:number, y:number}[] = []
    if(y<height-1){
        neighbours.push({x, y:y+1})
    }
    if(y>0){
        neighbours.push({x, y:y-1})
    }
    if(x<width-1){
        neighbours.push({x:x+1, y})
    }
    if(x>0){
        neighbours.push({x:x-1, y})
    }
    return neighbours.filter(check)
}

function trailHeads(curr:{x:number, y:number}, map:number[][], width:number, height:number):Set<string>{
    return getNeighbours(curr, width, height, ({x,y})=>map[curr.y][curr.x]+1 === map[y][x]).reduce((set, {x,y})=>(
        map[y][x] === 9 ? set.add(`${x},${y}`) : set.union(trailHeads({x,y}, map, width, height))
    ), new Set<string>())
}

function trailHeads2(curr:{x:number, y:number}, map:number[][], width:number, height:number):number{
    return getNeighbours(curr, width, height, ({x,y})=>map[curr.y][curr.x]+1 === map[y][x]).reduce((sum, {x,y})=>(
        sum + (map[y][x] === 9?1:trailHeads2({x,y}, map, width, height))
    ), 0)
}


function part1(map:number[][]){
    const width = map[0].length
    const height = map.length

    const zeros = map.flatMap((row, y) =>[...filterMap(row, (bad, n, x) => n===0?{x,y}:bad)])
    return zeros.reduce((sum, zero)=>sum+trailHeads(zero, map, width, height).size, 0)
}
function part2(map:number[][]){
    const width = map[0].length
    const height = map.length

    const zeros = map.flatMap((row, y) =>[...filterMap(row, (bad, n, x) => n===0?{x,y}:bad)])
    return zeros.reduce((sum, zero)=>sum+trailHeads2(zero, map, width, height), 0)
}


console.log("part1:", part1(testMap))
console.log("part1:", part1(heightMap))
console.log("part2:", part2(testMap))
console.log("part2:", part2(heightMap))
