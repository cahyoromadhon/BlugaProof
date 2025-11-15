import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sponsorRoute from './routes/sponsor';
import sponsorCompleteRoute from './routes/sponsorComplete';
import notarizeRoute from './routes/notarize';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', sponsorRoute);
app.use('/api', sponsorCompleteRoute);
app.use('/api', notarizeRoute);

app.get('/', (req, res) => {
    res.json({ message: 'Backend OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
