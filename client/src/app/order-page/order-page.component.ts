import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/services/material.service";
import {OrderService} from "../shared/services/order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit, OnDestroy {

  @ViewChild('modal') modalRef!: ElementRef;
  modal!: MaterialInstance;

  isRoot: boolean = true;
  pending = false;
  destroyed$ = new Subject();

  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersService) {
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    })
  }

  open() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.pending = true;
    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      })
    }
    this.ordersService.create(order)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((newOrder) => {
          MaterialService.toast(`Заказ №${newOrder.order} был добавлен`);
          this.order.clear();
        },
        error => MaterialService.toast(error.error.message),
        () => {
          this.modal.close()
          this.pending = false;
        });
  }

  removePosition(item: OrderPosition) {
    this.order.remove(item);
  }
}
