import { HttpTransmitter } from "./base/Http";
import { HighHttp } from "./high-base/HighHttp";
export interface VoyoHttpOptions {
    transmitter?: HttpTransmitter;
}
export declare class VoyoHttp extends HighHttp {
    constructor({ transmitter }: VoyoHttpOptions);
}
