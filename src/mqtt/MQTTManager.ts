const mqtt = require('mqtt');
import { MQTTRouter, MQTTPublishOptions } from ".";

export class MQTTManager {
    constructor(router: MQTTRouter,
        host: string,
        username: string,
        password: string) { 
            this.mqttClient = mqtt.connect(host, { username: username, password: password })
            
            // Mqtt error calback
            this.mqttClient.on('error', (err: any) => {
                console.log(`MQTT Error: ${err}`);
                this.mqttClient.end();
            });
        
            // Connection callback
            this.mqttClient.on('connect', () => {
                console.log(`MQTT client connected`);
            });

            this.mqttClient.on('close', () => {
                console.log(`MQTT client disconnected`);
            });
        
            this.mqttClient.on('message', (topic: string, payload: any) => {
                // Use router to find out who to call
                router.redirect(topic, payload);
            });
            
            router.routes.forEach(r => {
                this.mqttClient.subscribe(r.topic, r.options);
            })
        
        } 

    mqttClient: any

    publish(topic: string, payload: any, options: MQTTPublishOptions) {
        this.mqttClient.publish(topic, payload, options)
    }

}