import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { PersilSummaryViewModel } from "../models/gen/persilSummaryViewModel";

import { SharedService } from '../services/shared';
import { ToraObjectService } from "../services/gen/toraObject";
import { RegionService } from "../services/gen/region";

import * as $ from 'jquery';
import Chart from 'chart.js'

@Component({
    selector: 'ra-tora-header',
    templateUrl: '../templates/toraHeader.html',
})
export class ToraHeaderComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    stagesSubscription: Subscription;
    regionSubscription: Subscription;
    toraSummary: any[];
    totalObjects: number;
    totalSubjects: number;
    totalSize: number;
    totalProposedObjects: number;
    totalVerifiedObjects: number;
    totalActualizedObject: number;
    loading: boolean = false;
    ctx: any;
    persilSummaries: PersilSummaryViewModel = {};

    constructor(
        private sharedService: SharedService,
        private toraObjectService: ToraObjectService,
        private regionService: RegionService,
        private elementRef: ElementRef
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.sharedService.setSummaryStatus('0');
        this.subscription = this.sharedService.getToraSummary().subscribe(data => {
            this.toraSummary = data;
            this.totalObjects = 0;
            this.totalSubjects = 0;
            this.totalSize = 0;
            this.totalProposedObjects = 0;
            this.totalVerifiedObjects = 0;
            this.totalActualizedObject = 0;
            this.persilSummaries.totalTransmigrasi = 0;
            this.persilSummaries.totalProna = 0;
            this.persilSummaries.totalKonflik = 0;
            this.persilSummaries.totalTerlantar = 0;
            this.persilSummaries.totalPelepasan = 0;
            this.persilSummaries.totalAdat = 0;
            this.persilSummaries.totalDesa = 0;
            this.persilSummaries.totalTanamanRakyat = 0;
            this.persilSummaries.totalKemasyarakatan = 0;
            this.persilSummaries.totalKemitraan = 0;

            for (var i = 0; i < this.toraSummary.length; i++) {
                this.totalObjects += this.toraSummary[i].totalToraObjects;
                this.totalSubjects += this.toraSummary[i].totalToraSubjects;
                this.totalSize += this.toraSummary[i].totalSize;
                this.totalProposedObjects += this.toraSummary[i].totalProposedObjects;
                this.totalVerifiedObjects += this.toraSummary[i].totalVerifiedObjects;
                this.totalActualizedObject += this.toraSummary[i].totalActualizedObjects;
                this.persilSummaries.totalTransmigrasi += this.toraSummary[i].totalTransmigrasi;
                this.persilSummaries.totalProna += this.toraSummary[i].totalProna;
                this.persilSummaries.totalKonflik += this.toraSummary[i].totalKonflik;
                this.persilSummaries.totalTerlantar += this.toraSummary[i].totalTerlantar;
                this.persilSummaries.totalPelepasan += this.toraSummary[i].totalPelepasan;
                this.persilSummaries.totalAdat += this.toraSummary[i].totalAdat;
                this.persilSummaries.totalDesa += this.toraSummary[i].totalDesa;
                this.persilSummaries.totalTanamanRakyat += this.toraSummary[i].totalTanamanRakyat;
                this.persilSummaries.totalKemasyarakatan += this.toraSummary[i].totalKemasyarakatan;
                this.persilSummaries.totalKemitraan += this.toraSummary[i].totalKemitraan;
            }

            this.loading = false;
            this.getCharts(this.persilSummaries);
        });
    }

    getCharts(persilSummaries: PersilSummaryViewModel): void {
        if (document.getElementById("toraChart") != null && document.getElementById("psChart") != null) {
            var ctxTora = document.getElementById("toraChart");
            var toraChart = new Chart(ctxTora, {
                type: 'horizontalBar',
                data: {
                    labels: ["Legalisasi Tanah Transmigrasi", "PRONA", "Penyelesaian Konflik Lahan", "HGU Terlantar dan Tanah Terlantar", "Pelepasan Kawasan Hutan"],
                    datasets: [{
                        label: 'TORA',
                        data: [persilSummaries.totalTransmigrasi, persilSummaries.totalProna, persilSummaries.totalKonflik, persilSummaries.totalTerlantar, persilSummaries.totalPelepasan],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                }
            });

            var ctxPs = document.getElementById("psChart");
            var psChart = new Chart(ctxPs, {
                type: 'horizontalBar',
                data: {
                    labels: ["Hutan Adat", "Hutan Desa", "Hutan Tanaman Rakyat", "Hutan Kemasyarakatan", "Kemitraan"],
                    datasets: [{
                        label: 'PS',
                        data: [persilSummaries.totalAdat, persilSummaries.totalDesa, persilSummaries.totalTanamanRakyat, persilSummaries.totalKemasyarakatan, persilSummaries.totalKemitraan],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                }
            });
        }
        else {
            window.setTimeout(this.getCharts(persilSummaries), 10000);
        }
    }

    onDivClicked(status: string): void {
        $('.clickable-div-2').removeClass('active-div');
        $('.clickable-div-2').removeClass('clickable-div');
        $('.clickable-div-2').addClass('clickable-div');
        $('#' + status).removeClass('clickable-div');
        $('#' + status).addClass('active-div');

        if (status == 'divVerification') {
            this.sharedService.setSummaryStatus('1');
        } else if (status == 'divActualization') {
            this.sharedService.setSummaryStatus('2');
        } else {
            this.sharedService.setSummaryStatus('0');
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}