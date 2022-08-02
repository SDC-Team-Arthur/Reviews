const request = require('supertest')('http://localhost:3000');
const expect = require('chai').expect;

describe ('PUT requests', function() {
  it('should return a 200 status when submitting a PUT request to mark helpful', async function() {
    const response = await request.put('/reviews/:review_id/helpful');
    expect(response.status).to.equal(200);
  });

  it('should return a 200 status when submitting a PUT request to report', async function() {
    const response = await request.put('/reviews/:review_id/report');
    expect(response.status).to.equal(200);
  });
})