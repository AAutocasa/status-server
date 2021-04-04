import express from 'express'
import dotenv from 'dotenv'
import { DeviceRouter, DeviceMQTT } from './routes';
import { DeviceService } from './services';
import { RuntimeDBManager } from './data-access';
import { MQTTManager, MQTTRouter } from './mqtt';

dotenv.config();

const app = express();
const router = express.Router();

// Server setup
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/', router);

// Services setup
const deviceSvc = new DeviceService(new RuntimeDBManager());

// HTTP Routes setup
DeviceRouter(router, deviceSvc);

// MQTT Routes setup
const mqttRouter = new MQTTRouter();
DeviceMQTT(mqttRouter, deviceSvc)

// MQTT setup
const mqttManager = new MQTTManager(mqttRouter,
                                    process.env.MQTT_HOSTNAME || 'localhost',
                                    process.env.MQTT_USERNAME,
                                    process.env.MQTT_PASSWORD);

// Listen
app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT}`);
})