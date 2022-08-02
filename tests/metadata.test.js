const request = require('supertest')('http://localhost:3000');
const expect = require('chai').expect;

describe ('GET metadata', function() {
  it('should return a 200 status when submitting a GET request to /reviews/meta', async function() {
    const response = await request.get('/reviews/meta');
    expect(response.status).to.equal(200);
  });
})