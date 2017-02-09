
import { Observable } from 'rxjs/Observable';

import { Resource } from './resource';


export class CurrentBonuses extends Resource {
    resource: string = '/api/store/purchase/my';

    constructor(public options: any = null) 
    {
        super();
    }
}
