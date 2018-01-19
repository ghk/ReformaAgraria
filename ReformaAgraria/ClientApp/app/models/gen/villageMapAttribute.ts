import { BorderSettingProcessStage } from './borderSettingProcessStage';
import { Status } from './status';
import { Coordinate } from './coordinate';
import { Region } from './region';
import { BaseEntity } from './baseEntity';

export interface VillageMapAttribute extends BaseEntity<number> { 
    id?: number;
    size?: number;
    borderSettingProcessStage?: BorderSettingProcessStage;
    borderSettingStatus?: Status;
    attachment?: string;
    fkCoordinateId?: number;
    coordinate?: Coordinate;
    fkRegionId?: string;
    region?: Region;
}
