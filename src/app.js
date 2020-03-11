import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import route from './routes';

import './database';

dotenv.config();

const app = express();
app.use('/files', express.static('uploads/temp'));
app.use(express.json());
app.use(cors());

app.use(route);

app.listen(3003);
