const Http = require('http');

//delayed server to test the timeout of poller
const delayed = Http.createServer(( request, response ) => {
	console.log(`request received for delayed server via ${request.method}`);

	setTimeout(() => {
		response.end(`sent data`);
	}, 3000);
});

delayed.listen(8080, () => {
	console.log(`test delayed server listening on: http://localhost:8080`);
});


//normal server to test that poller works
const normal = Http.createServer(( request, response ) => {
	console.log(`request received for normal server via ${request.method}`);

	response.end(`sent data`);
});

normal.listen(8081, () => {
	console.log(`test normal server listening on: http://localhost:8081`);
});