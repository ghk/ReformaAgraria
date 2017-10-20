import { ToraSettingProcessStage } from './ToraSettingProcessStage';
import { Status } from './Status';
import { Coordinate } from './Coordinate';
import { Region } from './Region';
import { BaseEntity } from './BaseEntity';

export interface ToraMapAttribute extends BaseEntity<number> { 
	id: number;
	size: number;
	toraSettingProcessStage: ToraSettingProcessStage;
	borderSettingStatus: Status;
	attachment: string;
	fkCoordinateId: number;
	coordinate: Coordinate;
	fkRegionId: string;
	region: Region;
}
