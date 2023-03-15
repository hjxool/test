// import * as xx from './test.js';
// console.log(xx);
function fn2() {
	import('./test.js').then((xx) => {
		console.log(xx);
	});
}
