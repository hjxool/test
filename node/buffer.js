// alloc
let b = Buffer.alloc(10);
// console.log(b);
// allocUnsafe
let b2 = Buffer.allocUnsafe(5);
// console.log(b2);
// from
// let b3 = Buffer.from(['qwertyyu', { a: 1 }, 2, 3]);
let b3 = Buffer.from([105, 108, 111]);
// console.log(b3);
// console.log(b3.toString());
let b4 = Buffer.from('hello');
console.log(b4);
// console.log(b4[0]);
b4[0] = 361;
console.log(b4.toString());
