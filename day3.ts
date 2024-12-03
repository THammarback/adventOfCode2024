const regex = /mul\((\d{1,3}),(\d{1,3})\)|(do\(\))|(don\'t\(\))/g
const test = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"
const input = Deno.readTextFileSync("./day3.txt")

function day3(input:string, regex:RegExp, alwaysEnabled:boolean){
    let match: string[] | undefined;
    let sum = 0;
    let enabled = true;
    
    while ((match = regex.exec(input)?.slice(1))) {
        if (match[2]) {
            enabled = true;
        } else if (match[3]) {
            enabled = alwaysEnabled || false;
        } else if (enabled) {
            sum += parseInt(match[0]) * parseInt(match[1]);
        }
    }
    return sum
}

//console.log("part1 test:", day3(test, regex, true));
console.log("part1:", day3(input, regex, true));
//console.log("part2 test:", day3(test, regex, false));
console.log("part2:", day3(input, regex, false));
