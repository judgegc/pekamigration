import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

export class Resource {
    readonly resource: string;
    readonly options: any;

    execute(entryPoint: string, transport: Http | SocketIOClient.Socket): Observable<any> {
        return transport instanceof Http ? this.post(entryPoint, transport) : this.send(entryPoint, transport);
    }

    pack(): any[]
    {
        return [this.resource, this.options];
    }

    private post(entryPoint: string, http: Http): Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/json' });

        let requestOptions = new RequestOptions({ headers: headers });

        return http.post(entryPoint + this.resource, this.options, requestOptions)
            .map((res: Response) => { return res.json() })
            .catch(this.handleError);
    }

    private send(entryPoint: string, ws: SocketIOClient.Socket): Observable<any> {

        return new Observable(observer => {
            ws.emit(this.resource, this.options, (data) => {
                observer.next(data);
                observer.complete();
            });
        });
    }

    private handleError(err: any, caught: Observable<any>): any {
        console.log(err);
    }
}
