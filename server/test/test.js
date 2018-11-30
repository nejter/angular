process.env.NODE_ENV = 'test';

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET movies', () => {
	it('it should GET all movies', (done) => {
		chai.request(app)
			.get('/movies')
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});
});

describe('/GET comments', () => {
	it('it should GET all comments', (done) => {
		chai.request(app)
			.get('/comments')
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});
});

describe('/POST movies', () => {
	it('it should add a movie', (done) => {
		chai.request(app)
			.post('/movies')
			.send({'title': 'red rose'})
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});
});

describe('/POST comments', () => {
		it('it should add a comment to existing movie', (done) => {
			chai.request(app)
				.post('/comments')
				.send({'movieIds' : '232' , 'comment' : 'Batman - that was a movie!',  'addComment' : 'Submit'})
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
});
