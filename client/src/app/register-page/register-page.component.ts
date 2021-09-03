import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  destroyed$: Subject<any> = new Subject<any>();

  form: FormGroup = this.fb.group({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.minLength(6), Validators.required])
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params: Params) => {
        if (params['registered']) {
          // Теперь вы можете зайти используя свои данные
        }
        if (params['accessDenied']) {
          // Необходима авторизация
        }
      });
  }

  onSubmit() {
    this.form.disable();

    this.authService.register(this.form.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this.router.navigate(['/login'], {queryParams: {registered: true}});
      }, error => {
        console.warn(error);
        this.form.enable();
      })
  }

}
