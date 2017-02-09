
import { Observable } from 'rxjs/Observable';

import { Resource } from './resource';


export class ViewersList extends Resource {
    resource: string = '/chat/channel/list';

    constructor(public options: {channel: string}) 
    {
        super();
    }
}
