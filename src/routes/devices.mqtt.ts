import { MQTTRouter, MQTTSubscriptionOptions } from "../mqtt";
import { DeviceService } from "../services";
import { Heartbeat } from "../types";

export const DeviceMQTT = (router: MQTTRouter, deviceSvc: DeviceService): void => {
    const prefix = `[DeviceMQTT]`;

    router.onReceive('status/heartbeat', 
                    <MQTTSubscriptionOptions>{ qos: 0, nl: true }, 
                    (payload) => {
        // Use Heartbeat to log device tick on the service
        console.log(`${prefix} Topic 'status/heartbeat' called with payload ${payload}`);
        const heartbeat = <Heartbeat>JSON.parse(payload);
        deviceSvc.TriggerHeartbeat(heartbeat);
    })

}