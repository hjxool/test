let url = location.host;
history.replaceState('', '', `http://${url}`);
alert(url);
