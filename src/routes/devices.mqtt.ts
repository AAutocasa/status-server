import { MQTTRouter, MQTTSubscriptionOptions } from "../mqtt";
import { DeviceService } from "../services";

export const DeviceMQTT = (router: MQTTRouter, deviceSvc: DeviceService): void => {

    router.onReceive('hearbeat', <MQTTSubscriptionOptions>{ qos: 2, nl: true }, (payload) => {
        // Use Hearbeat to log device on the service
    })

}