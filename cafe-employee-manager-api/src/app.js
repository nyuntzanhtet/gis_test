const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const cafeRoutes = require('./routes/cafes');
const employeeRoutes = require('./routes/employees');
const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use('/cafes', cafeRoutes);
app.use('/employees', employeeRoutes);

app.options('*', cors()); // Handle OPTIONS requests

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
