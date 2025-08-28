const request = require('supertest');
const app = require('../index.js');

describe('Pantry API', () => {
  describe('GET /api/pantry', () => {
    it('should return all pantry items', async () => {
      const response = await request(app)
        .get('/api/pantry')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('POST /api/pantry', () => {
    it('should create a new pantry item', async () => {
      const newItem = {
        name: 'Test Item',
        quantity: 1,
        unit: 'piece',
        notes: 'Test notes'
      };

      const response = await request(app)
        .post('/api/pantry')
        .send(newItem)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.quantity).toBe(newItem.quantity);
    });

    it('should return 400 if name is missing', async () => {
      const invalidItem = {
        quantity: 1
      };

      await request(app)
        .post('/api/pantry')
        .send(invalidItem)
        .expect(400);
    });

    it('should return 400 if quantity is 0 or negative', async () => {
      const invalidItem = {
        name: 'Test Item',
        quantity: 0
      };

      await request(app)
        .post('/api/pantry')
        .send(invalidItem)
        .expect(400);
    });
  });

  describe('PATCH /api/pantry/:id', () => {
    let itemId;

    beforeEach(async () => {
      const newItem = {
        name: 'Test Item for Update',
        quantity: 1
      };

      const response = await request(app)
        .post('/api/pantry')
        .send(newItem);
      
      itemId = response.body.id;
    });

    it('should update an existing item', async () => {
      const updates = {
        name: 'Updated Item',
        quantity: 2
      };

      const response = await request(app)
        .patch(`/api/pantry/${itemId}`)
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe(updates.name);
      expect(response.body.quantity).toBe(updates.quantity);
    });

    it('should return 404 for non-existent item', async () => {
      await request(app)
        .patch('/api/pantry/999999')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/pantry/:id', () => {
    let itemId;

    beforeEach(async () => {
      const newItem = {
        name: 'Test Item for Delete',
        quantity: 1
      };

      const response = await request(app)
        .post('/api/pantry')
        .send(newItem);
      
      itemId = response.body.id;
    });

    it('should delete an existing item', async () => {
      await request(app)
        .delete(`/api/pantry/${itemId}`)
        .expect(204);

      // Verify item is deleted
      await request(app)
        .get(`/api/pantry/${itemId}`)
        .expect(404);
    });

    it('should return 404 for non-existent item', async () => {
      await request(app)
        .delete('/api/pantry/999999')
        .expect(404);
    });
  });
});