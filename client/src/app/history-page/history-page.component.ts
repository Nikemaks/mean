import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/services/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subject} from "rxjs/internal/Subject";
import {takeUntil} from "rxjs/operators";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tooltip') tooltipRef!: ElementRef;
  tooltip!: MaterialInstance;
  isFilterVisible = false;
  destroyed$ = new Subject();
  orders: Order[] = [];

  loading = false;
  reloading = false;
  noMoreOrders = false;
  filter: Filter = {};

  offset = 0;
  limit = STEP;

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit(): void {
    this.reloading = true;
    this.fetch();
  }

  private fetch() {
    this.loading = true;
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });
    this.ordersService.fetch(params)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(orders => {
        this.orders = this.orders.concat(orders);
        this.noMoreOrders = orders.length < STEP;
        this.loading = false;
        this.reloading = false;
      });
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  loadMore() {
    this.offset += STEP;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.reloading = true;
    this.filter = filter;

    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }
}
