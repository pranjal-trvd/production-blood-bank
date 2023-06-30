const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')
const path = require('path');


//dotenv config
dotenv.config()

//mongoDB connection
connectDB();

//Rest Object
const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//routes
app.use('/api/v1/test', require('./routes/testRoute'))
app.use('/api/v1/auth', require('./routes/authRoutes'))
app.use('/api/v1/inventory', require('./routes/inventoryRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

//static files
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

//Port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server is running")
})