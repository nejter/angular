const promise = require('bluebird');
const request = require('request-promise');

const options = {
	promiseLib: promise,
	ssl: true
};

const pgp = require('pg-promise')(options);
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/';
const db = pgp(connectionString);

addComment = (req, res, next) => {
	if(req.body.comment.length > 1) {
		db.none('INSERT INTO comments(movie_id, comment) VALUES($1, $2)', [req.body.movieIds, req.body.comment]).then(() => {
			res.status(200)
				.json({
					movie_id: req.body.movieIds,
					comment: req.body.comment
				});
		})
			.catch(function (err) {
				return next(err);
			});
	} else {
		res.send('Comment should contain at least 2 characters.')
	}
};

addMovie = (req, res, next) => {
	const movieTitle = req.body.title;
	const obdbApiUrl = 'http://www.omdbapi.com/?apikey=2b49f61f&t=' + movieTitle;
	request({
		url: obdbApiUrl,
		json: true
	},  (error, response, body) => {
		if (!error && response.statusCode === 200 && !body.hasOwnProperty('Error')) {
			db.none('INSERT INTO movies(title, moviedata) VALUES($1, $2)', [movieTitle.toUpperCase(), body])
				.then(() => {
					res.status(200)
						.json({
							requested_title: movieTitle,
							movie_data: body
						});
				}, () => {
					res.send('Movie already in database');
				})
				.catch(function (err) {
				return next(err);
			});
		} else {
			res.json(body)
		}
	});
};

getAllComments = (next) => {
	return new Promise((resolve) => {
		db.any('SELECT * FROM comments c LEFT JOIN movies m ON c.movie_id = m.id')
			.then(data => {
				resolve(data);
			})
			.catch(function (err) {
				return next(err);
			});
	});
};

getAllMovies = (next) => {
	return new Promise((resolve, reject) => {
		db.any('SELECT * FROM movies')
			.then(data => {
				resolve(data);
			})
			.catch(function (err) {
				return next(err);
			});
	});
};

getCommentsByMovieId = (req, next) => {
	return new Promise((resolve) => {
		db.any('SELECT * FROM comments c JOIN movies m ON c.movie_id = m.id AND c.movie_id = $1', [req.body.movieIdToFilter])
			.then(data => {
				resolve(data);
			})
			.catch(function (err) {
				return next(err);
			});
	});
};

module.exports = {
	addComment: addComment,
	addMovie: addMovie,
	getAllComments: getAllComments,
	getAllMovies: getAllMovies,
	getCommentsByMovieId: getCommentsByMovieId
};
