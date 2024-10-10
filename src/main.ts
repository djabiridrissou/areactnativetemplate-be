import express, { Request, Response } from 'express';
import connectDB from './configs/db';
import passport from 'passport';
import passportConfig from './configs/passport';
import authRoutes from './api/auth/auth';
import cors from 'cors';
import { NextFunction } from 'express';

const allowedOrigins = process.env.ORIGINS!.split(',');

const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
};


const app = express();
const port = 8787;

connectDB();
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
app.get('/', (req: Request, res: Response) => {
    res.send('Areact Native Template!');
});

app.use(express.json());
app.use(passport.initialize());
app.use(cors(corsOptions));

passportConfig(passport);
app.use('/api/auth', authRoutes);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(400).json({ msg: err.message || 'Something went wrong' });
});