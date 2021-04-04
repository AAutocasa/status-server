const mqtt = require('mqtt');
import e from "express";
import { MQTTRouter, MQTTPublishOptions } from ".";

export class MQTTManager {
    readonly prefix = `[MQTTManager]`;

    constructor(router: MQTTRouter,
        host: string,
        username?: string,
        password?: string) { 
            const hostWithProtocol = `mqtt://${host}`

            if (username || password) {
                console.log(`${this.prefix} Connecting to host ${host} with username ${username} and password ${password}`);
                this.mqttClient = mqtt.connect(hostWithProtocol, { username: username, password: password })
            } else {
                console.log(`${this.prefix} Connecting to host ${host} with no user info`);
                this.mqttClient = mqtt.connect(hostWithProtocol)
            }
            
            // Mqtt error calback
            this.mqttClient.on('error', (err: any) => {
                console.log(`${this.prefix} Error: ${err}`);
                this.mqttClient.end();
            });
        
            // Connection callback
            this.mqttClient.on('connect', () => {
                console.log(`${this.prefix} Client connected!`);

                // Subscribe to each route
                router.routes.forEach(r => {
                    console.log(`   ${this.prefix} Subscribing to ${r.topic}`);
                    this.mqttClient.subscribe(r.topic, r.options);
                })
            });

            this.mqttClient.on('close', () => {
                console.log(`${this.prefix} Client disconnected!`);
            });
        
            this.mqttClient.on('message', (topic: string, payload: any) => {
                // Use router to find out who to call
                router.redirect(topic, payload);
            });
            
        } 

    mqttClient: any

    publish(topic: string, payload: any, options: MQTTPublishOptions) {
        this.mqttClient.publish(topic, payload, options)
    }

}