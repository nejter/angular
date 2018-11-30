const db = require('../database/queries');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

	const getComments = () => {
		return new Promise((resolve) => {
			db.getAllComments(req.next)
				.then(data => {
					resolve(data)
				});
		});
	};

	const showComments = () => {
		getComments().then(data => {
			db.getAllMovies(req.next).then(movies => {
				const movieIds = [...new Set(data.map(item => item.movie_id))];
				res.render('comments', { commentsdata : data, movieids: movieIds, allmovieids : movies })
			});
		})
	};

	showComments();
});

router.post('/', async (req, res) => {

    if(req.body.addComment){
	    db.addComment(req, res, req.next);
    }

	if(req.body.filter){
		const filterComments = () => {
			return new Promise((resolve) => {
				db.getCommentsByMovieId(req, req.next)
					.then(data => {
						resolve(data)
					});
			});
		};

		const showComments = () => {
			filterComments().then(data => {
				db.getAllComments(req.next).then(movies => {
					db.getAllMovies(req.next).then(allMovies => {
						const movieIds = [...new Set(movies.map(item => item.movie_id))];
						res.render('comments', {commentsdata: data, movieids: movieIds, allmovieids : allMovies});
					})
				});
			})
		};

		showComments();
	}
});

module.exports = router;
