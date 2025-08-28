import db from './database.js';

const sampleItems = [
  {
    name: 'Organic Whole Milk',
    quantity: 2,
    unit: 'liters',
    expiry_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    notes: 'Store in refrigerator'
  },
  {
    name: 'Sourdough Bread',
    quantity: 1,
    unit: 'loaf',
    expiry_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
    notes: 'Great for sandwiches and toast'
  },
  {
    name: 'Extra Virgin Olive Oil',
    quantity: 1,
    unit: 'bottle',
    expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    notes: 'Cold-pressed, perfect for salads'
  },
  {
    name: 'Himalayan Pink Salt',
    quantity: 1,
    unit: 'container',
    expiry_date: null, // No expiry
    notes: 'Premium quality, use sparingly'
  },
  {
    name: 'Free-Range Eggs',
    quantity: 0,
    unit: 'dozen',
    expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    notes: 'Out of stock - need to buy more!'
  },
  {
    name: 'Organic Bananas',
    quantity: 6,
    unit: 'pieces',
    expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    notes: 'Perfect for smoothies and baking. Store at room temperature.'
  }
];

function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');
  
  // Clear existing data
  db.run('DELETE FROM pantry_items', (err) => {
    if (err) {
      console.error('Error clearing database:', err.message);
      return;
    }

    // Insert sample items
    const insertQuery = `
      INSERT INTO pantry_items (name, quantity, unit, expiry_date, notes)
      VALUES (?, ?, ?, ?, ?)
    `;

    let completed = 0;
    sampleItems.forEach((item, index) => {
      db.run(insertQuery, [item.name, item.quantity, item.unit, item.expiry_date, item.notes], function(err) {
        if (err) {
          console.error(`Error inserting item ${index + 1}:`, err.message);
        } else {
          console.log(`✅ Inserted: ${item.name}`);
        }
        
        completed++;
        if (completed === sampleItems.length) {
          console.log('🎉 Database seeding completed!');
          process.exit(0);
        }
      });
    });
  });
}

seedDatabase();