const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust the path if necessary
const { assert } = chai;

chai.use(chaiHttp);

suite('API ROUTING FOR /api/threads/{board}', function () {
  suite('POST /api/threads/{board}', function () {
    test('Creating a new thread', function (done) {
      chai.request(server)
      .post('/api/threads/test') // Adjust the board name as needed
      .send({ text: 'Test thread', delete_password: 'pass123' })
      .end(function (err, res) {
        if (err) return done(err);
        assert.equal(res.status, 302); // Expect a redirect
        assert.match(res.redirects[0], /\/b\/test$/, 'Redirect should go to /b/test');
        done();
      });
    
    });
  });
});
