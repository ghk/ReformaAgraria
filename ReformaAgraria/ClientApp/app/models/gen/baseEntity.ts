

export interface BaseEntity<TId> { 
    id: TId;
    dateCreated?: Date;
    dateModified?: Date;
}
