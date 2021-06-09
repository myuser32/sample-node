module.exports = function makeExpressCallback(controller) {
	return (req, res) => {
		const httpRequest = {
			body: req.body,
			query: req.query,
			params: req.params,
			ip: req.ip,
			method: req.method,
			path: req.path,
			headers: {
				'Content-Type': req.get('Content-Type'),
				Referer: req.get('referer'),
				'User-Agent': req.get('User-Agent'),
				Token: req.get('Authorization'),
				application: req.get('application'),
				adapterversion: req.get('adapterversion'),
				environment: req.get('environment'),
				createdatetime: req.get('createdatetime'),
				requestno: req.get('requestno')
			}
		};
		controller(httpRequest)
			.then(httpResponse => {

				// console.log('-----------------------');
				// console.log(httpResponse);
				// console.log('-----------------------');

				if (httpResponse.headers) {
					res.set(httpResponse.headers);
				}
				res.type('json');
				res.status(httpResponse.statusCode).send(httpResponse.body);
			})
			.catch(e => res.status(403).send({ error: 'An unkown error occurred.' + e }));
	};
};
