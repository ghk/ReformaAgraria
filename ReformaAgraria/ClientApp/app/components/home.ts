import { Component, OnInit, OnDestroy} from '@angular/core';
import { SharedService } from '../services/shared';
import { ActivatedRoute, Router, } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ra-home',
    templateUrl: '../templates/home.html',
})
export class HomeComponent implements OnInit, OnDestroy {
    subscription: Subscription;

    constructor(
        private sharedService: SharedService,
        private route: ActivatedRoute,
        public router: Router
    ) { }

    ngOnInit(): void {
        this.subscription = this.route.params.subscribe(params => {
            this.sharedService.setRegionId(params['id'] != null ? params['id'] : '72_1');
        });
    }


    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}