const {Observable,throwError,of} =require("rxjs");
const {mergeMap} =require("rxjs/operators");


of(1).pipe(
    mergeMap((a)=>of(2+a))
).subscribe(r=>{
    console.log(r)
})
