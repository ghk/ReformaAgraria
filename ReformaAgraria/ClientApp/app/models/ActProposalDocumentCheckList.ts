import { Region } from './Region';
import { BaseEntity } from './BaseEntity';

export interface ActProposalDocumentCheckList extends BaseEntity<number> { 
	id: number;
	proposalFromCommunityList: boolean;
	toraObjectList: boolean;
	toraObjectMap: boolean;
	toraSubjectList: boolean;
	toraObjectForestAreaList: boolean;
	toraObjectForestAreaMap: boolean;
	toraSubjectForestAreaList: boolean;
	psObjectAndCustomaryForestList: boolean;
	psObjectAndCustomaryForestMap: boolean;
	psSubjectAndCustomaryForestList: boolean;
	fkRegionId: string;
	region: Region;
}
