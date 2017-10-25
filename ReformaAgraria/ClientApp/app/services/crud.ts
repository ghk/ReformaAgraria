import { Query } from '../models/query';
import { Observable } from 'rxjs';

export interface CrudService<TModel, TId> {
    getAll(query: Query, progressListener: any) : Observable<Array<TModel>>;
    count(query: Query, progressListener: any) : Observable<number>;
    getById(id: TId, progressListener: any): Observable<TModel>;
    createOrUpdate?(model: TModel, progressListener: any): Observable<number>;
    create?(model: TModel, progressListener: any) : Observable<number>;
    update?(model: TModel, progressListener: any) : Observable<number>;
    deleteById?(id: TId, progressListener: any) : Observable<number>;
}