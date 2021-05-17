import { HttpTransmitter } from "./base/Http";
import { Ajax } from "./base/Ajax";
import { HighHttp } from "./high-base/HighHttp";
import { VoyoBasePlugin } from "./plugins/VoyoBasePlugin";

export interface VoyoHttpOptions {
  transmitter?: HttpTransmitter;
}

export class VoyoHttp extends HighHttp {
  constructor({ transmitter = new Ajax() }: VoyoHttpOptions) {
    super();
    this.setTransmitter(transmitter);
    this.addPlugin(new VoyoBasePlugin());
  }
}
