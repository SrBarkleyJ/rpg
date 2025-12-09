require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('./middleware/rateLimit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const progressRoutes = require('./routes/progressRoutes');
const statsRoutes = require('./routes/statsRoutes');
const combatRoutes = require('./routes/combatRoutes');
const skillRoutes = require('./routes/skillRoutes');
const forgeRoutes = require('./routes/forgeRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI);

app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use('/images', express.static(path.join(__dirname, '../public/images')));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use(rateLimit);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/user', progressRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/combat', combatRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/forge', forgeRoutes);

app.get('/', (req, res) => res.send({ status: 'ok', env: process.env.NODE_ENV }));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT} and accessible via LAN`));

