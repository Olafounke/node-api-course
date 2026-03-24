require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express'); 
const swaggerSpec = require('./src/docs/swagger'); 
const config = require('./src/config/env');

const authRoutes = require('./src/routes/auth');
const booksRoutes = require('./src/routes/books');
const { errorHandler, notFound } = require('./src/middlewares/errorHandler');

const app = express();


app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet());
app.use(cookieParser());

// cors
const corsOptions = {
    origin: config.NODE_ENV === 'production' ? config.ALLOWED_ORIGINS : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// helmet
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// rate limit
const globalLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW,
    max: 100,
    message: { error: 'Trop de requêtes. Réessayez dans 15 minutes.' }
});
app.use(globalLimiter);

const authLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW,
    max: 10, 
    message: { error: "Trop de tentatives, réessayez plus tard" },
    skipSuccessfulRequests: true
});

// routes
app.get('/', (req, res) => res.json({ message: "Bienvenue sur l'API Bibliothèque !" }));

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes); 

// swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// erreurs
app.use(notFound);
app.use(errorHandler);

module.exports = app;