const dotenv = require('dotenv');

dotenv.config();

const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');

(async () => {
  // Database connection configuration
  const adminPool = new Pool({
    user: process.env.DATABASE_ADMIN_USER,
    password: process.env.DATABASE_ADMIN_PASSWORD,
    database: process.env.DATABASE_ADMIN_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  });
  try {
    //create database
    await adminPool.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1;
    `, [process.env.DATABASE_NAME]);

    await adminPool.query(`DROP DATABASE IF EXISTS ${process.env.DATABASE_NAME}`);

    // Create the new database
    await adminPool.query(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
  } catch (error) {
    console.error('Error creating database:', error);
    return; // Exit if the database creation fails
  } finally {
    await adminPool.end(); // Close the admin pool
  }

  // Database connection configuration
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  });
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cafes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        logo BYTEA
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email_address VARCHAR(100) NOT NULL,
        phone_number VARCHAR(8) NOT NULL,
        gender VARCHAR(1) NOT NULL,
        start_date DATE NOT NULL,
        cafe_id TEXT
      );
    `);

    await pool.query(`
      CREATE SEQUENCE id_sequence
      START 1 -- Start from 1
      INCREMENT BY 1 -- Increment by 1
      MINVALUE 1 -- Minimum value
      MAXVALUE 9999999 -- Maximum value for 7 digits
      CACHE 1;
    `);

    await pool.query(`
      CREATE OR REPLACE FUNCTION generate_custom_id()
      RETURNS TEXT AS $$
      DECLARE
        next_val INTEGER;
        formatted_id TEXT;
      BEGIN
        -- Get the next value from the sequence
        next_val := nextval('id_sequence');

        -- Format the value as "UI" + 7-digit zero-padded number
        formatted_id := 'UI' || LPAD(next_val::TEXT, 7, '0');

        RETURN formatted_id;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }

  const pool1 = new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
  });
  try {
    // Insert seed data for cafes
    const cafe1 = uuidv4();
    const cafe2 = uuidv4();
    await pool1.query(`
      INSERT INTO public."cafes" (id, name, description, location, logo)
      VALUES
        ($1, 'Cafe One', 'A cozy little cafe.', 'Downtown', null),
        ($2, 'Cafe Two', 'Spacious cafe with great ambiance.', 'Uptown', null)
      ON CONFLICT DO NOTHING;
    `, [cafe1, cafe2]);

    // Insert seed data for employees
    await pool1.query(`
      INSERT INTO public."employees" (id, name, email_address, phone_number, gender, start_date, cafe_id)
      VALUES
        ('UI1234567', 'John Doe', 'john.doe@example.com', '81234567', 'M', '2022-01-01', $1),
        ('UI7654321', 'Jane Smith', 'jane.smith@example.com', '91234567', 'F', '2023-01-01', $2)
      ON CONFLICT DO NOTHING;
    `, [cafe1, cafe2]);

    const sequenceCheck = await pool1.query(`
      SELECT 1
      FROM pg_class
      WHERE relname = 'id_sequence'
      AND relkind = 'S';
    `);

    if (sequenceCheck.rowCount === 0) {
      await pool1.query(`
        CREATE SEQUENCE id_sequence
        START 1 -- Start from 1
        INCREMENT BY 1 -- Increment by 1
        MINVALUE 1 -- Minimum value
        MAXVALUE 9999999 -- Maximum value for 7 digits
        CACHE 1;
      `);
    }

    const functionCheck = await pool1.query(`
      SELECT 1
      FROM pg_proc
      WHERE proname = 'generate_custom_id'
      AND pg_function_is_visible(oid);
    `);

    if (functionCheck.rowCount === 0) {
      await pool1.query(`
        CREATE OR REPLACE FUNCTION generate_custom_id()
        RETURNS TEXT AS $$
        DECLARE
          next_val INTEGER;
          formatted_id TEXT;
        BEGIN
          -- Get the next value from the sequence
          next_val := nextval('id_sequence');

          -- Format the value as "UI" + 7-digit zero-padded number
          formatted_id := 'UI' || LPAD(next_val::TEXT, 7, '0');

          RETURN formatted_id;
        END;
        $$ LANGUAGE plpgsql;
      `);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool1.end();
  }
})();
