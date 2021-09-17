import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PositionsService} from "../../shared/services/positions.service";
import {Observable} from "rxjs";
import {Position} from "../../shared/interfaces";
import {map, switchMap} from "rxjs/operators";
import {OrderService} from "../../shared/services/order.service";
import {MaterialService} from "../../shared/services/material.service";

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$!: Observable<Position[]>

  constructor(private route: ActivatedRoute,
              private positionsService: PositionsService,
              private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
        switchMap((params) => {
          return this.positionsService.fetch(params['id']);
        }),
        map(
          (positions: Position[]) => {
            return positions.map(pos => {
              pos.quantity = 1;
              return pos;
            })
          }
        )
      )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Добавлено ${position.name} ${position.quantity}`)
    this.orderService.add(position);
  }
}
