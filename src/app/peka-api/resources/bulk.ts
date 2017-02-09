
import { Observable } from 'rxjs/Observable';

import { Resource } from './resource';


export class Bulk extends Resource {
    resource: string = '/api/bulk';

    constructor(public options: {command: any[]}) 
    {
        super();
    }
}
