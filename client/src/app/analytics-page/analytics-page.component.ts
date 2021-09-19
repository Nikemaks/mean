import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subject} from "rxjs/internal/Subject";
import {takeUntil} from "rxjs/operators";
import {Chart, ChartConfiguration, registerables } from "chart.js";

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef!: ElementRef;
  @ViewChild('order') orderRef!: ElementRef;

  destroyed$ = new Subject();
  average!: number;
  pending = true;

  constructor(private analyticsService: AnalyticsService) {
  }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255,99,132)'
    };

    const orderConfig: any = {
      label: 'Выручка',
      color: 'rgb(54,162,235)'
    };

    this.analyticsService.getAnalytis()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: AnalyticsPage) => {
        this.average = res.average;

        gainConfig.labels = res.chart.map(i => i.label);
        gainConfig.data = res.chart.map(i => i.gain);

        orderConfig.labels = res.chart.map(i => i.label);
        orderConfig.data = res.chart.map(i => i.order);

        const gainCtx = this.gainRef.nativeElement.getContext('2d');
        const orderCtx = this.orderRef.nativeElement.getContext('2d');
        gainCtx.canvas.height = '300px';
        orderCtx.canvas.height = '300px';
        Chart.register(...registerables);

        new Chart(gainCtx, createChartConfig(gainConfig));
        new Chart(orderCtx, createChartConfig(orderConfig));

        this.pending = false;
      })
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

function createChartConfig({labels, data, label, color}: any): ChartConfiguration {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          stepped: false,
          fill: false
        }
      ]
    }
  }
}
