import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/services/material.service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string = '';
  @ViewChild('modal') modalRef!: ElementRef;
  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance | undefined;
  positionId: string | undefined = '';

  form = this.fb.group({
    name: new FormControl(null, [Validators.required]),
    cost: new FormControl(null, [Validators.required, Validators.min(1)])
  });

  constructor(private positionService: PositionsService,
              private fb: FormBuilder) {
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
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal!.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.form.patchValue({
      name: null,
      cost: null
    });
    this.modal!.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal?.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionService.update(newPosition)
        .subscribe(position => {
          MaterialService.toast('Изменения сохранены');
            this.positions = this.positions.map(pos => {
            if (pos._id === position._id) {
              return position;
            }
            return pos;
          })
        }, error => {
          this.form.enable();
          MaterialService.toast(error.error.message);
        },
        () => {
          this.form.enable();
          this.form.reset();
          this.modal!.close();
        });
    } else {
      this.positionService.create(newPosition)
        .subscribe(position => {
            MaterialService.toast('Позиция создана');
            this.positions.push(position);
          }, error => {
            this.form.enable();
            MaterialService.toast(error.error.message);
          },
          () => {
            this.form.enable();
            this.form.reset();
            this.modal!.close();
          });
    }

  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Удалить позицию ${position.name}?`)

    if (decision) {
      this.positionService.delete(position._id).subscribe(res => {
        MaterialService.toast(res.message);
        this.positions = this.positions.filter(pos => pos._id !== position._id);
      }, error => MaterialService.toast(error.error.message));
    }
  }
}
