import { filterMap, preParse } from "./tools.ts";
const input = preParse(Deno.readTextFileSync('./day12.txt'), (x)=>x, '\r\n', '')

const test = preParse(`
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`, (x)=>x, '\n', '')
// const test = preParse(`
// AAAA
// BBCD
// BBCC
// EEEC`, (x)=>x, '\n', '')


type strPos = string & {_strpos:true}
type Pos = {x:number, y:number}
type Dir = 1|2|3|4

const p2s = ({x,y}:Pos) => `${x},${y}` as strPos
const s2p = (str:strPos) => {const [x, y] = str.split(','); return {x:Number(x),y:Number(y)}}


function getNeigbours({x,y}:Pos):Pos[]{
    return [
        {x:x+1,y:y},
        {x:x,y:y-1},
        {x:x-1,y:y},
        {x:x,y:y+1},
    ]
}
function inBound({x,y}:Pos, width:number, height:number){
    return x >= 0 && y >= 0 && x < width && y < height
}

function getRegion(start:Pos, char:string, data:string[][]){
    const list = [start]
    const visited = new Map<strPos, {fence:number, char:string}>()
    while(list.length){
        const pos = list.shift()!
        if (!visited.has(p2s(pos))) {
            const neigbours = getNeigbours(pos).filter((p) => inBound(p, data[0].length, data.length) && data[p.y][p.x] === char )
            const fence = 4-neigbours.length
            visited.set(p2s(pos), {fence, char});
            for (const n of neigbours.filter((p)=>!visited.has(p2s(p)))) {
                if (!visited.has(p2s(n))) {
                    list.push(n);
                }
            }
        }
    }
    return visited
}

function getAllRegions(data:string[][]){
    const regions: Map<strPos, {fence:number, char:string}>[] = []
    for(const [y, row] of data.entries()){
        for(const [x, char] of row.entries()){
            if(regions.every(region => !region.has(p2s({x,y})))){
                regions.push(getRegion({x,y}, char, data))
            }
        }
    }
    return regions
}

function part1(data:string[][]){
    let cost = 0
    for(const region of getAllRegions(data)){
        let fence = 0
        for(const tile of region.values()){
            fence += tile.fence
        }
        cost += fence*region.size
    }
    return cost
}

function part2(data:string[][]){
    let cost = 0
    const posRegionMap = new Map<strPos, number>()
    const regionCorners:Record<number, {corners:number, size:number, char:string}> = {}
    for(const [i, map] of getAllRegions(data).entries()){
        for(const pos of map.keys()){
            if(posRegionMap.has(pos)){
                throw Error("Duplicate pos")
            }
            posRegionMap.set(pos, i)
        }
        regionCorners[i] = {corners:0, size:map.size, char:map.values().next().value.char}
    }
    for (let y = 0; y <= data.length; y++) {
        for (let x = 0; x <= data.length; x++) {
            const a = posRegionMap.get(p2s({x:x,y:y}))
            const b = posRegionMap.get(p2s({x:x-1,y:y}))
            const c = posRegionMap.get(p2s({x:x,y:y-1}))
            const d = posRegionMap.get(p2s({x:x-1,y:y-1}))
            if(a === b && a === c && a === d){
                continue
            }
            if(a !== undefined && ((b === c) || (a !== b && a !== c))){
                regionCorners[a].corners += 1
            }
            if(b !== undefined && ((d === a || (b !== d && b !== a)))){
                regionCorners[b].corners += 1
            }
            if(c !== undefined && ((a === d) || (c !== a && c !== d))){
                regionCorners[c].corners += 1
            }
            if(d !== undefined && ((c === b) || (d !== c && d !== b))){
                regionCorners[d].corners += 1
            }
        }
    }
    for(const {corners, size} of Object.values(regionCorners)){
        cost += corners*size
    }

    return cost
}


console.log("Part 1: ", part1(test))
console.log("Part 1: ", part1(input))
console.log("Part 2: ", part2(test))
console.log("Part 2: ", part2(input))
