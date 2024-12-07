import { preParse } from "./tools.ts";
const input = preParse(Deno.readTextFileSync("./day6.txt"), (x)=>x, "\n", "")
const test = preParse(`
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`, (x)=>x, "\n", "")

type Pos = `${number},${number}`
function getMap(data:string[][]){
    const map = new Set<Pos>()
    let pos = {x:0,y:0}
    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            if(data[y][x] === "#"){
                map.add(`${x},${y}`)
            } else if(data[y][x] === "^") {
                
                pos = {x, y}
            }
        }
    }
    return {pos, dir:0, map, height:data.length, width:data[0].length}
}

function move({x,y}:{x:number, y:number}, dir:number, map:Set<Pos>, path:Set<Pos>):[{x:number,y:number}, dir:number]{
    path.add(`${x},${y}`)
    switch(dir){
        case 0:
            if(map.has(`${x},${y-1}`)){
                return move({x,y}, 1, path, map)
            }else{
                return [{x:x,y:y-1}, dir]
            }
        case 1:
            if(map.has(`${x+1},${y}`)){
                return move({x,y}, 2, path, map)
            }else{
                return [{x:x+1,y:y}, dir]
            }
        case 2:
            if(map.has(`${x},${y+1}`)){
                return move({x,y}, 3, path, map)
            }else{
                return [{x:x,y:y+1}, dir]
            }
        case 3:
            if(map.has(`${x-1},${y}`)){
                return move({x,y}, 0, path, map)
            }else{
                return [{x:x-1,y:y}, dir]
            }
        }
    return [{x,y}, dir]
}

function print(data:Set<Pos>, width:number, height:number){
    let str = ""
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if(data.has(`${x},${y}`)){
                str += "X"
            }
            else{
                str += "."
            }
        }
        str += "\n"
    }
    return str
}

function part1(data:string[][]){
    const path = new Set<Pos>()
    let {pos, dir, map, width, height} = getMap(data)
    let count = 0
    while(pos.x >= 0 &&
         pos.y >= 0 &&
         pos.x < width &&
         pos.y < height){
            [pos, dir] = move(pos, dir, map, path)
            count += 1
    }
    // console.log(print(map, width, height))
    // console.log(print(path, width, height))
    console.log(count)
    return path.size
}
// console.log("part1: ", part1(test))
console.log("part1: ", part1(input))
