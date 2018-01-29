import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'translate',
    pure: true
})
export class TranslatePipe implements PipeTransform {
    transform(value, args: string[]): any {
        switch(value) {
            case 'Uneducated':
                return 'Tidak Sekolah';
            case 'ElementarySchool':
                return 'SD dan Sederajat';
            case 'JuniorHighSchool':
                return 'SMP dan Sederajat';
            case 'SeniorHighSchool':
                return 'SMA dan Sederajat';
            case 'BachelorDegree':
                return 'S1';
            case 'MasterDegree':
                return 'S2';
            case 'DoctorateDegree':
                return 'S3';
            case 'Male':
                return 'Pria';
            case 'Female':
                return 'Wanita';
            case 'Government':
                return 'Pemerintah';
            case 'Private':
                return 'Swasta';
            case 'Gift':
                return 'Pemberian';
            case 'Inheritance':
                return 'Warisan';
            case 'Flat':
                return 'Datar';
            case 'Sloping':
                return 'Landai';
            case 'Hill':
                return 'Perbukitan';
            case 'Mountain':
                return 'Pegunungan';
            case 'Single':
                return 'Belum Menikah';
            case 'Married':
                return 'Menikah';
            case 'Divorced':
                return 'Cerai';
            case 'ReleaseOfForestArea':
                return 'Pelepasan Area Hutan';
            case 'CustomaryForest':
                return 'Hutan Adat';
            case 'RedistributionOfLand':
                return 'Redistribusi Lahan';
            case 'LegalizationOfAssets':
                return 'Legalisasi Aset';
            case 'Forest':
                return 'Hutan';
            case 'NonForest':
                return 'Non Hutan';
            case 'Proposal':
                return 'Pengajuan';
            case 'Verification':
                return 'Verifikasi';
            case 'Act':
                return 'Penetapan';
            case 'Identification':
                return 'Identifikasi';
            case 'DeliberationWithinVillage':
                return 'Musyawarah Desa';
            case 'DeliberationAmongVillages':
                return 'Musyawarah Antar Desa';
            case 'CoordinationMeetingRaTaskForce':
                return 'Rapat Koordinasi Gugus Tugas RA';
            case 'ProposalOfObjectSubjectToraAct':
                return 'Pengajuan Penetapan Objek Subjek Tora';
            case 'PublicationOfPermissionFromAtrbpnOrLhk':
                return 'Publikasi Izin dar Atrbpn atau Lhk';
            case 'Others':
                return 'Lainnya';
            case 'NotSpecified':
                return 'Tidak Disebutkan';
            default:
                return value;                
        }
    }
}