import {Injectable} from '@angular/core';
import {OrderPosition, Position} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  list: OrderPosition[] = [];
  price = 0;

  constructor() {
  }

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });

    const candidate = this.list.find(item => item._id === position._id);
    if (candidate) {
      candidate.quantity! += position.quantity!;
    } else {
      this.list.push(orderPosition);
    }
    this.computePrice();
  }

  private computePrice() {
    this.price = this.list.reduce((total, curr) => {
      total += curr.quantity! * curr.cost;
      return total;
    }, 0)
  }

  remove(orderPosition: OrderPosition) {
    this.list = this.list.filter(item => item._id !== orderPosition._id);
    this.computePrice();
  }

  clear() {
  }
}
