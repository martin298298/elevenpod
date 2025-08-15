const request = require('supertest');
const app = require('../server');

describe('AI Podcast Generator', () => {
    test('GET /api/health should return health status', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'OK');
        expect(response.body).toHaveProperty('services');
    });

    test('GET /api/locations should return array of locations', async () => {
        const response = await request(app).get('/api/locations');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('POST /api/generate-podcast without location should return error', async () => {
        const response = await request(app)
            .post('/api/generate-podcast')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Location is required');
    });

    test('POST /api/generate-podcast with location but no API keys should return error', async () => {
        const response = await request(app)
            .post('/api/generate-podcast')
            .send({ location: 'Paris, France' });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Failed to generate podcast');
    });
});