import express from 'express'
import dotenv from 'dotenv'

import { DeviceRouter, DeviceMQTT } from './routes';
import { DeviceService, CapabilityService } from './services';
import { FileDeviceDBManager, RuntimeCapabilityDBManager } from './data-access';
import { MQTTManager, MQTTRouter, MQTTDefaultPublisherDelegate } from './mqtt';
import { AuthMiddleware, LoggerMiddleware } from './middlewares';

dotenv.config();

const app = express();
const router = express.Router();

// Setup middlewares
app.use(AuthMiddleware([process.env.API_KEY]))
app.use(LoggerMiddleware())

// Server setup
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/', router);

// MQTT Publisher setup
const publisher = new MQTTDefaultPublisherDelegate()

// Services setup
const capabiltySvc = new CapabilityService(new RuntimeCapabilityDBManager())
const deviceSvc = new DeviceService(new FileDeviceDBManager(`./data/devices.json`), publisher, capabiltySvc);

// HTTP Routes setup
DeviceRouter(router, deviceSvc);
// FirmwareRouter(router, firmwareSvc);

// MQTT Routes setup
const mqttRouter = new MQTTRouter();
DeviceMQTT(mqttRouter, deviceSvc)

// MQTT setup
const mqttManager = new MQTTManager(mqttRouter,
                                    process.env.MQTT_HOST || 'localhost',
                                    process.env.MQTT_USERNAME,
                                    process.env.MQTT_PASSWORD);

// Sets the PublisherDelegate manager as the manager
publisher.mqttManager = mqttManager;

// Listen
app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT}`);
})