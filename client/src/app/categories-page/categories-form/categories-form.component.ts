import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Route} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/services/material.service";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  isNew = true;
  form: FormGroup = this.fb.group({
    name: new FormControl(null, [Validators.required])
  })

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private categoriesService: CategoriesService) {
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
            this.form.patchValue({
              name: category.name
            });
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message));
  }

  onSubmit() {

  }
}
