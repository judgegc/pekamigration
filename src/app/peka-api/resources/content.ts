
import { Observable } from 'rxjs/Observable';

import { Resource } from './resource';


export class Content extends Resource {
    resource: string = '/api/content';

    constructor(public options: {
        content: string;
        type: string;
        category: {
            id?: number;
            slug?: string;
        }
    }) 
    {
        super();
    }
}
