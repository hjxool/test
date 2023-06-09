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
