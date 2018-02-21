import { Region } from './region';

export interface DashboardDataViewModel { 
    region?: Region;
    totalSize?: number;
    totalToraObjects?: number;
    totalToraSubjects?: number;
    totalProposedObjects?: number;
    totalVerifiedObjects?: number;
    totalActualizedObjects?: number;
}
