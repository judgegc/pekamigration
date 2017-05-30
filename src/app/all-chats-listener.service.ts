import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { PekaApiService } from './peka-api/peka-api.service';
import { IMessage } from './peka-api/types/message.interface';

@Injectable()
export class AllChatsListenerService {

  public readonly OnMessage = new Subject();

  private readonly messageResource = '/chat/message';
  private isRunning: boolean = false;

  constructor(private api: PekaApiService) {
  }

  public start() {
    if (this.isRunning)
      return;

    this.api.joinChat('all')
      .subscribe({
        next: resp => {
          if (resp.status === 'ok') {
            this.isRunning = true;
            this.api.socket.on(this.messageResource, (msg: IMessage) => {
              this.OnMessage.next(msg);
            });
          }
        }
      });
  }

  public stop() {
    if (this.isRunning)
      this.api.socket.off(this.messageResource);
  }

}
