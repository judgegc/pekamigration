import { Observable } from 'rxjs/Observable';

import { Resource } from './resource';


export class JoinChat extends Resource {
    resource: string = '/chat/join';

    constructor(public options: {channel: string}) 
    {
        super();
    }
}
