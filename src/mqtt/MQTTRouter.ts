import { MQTTRedirection, MQTTSubscriptionOptions } from ".";

export class MQTTRouter {

    private _routes: MQTTRedirection[] = [];

    public get routes(): MQTTRedirection[] {
        return this._routes;
    }

    public onReceive(topic: string, options: MQTTSubscriptionOptions, action: (payload: any) => void) {
        const redirection = <MQTTRedirection>{ topic, options, redirection: action }
        this._routes.push(redirection);
    }

    public redirect(topic: string, payload: any) {
        this._routes
            .filter(r => this._checkTopicMatch(topic, r))
            .forEach(r => r.redirection(payload));
    }

    private _checkTopicMatch(topic: string, redirection: MQTTRedirection): boolean {
        // Can be improved to use wildcards
        return topic == redirection.topic
    }

}