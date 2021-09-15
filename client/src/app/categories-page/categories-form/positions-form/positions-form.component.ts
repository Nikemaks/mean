import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/services/material.service";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string | undefined;
  @ViewChild('modal') modalRef: ElementRef | undefined;
  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance | undefined

  constructor(private positionService: PositionsService) {
  }

  ngOnDestroy(): void {
    this.modal?.destroy();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnInit(): void {
    this.loading = true;
    this.positionService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions;
      this.loading = false;
    })
  }

  onSelectPosition(position: Position) {
    this.modal?.open();
  }

  onAddPosition() {
    this.modal?.open();
  }

  onCancel() {
    this.modal?.close();
  }
}
