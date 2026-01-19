const express = require('express');
const cors = require('cors');

const downloadRoutes = require('./Routes/DownloadRouter.js');
const logger = require('./Utils/Logger.js');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', downloadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
