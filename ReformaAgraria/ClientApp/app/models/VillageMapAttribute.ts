import { BorderSettingProcessStage } from './BorderSettingProcessStage';
import { Status } from './Status';
import { Coordinate } from './Coordinate';
import { Region } from './Region';
import { BaseEntity } from './BaseEntity';

export interface VillageMapAttribute extends BaseEntity<number> { 
	id: number;
	size: number;
	borderSettingProcessStage: BorderSettingProcessStage;
	borderSettingStatus: Status;
	attachment: string;
	fkCoordinateId: number;
	coordinate: Coordinate;
	fkRegionId: string;
	region: Region;
}
