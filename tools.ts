
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

export function preParse<T,N extends string[]>(input:string, mapping:(x:string)=>T, ...separators: N): NestedArray<T, Length<N>>{
  const splitRecursively = (str: string, seps: string[]): any => {
    if (seps.length === 0) {
      return mapping(str);
    }
    const [firstSep, ...restSeps] = seps;
    return str.split(firstSep).filter(x=>x).map(subStr => splitRecursively(subStr, restSeps));
  };

  return splitRecursively(input, separators);
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
