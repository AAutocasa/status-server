import { MQTTQoS, MQTTRouter, MQTTSubscriptionOptions } from "../mqtt";
import { DeviceService } from "../services";
import { DeviceHeartbeat } from "../types";

export const DeviceMQTT = (router: MQTTRouter, deviceSvc: DeviceService): void => {
    const prefix = `[DeviceMQTT]`;

    router.onReceive('status/heartbeat', 
                    <MQTTSubscriptionOptions>{ qos: MQTTQoS.AT_MOST_ONCE, nl: true }, 
                    (payload) => {
        // Use Heartbeat to log device tick on the service
        console.log(`${prefix} Topic 'status/heartbeat' called with payload ${payload}`);
        const heartbeat = <DeviceHeartbeat>JSON.parse(payload);
        deviceSvc.ProcessHeartbeat(heartbeat);
    })

}