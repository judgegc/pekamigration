import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';

import { Content } from './resources/content';
import { ViewersList } from './resources/viewers-list';
import { Bulk } from './resources/bulk';
import { CurrentBonuses } from './resources/currentbonuses';

@Injectable()
export class PekaApiService {

  private static readonly httpEntryPoint: string = 'https://funstream.tv';
  private static readonly wsEntryPoint = 'wss://chat.peka2.tv';

  private ws: SocketIOClient.Socket;

  constructor(private http: Http) {}

  private get socket(): SocketIOClient.Socket
  {

    if(this.ws == null)
    {
      this.ws = io.connect(PekaApiService.wsEntryPoint, {
            transports: ['websocket'],
            path: '/',
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionDelayMax: 2000,
            reconnectionAttempts: Infinity
        });
    }

    return this.ws;
  }

  public getStreams(): Observable<any>
  {
    return new Content({content: 'stream', type: 'all', category: {id: 1}})
    .execute(PekaApiService.httpEntryPoint, this.http);
  }

  public getViewers(channelId: string | number): Observable<any>
  {
    return new ViewersList({channel: 'stream/' + channelId})
    .execute(PekaApiService.wsEntryPoint, this.socket);
  }

  public bulk(commands: {command: any[]})
  {
    return new Bulk(commands)
    .execute(PekaApiService.httpEntryPoint, this.http);
  }

  public currentBonuses()
  {
    return new CurrentBonuses()
    .execute(PekaApiService.wsEntryPoint, this.socket);
  }

}
