const db = require('../database/queries');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

	const getMovies = () => {
		return new Promise((resolve) => {
			db.getAllMovies(req.next)
				.then(data => {
					resolve(data)
				});
		});
	};

	const showMovies = () => {
		getMovies().then(data => {
			res.render('movies', { moviesdata : data })})};
	showMovies();
});

router.post('/', async (req, res) => {
	db.addMovie(req, res, req.next);
});


module.exports = router;
