import express from 'express'
import dotenv from 'dotenv'
import { DeviceRouter } from './routes';
import { DeviceService } from './services';
import { RuntimeDBManager } from './data-access';

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/', router);

DeviceRouter(router, new DeviceService(new RuntimeDBManager()));

app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT}`);
})