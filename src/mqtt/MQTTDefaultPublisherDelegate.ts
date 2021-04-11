import {  MQTTPublisher } from ".";
import { MQTTPublishOptions, MQTTPublisherDelegate } from '.';

export class MQTTDefaultPublisherDelegate implements MQTTPublisherDelegate {
    readonly prefix = "[MQTTDefaultPublisherDelegate]";

    constructor() { }

    _mqttManager?: MQTTPublisher;

    public set mqttManager(mqttManager: MQTTPublisher) {
        this._mqttManager = mqttManager;
    }

    publish(topic: string, payload: string, options: MQTTPublishOptions): void {
        console.log(`   ${this.prefix} Publish called to topic ${topic}. Payload ${payload} and options:`);
        console.log(options);
        if (this._mqttManager) {
            this._mqttManager.publish(topic, payload, options);
        }
    }

    publishJSON(topic: string, payload: Record<string, any>, options: MQTTPublishOptions): void {
        this.publish(topic, JSON.stringify(payload), options);
    }
    
}