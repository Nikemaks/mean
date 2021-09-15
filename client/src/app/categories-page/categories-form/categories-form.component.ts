import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Route, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap, takeUntil} from "rxjs/operators";
import {of, Subject} from "rxjs";
import {MaterialService} from "../../shared/services/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit, OnDestroy {

  @ViewChild('input') inputRef: ElementRef | undefined;

  isNew = true;
  image: File | undefined;
  imagePreview: any = '';
  category: Category | undefined;
  destroyed$: Subject<any> = new Subject<any>();
  form: FormGroup = this.fb.group({
    name: new FormControl(null, [Validators.required])
  })

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private router: Router) {
  }

  ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

  ngOnInit(): void {
    this.form.disable();
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe(
        category => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message));
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      // creat
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      // update
      obs$ = this.categoriesService.update(this.category?._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Изменения сохранены');
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      })
  }

  triggerClick() {
    this.inputRef?.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file);
  }

  deleteCategory() {
    const decision = window.confirm(`Вы уверены что хотите удалить категорию ${this.category?.name}?`);

    if (decision) {
      this.categoriesService.delete(this.category?._id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(
          res => MaterialService.toast(res.message),
          err => MaterialService.toast(err.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }
}
