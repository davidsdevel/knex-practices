const connectDatabase = require('../lib/database/connection');
const {handleGet, handlePost} = require('../lib/posts');

module.exports = async (req, res) => {
	try {
		await connectDatabase();

		if (req.method === 'GET')
			return handleGet(req, res);
		else if (req.method === 'POST')
			return handlePost(req, res);
		else
			return res.sendStatus(405);
	} catch(err) {
		throw new Error(err);
	}
}