const express = require('express');
const cors = require('cors');
const skillsRouter = require('./routes/skills');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/skills', skillsRouter);

app.listen(PORT, () => {
  console.log(`Sovereign Skills server running on port ${PORT}`);
});

module.exports = app;
