const express = require('express');
const bodyParser = require('body-parser');
const cafeRoutes = require('./routes/cafes');
const employeeRoutes = require('./routes/employees');
const cors = require('cors');

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors({
  origin: 'http://localhost:3001', // Allow only your frontend origin
  methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // Allow cookies if needed
}));
app.use('/cafes', cafeRoutes);
app.use('/employees', employeeRoutes);

app.options('*', cors()); // Handle OPTIONS requests

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
