import { ToraSettingProcessStage } from './toraSettingProcessStage';
import { Status } from './status';
import { Coordinate } from './coordinate';
import { Region } from './region';
import { BaseEntity } from './baseEntity';

export interface ToraMapAttribute extends BaseEntity<number> { 
    id?: number;
    size?: number;
    toraSettingProcessStage?: ToraSettingProcessStage;
    borderSettingStatus?: Status;
    attachment?: string;
    fkCoordinateId?: number;
    coordinate?: Coordinate;
    fkRegionId?: string;
    region?: Region;
}
