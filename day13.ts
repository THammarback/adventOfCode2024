const test = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`.split('\n\n')

const input = Deno.readTextFileSync('./day13.txt').split('\r\n\r\n')

type That = {xa:number, ya:number, xb:number, yb:number, px:number, py:number}
function parse(data:string, extraDistance:number):That{
    const res = data.match(/\d+/g)!.map(Number)
    return {xa:res[0], ya:res[1], xb:res[2], yb:res[3], px:res[4]+extraDistance, py:res[5]+extraDistance}
}


function solve({xa, ya, xb, yb, px, py}:That){
    if(xb*ya === xa*yb){
        throw Error("Cant divide by 0")
    }
    return [
        (py*xb - px*yb)/(xb*ya - xa*yb),
        (py*xa - px*ya)/(xa*yb - xb*ya)
    ]
}

function cost(data:string[], extraDistance:number = 0){
    let cost = 0
    for(const d of data){
        const [a, b] = solve(parse(d, extraDistance))
        if(Math.floor(a) === a && Math.floor(b) === b){
            cost += a*3+b
        }
    }
    return cost
}

console.log("part 1:", cost(test))
console.log("part 1:", cost(input))

console.log("part 2:", cost(test, 10000000000000))
console.log("part 2:", cost(input, 10000000000000))
