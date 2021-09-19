import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Observable} from "rxjs/internal/Observable";
import {OverviewPage} from "../shared/interfaces";
import {MaterialInstance, MaterialService} from "../shared/services/material.service";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef!: ElementRef;

  tapTarget!: MaterialInstance;

  constructor(private overviewService: AnalyticsService) {
  }

  data$: Observable<OverviewPage> = this.overviewService.getOverview();

  yesterday: Date = new Date();

  ngOnInit(): void {
    this.yesterday.setDate(this.yesterday.getDate() - 1);

  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }


  openInfo() {
    this.tapTarget.open();
  }
}
