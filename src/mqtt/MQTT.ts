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