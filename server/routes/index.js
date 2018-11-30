const movies = require('./movies');
const comments = require('./comments');

module.exports = (app) => {
	app.use('/movies', movies);
	app.use('/comments', comments);
};
