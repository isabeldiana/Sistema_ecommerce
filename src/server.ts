import dotenv from 'dotenv';
import  express  from 'express';
import cors from 'cors';
import router from './routes/routes';
dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use(router);

app.listen(process.env.PORT);
