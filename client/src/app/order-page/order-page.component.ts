import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/services/material.service";
import {OrderService} from "../shared/services/order.service";
import {OrderPosition} from "../shared/interfaces";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef!: ElementRef;
  modal!: MaterialInstance;

  isRoot: boolean = true;

  constructor(private router: Router,
              public order: OrderService) {
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
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
    this.modal.close();
  }

  removePosition(item: OrderPosition) {
    this.order.remove(item);
  }
}
