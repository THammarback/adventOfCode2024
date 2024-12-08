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
type PosDir = `${number},${number},${number}`
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

class LoopError extends Error{
  constructor(...args:any[]){
    super(...args)
  }
}

function move({x,y}:{x:number, y:number}, dir:number, map:Set<Pos>, path:Set<PosDir>):[{x:number,y:number}, dir:number]{
    if(path.has(`${x},${y},${dir}`)){
      throw new LoopError("Loop!")
    }
    path.add(`${x},${y},${dir}`)
    switch(dir){
        case 0:
            if(map.has(`${x},${y-1}`)){
                return move({x,y}, 1, map, path)
            }else{
                return [{x:x,y:y-1}, dir]
            }
        case 1:
            if(map.has(`${x+1},${y}`)){
                return move({x,y}, 2, map, path)
            }else{
                return [{x:x+1,y:y}, dir]
            }
        case 2:
            if(map.has(`${x},${y+1}`)){
                return move({x,y}, 3, map, path)
            }else{
                return [{x:x,y:y+1}, dir]
            }
        case 3:
            if(map.has(`${x-1},${y}`)){
                return move({x,y}, 0, map, path)
            }else{
                return [{x:x-1,y:y}, dir]
            }
        }
    return [{x,y}, dir]
}

function part1(data:string[][]){
    const path = new Set<PosDir>()
    let {pos, dir, map, width, height} = getMap(data)
    while(pos.x >= 0 &&
         pos.y >= 0 &&
         pos.x < width &&
         pos.y < height){
            [pos, dir] = move(pos, dir, map, path)
    }
    const xySet = new Set<Pos>()
    for(const posDir of path){
      const [x,y,_] = posDir.split(',')
      xySet.add(`${Number(x)},${Number(y)}`)
    }
    return xySet.size
}

function part2(data:string[][]){
  const {pos:starPos, dir:startDir, map, width, height} = getMap(data)
  const mapArr = [...map]
  const firstPath = inner(map, starPos, startDir)
  const loops = new Set<Pos>()
  for(const posDir of firstPath){
    const map = new Set(mapArr)
    const [x,y,_] = posDir.split(',')
    map.add(`${Number(x)},${Number(y)}`)
    try{
      inner(map, starPos, startDir)
    }catch(err){
      if(err instanceof LoopError){
        loops.add(`${Number(x)},${Number(y)}`)
      }else{
        throw err
      }
    }
  }

  function inner(map:Set<Pos>, innerPos:{x:number, y:number}, innerDir:number){
    const path = new Set<PosDir>()
    while(innerPos.x >= 0 &&
      innerPos.y >= 0 &&
      innerPos.x < width &&
      innerPos.y < height){
        [innerPos, innerDir] = move(innerPos, innerDir, map, path)
    }
    return path 
  }
  return loops.size
}
console.log("part1: ", part1(test))
console.log("part1: ", part1(input)) //4375-1
console.log("part2: ", part2(test))
console.log("part2: ", part2(input)) // 1706-1

