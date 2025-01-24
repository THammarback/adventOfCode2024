const example = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`.split('\n\n')

function part1(input:string[], splitter = '\r\n'){
    const locks:number[][] = []
    const keys:number[][] = []
    for(const lockOrKey of input){
        const rows = lockOrKey.split(splitter)
        const value = [0, 0, 0, 0, 0]
        for(let i=1; i<7; i++){
            for(const [j, pin] of rows[i].split('').entries()){
                value[j] += pin === "#" ? 1 : 0
            }
        }
        if(rows[0] === "#####"){
            locks.push(value)
        }else{
            keys.push(value.map(x => x-1))
        }
    }
    let counter = 0
    for(const lock of locks){
        for(const key of keys){
            const sums:number[] = []
            for(let i=0; i<5; i++){
                sums[i] = key[i]+lock[i]
            }
            if(sums.every(sum => sum<6)){
                counter += 1
            }
        }
    }
    return counter
}

console.log("part 1:", part1(example,'\n'))
console.log("part 1:", part1(Deno.readTextFileSync("./day25.txt").split("\r\n\r\n")))
