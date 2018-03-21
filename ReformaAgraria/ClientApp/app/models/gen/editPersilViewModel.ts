import { Status } from './status';

export interface EditPersilViewModel { 
    persilId?: number;
    persilStatus?: Status;
    persilTotalSize?: number;
    persilTotalSubject?: number;
    file?: File;
}
