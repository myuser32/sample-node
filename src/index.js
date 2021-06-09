const app = require('./server');

const PORT = process.env.PORT || 4000;


async function init() {

	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}. Try some routes, such as '/api/users'.`);
	});

}

init();