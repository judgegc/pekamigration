import { Owner } from './owner.interface';

export interface Stream {
    active: boolean;
    category: any;
    hidden: boolean;
    id: number;
    name: string;
    online: boolean;
    owner: Owner;
    promoted: boolean;
    rating: number;
    restream: boolean;
    selected: number;
    slug: string;
    start_at: number;
    thumbnail: string;
    tv: boolean;
}
