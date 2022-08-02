const request = require('supertest')('http://localhost:3000');
const expect = require('chai').expect;

describe ('requests for reviews', function() {
  it('should return a 200 status when submitting a GET request to /reviews', async function() {
    const response = await request.get('/reviews');
    expect(response.status).to.equal(200);
  });
})