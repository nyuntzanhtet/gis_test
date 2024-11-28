const pool = require('./pool');
const { v4: uuidv4 } = require('uuid');

(async () => {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cafes (
        id UUID PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(100) NOT NULL,
        logo TEXT
      );

      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(10) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email_address VARCHAR(100) NOT NULL,
        phone_number VARCHAR(8) NOT NULL,
        gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
        start_date DATE NOT NULL,
        cafe_id UUID REFERENCES cafes(id) ON DELETE CASCADE
      );
    `);

    // Insert seed data for cafes
    const cafe1 = uuidv4();
    const cafe2 = uuidv4();
    await pool.query(`
      INSERT INTO public."Cafe" (id, name, description, location, logo)
      VALUES
        ($1, 'Cafe One', 'A cozy little cafe.', 'Downtown', null),
        ($2, 'Cafe Two', 'Spacious cafe with great ambiance.', 'Uptown', null)
      ON CONFLICT DO NOTHING;
    `, [cafe1, cafe2]);

    // Insert seed data for employees
    await pool.query(`
      INSERT INTO public."Employee" (id, name, email_address, phone_number, gender, start_date, cafe_id)
      VALUES
        ('UI1234567', 'John Doe', 'john.doe@example.com', '81234567', 'Male', '2022-01-01', $1),
        ('UI7654321', 'Jane Smith', 'jane.smith@example.com', '91234567', 'Female', '2023-01-01', $2)
      ON CONFLICT DO NOTHING;
    `, [cafe1, cafe2]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
})();
