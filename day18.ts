import {Astar} from './tools.ts'

type Pos = {x:number, y:number}
const example: string[] = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`.split('\n')

function print(width:number, height:number, map:Set<string>, {x,y}:Pos, costMap:Map<string, {cost: number, camefrom: string}>){
    let last:string|undefined = `${x},${y}`
    const str:string[][] = []
    for (let y = 0; y < height; y++) {
        str.push([])
        for (let x = 0; x < width; x++) {
            str[y].push('.')
        }
    }
    for(const pos of map){
        const [x, y] = pos.split(',').map(Number)
        str[y][x] = '#'
    }
    while(last){
        const [x,y] = last.split(',').map(Number)
        str[y][x] = '*'
        last = costMap.get(last)?.camefrom
    }
    return str.map(row => row.join('')).join('\n')
}

function part1(data:string[], width:number, height:number, n:number){
    const map = new Set(data.filter((_, i)=>i<n))
    // console.log(data)
    // console.log(print(width, height, data, {x:0, y:0}, new Map<string, {cost:number, camefrom: string}>()))
    const [end, costMap] = Astar<Pos>(
        (()=>1),
        {x:0, y:0},
        ({x, y})=>`${x},${y}`,
        ({x,y})=> x === width-1 && y === height-1,
        (({x,y}) => [{x:x+1, y:y}, {x:x, y:y+1}, {x:x-1, y:y}, {x:x, y:y-1}].filter(({x,y}) => x>=0 && y>=0 && x<width && y<height && !map.has(`${x},${y}`)))
    )
    // console.log(print(width, height, map, end.value, costMap))
    return end.prio
}

function part2(data:string[], width:number, height:number, nStart:number){
    let n = nStart
   
    try{
        while(n<data.length){
            const map = new Set(data.filter((_, i)=>i<n));
            Astar<Pos>(
                (()=>1),
                {x:0, y:0},
                ({x, y})=>`${x},${y}`,
                ({x,y})=> x === width-1 && y === height-1,
                (({x,y}) => [{x:x+1, y:y}, {x:x, y:y+1}, {x:x-1, y:y}, {x:x, y:y-1}].filter(({x,y}) => x>=0 && y>=0 && x<width && y<height && !map!.has(`${x},${y}`)))
            )
            n += 1
            // console.log('')
            // console.log(print(width, height, map!, end!.value, costMap!))

        }
    }catch(err){
        if((err as Error).message === "End not found"){
            // const map = new Set(data.filter((_, i)=>i<n+1));
            // console.log('----------------------')
            // console.log(print(width, height, map, {x:0,y:0}, new Map<string, {cost: number,camefrom: string}>))
            return data[n-1]
        }else{
            throw err
        }
    }

}

// console.log(part1(example, 7, 7, 12))
console.log(part1(Deno.readTextFileSync('./day18.txt').split('\r\n'), 71, 71, 1024))
// console.log(part2(example, 7, 7, 12))
console.log(part2(Deno.readTextFileSync('./day18.txt').split('\r\n'), 71, 71, 1025))
