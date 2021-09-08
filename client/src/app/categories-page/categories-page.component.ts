import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {Category} from "../shared/interfaces";
import {Observable} from "rxjs";
import {timeout} from "rxjs/operators";

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {

  categories$: Observable<Category[]> = this.categoriesService.fetch()

  constructor(private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {

  }

}
