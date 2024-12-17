
type LessThan<
  A extends number,
  B extends number,
  S extends any[] = []
> = S["length"] extends B
  ? false
  : S["length"] extends A
  ? true
  : LessThan<A, B, [...S, any]>;
type Subtract<
  A extends number,
  B extends number,
  I extends any[] = [],
  O extends any[] = []
> = LessThan<A, B> extends true
  ? never
  : LessThan<I["length"], A> extends true
  ? Subtract<
      A,
      B,
      [...I, any],
      LessThan<I["length"], B> extends true ? O : [...O, any]
      >
    : O["length"];


type NestedArray<T, Depth extends number> = Depth extends 0 ? T : NestedArray<T[], Subtract<Depth, 1>>;
type Length<T extends any[]> = T['length'];

export function preParse<T,N extends string[]>(input:string, mapping:(x:string, coords:number[])=>T, ...separators: N): NestedArray<T, Length<N>>{
  const splitRecursively = (str: string, seps: string[], coord:number[]): any => {
    if (seps.length === 0) {
      return mapping(str, coord);
    }
    const [firstSep, ...restSeps] = seps;
    return str.split(firstSep).filter(x=>x).map((subStr, i) => splitRecursively(subStr, restSeps, [...coord, i]));
  };

  return splitRecursively(input, separators, []);
}

const filterSym = Symbol("Filter")
export function * filterMap<V, U, T extends Iterable<U>>(arr:T, predicate:(filter:typeof filterSym, el:U, index:number, arr:T)=>(V|typeof filterSym) ):Generator<V, void, unknown>{
  let i=0
  for(const el of arr){
    const res = predicate(filterSym,el,i++,arr)
    if(res !== filterSym){
      yield res
    }
  }
}

type Func<T extends any[], R> = (...args: T) => R;
const cach: Record<string, any> = {};
export function cache<T extends any[], R>(func: Func<T, R>, ...args: T): R {
    const key = JSON.stringify(args);
    if (key in cach) {
        return cach[key];
    } else {
        const value = func(...args);
        cach[key] = value;
        return value;
    }
}

export class BinaryPriorityHeap<T> {
    private heap: T[] = [];
    private comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this.comparator = comparator;
    }

    get length(){
        return this.heap.length
    }

    add(element: T): void {
        this.heap.push(element);
        this.bubbleUp();
    }

    pop(): T | undefined {
        if (this.heap.length === 0) return undefined;
        if (this.heap.length === 1) return this.heap.pop();

        const top = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.bubbleDown();
        return top;
    }

    private bubbleUp(): void {
        let index = this.heap.length - 1;
        const element = this.heap[index];

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];

            if (this.comparator(element, parent) >= 0) break;

            this.heap[index] = parent;
            index = parentIndex;
        }
        this.heap[index] = element;
    }

    private bubbleDown(): void {
        let index = 0;
        const length = this.heap.length;
        const element = this.heap[index];

        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let swapIndex = -1;

            if (leftChildIndex < length) {
                const leftChild = this.heap[leftChildIndex];
                if (this.comparator(leftChild, element) < 0) {
                    swapIndex = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                const rightChild = this.heap[rightChildIndex];
                if (
                    (swapIndex === -1 && this.comparator(rightChild, element) < 0) ||
                    (swapIndex !== -1 && this.comparator(rightChild, this.heap[swapIndex]) < 0)
                ) {
                    swapIndex = rightChildIndex;
                }
            }

            if (swapIndex === -1) break;

            this.heap[index] = this.heap[swapIndex];
            index = swapIndex;
        }
        this.heap[index] = element;
    }
}
