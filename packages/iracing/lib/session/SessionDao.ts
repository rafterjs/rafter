// @ts-nocheck
import { getInstance, JsIrSdk, SessionInfo } from 'node-irsdk';

export interface ISessionDao {
  getInfo(): SessionInfo | undefined;
}

export default class SessionDao implements ISessionDao {
  private readonly irsdk: JsIrSdk;

  private info?: SessionInfo;

  private isWatching?: string;

  constructor(irsdk: JsIrSdk) {
    const irsdk2 = getInstance();

    irsdk2.on('SessionInfo', event => {
      console.log('------------------------update');
      console.log(event);
    });
  }

  public watchForUpdates(): void {
    const irSdk = getInstance();
    console.log('------------------------1', irSdk === this.irsdk);

    if (!this.isWatching) {
      this.isWatching = irSdk.on('SessionInfo', event => {
        console.log('------------------------update');
        console.log(event);
      });
      console.log('------------------------2', this.irsdk._events);
      console.log('------------------------now watching');
    }
  }

  public unWatch(): void {
    if (this.isWatching) {
      this.isWatching.removeAllListeners();
    }
  }

  public getInfo(): SessionInfo | undefined {
    return this.info;
  }

  public setInfo(info: SessionInfo | undefined): void {
    this.info = info;
  }
}
