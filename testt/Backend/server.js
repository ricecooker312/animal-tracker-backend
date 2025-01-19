require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const authRoutes = require('./routes/auth');
const animalRoutes = require('./API/routes/animals');
const imageRoutes = require('./API/routes/images');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}))
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

