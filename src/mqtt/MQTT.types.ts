import { MQTTManager } from ".";

export type MQTTPublishOptions = {
    /** At most once (0)
        At least once (1)
        Exactly once (2). */
    qos?: number,
    retain?: boolean,
    dup?: boolean
};

export type MQTTSubscriptionOptions = {
    /** At most once (0)
        At least once (1)
        Exactly once (2). */
    qos?: number,

    /** (If the value is true, Application Messages MUST NOT be forwarded to a connection with a 
     * ClientID equal to the ClientID of the publishing connection) */
    nl?: boolean
};

export type MQTTRedirection = {
    topic: string,
    options: MQTTSubscriptionOptions,
    redirection: (payload: any) => void
};

export interface MQTTPublisher {
    publish(topic: string, payload: string, options: MQTTPublishOptions): void;
    publishJSON(topic: string, payload: Record<string, any>, options: MQTTPublishOptions): void;
}

/** The publisher delegate relays messages  */
export interface MQTTPublisherDelegate extends MQTTPublisher {
    _mqttManager?: MQTTPublisher;
    mqttManager: MQTTPublisher;
}