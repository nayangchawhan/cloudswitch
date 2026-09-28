const request = require('supertest');
const { app } = require('../src/server');

describe('Health Endpoints', () => {
  it('should return 200 for /api/v1/health', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status');
  });

  it('should return 200 for /api/v1/health/live', async () => {
    const res = await request(app).get('/api/v1/health/live');
    expect(res.statusCode).toEqual(200);
  });

  it('should return 200 for /api/v1/health/ready', async () => {
    const res = await request(app).get('/api/v1/health/ready');
    expect(res.statusCode).toEqual(200);
  });
});
