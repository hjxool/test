function get() {
	let input = document.querySelector('#get').value;
	fetch(`http://127.0.0.1:30/api/getdata?name=${input}`, {
		method: 'get',
	})
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			document.querySelector('#text').value = JSON.stringify(res, null, 4);
		});
}
function post() {
	let dom = document.querySelectorAll('.post');
	let name = dom[0].value;
	let price = dom[1].value;
	let num = Number(dom[2].value);
	fetch('http://127.0.0.1:30/api/adddata', {
		method: 'post',
		body: JSON.stringify({ name, price, num }),
		headers: {
			'content-Type': 'application/json',
		},
	})
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			document.querySelector('#text').value = JSON.stringify(res, null, 4);
		});
}
function download() {
	window.open('http://127.0.0.1:30/api/downloadfile');
}
let token;
function get_token() {
	fetch('http://127.0.0.1:30/api/get_token')
		.then((res) => {
			console.log(res);
			return res.json();
		})
		.then((res) => {
			console.log(res);
			token = res.data;
		});
}
function download2() {
	// headers携带token
	fetch('http://127.0.0.1:30/api/downloadfile2', {
		headers: {
			token: token,
		},
	})
		.then((res) => res.json())
		.then((res) => {
			window.open(res.data);
		});

	// query携带token
	// window.open(`http://127.0.0.1:30/api/downloadfile2?token=${token}`);
}
