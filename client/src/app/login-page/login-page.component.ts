import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

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
        if (params['register']) {
          // Теперь вы можете зайти используя свои данные
        }
        if (params['accessDenied']) {
          // Необходима авторизация
        }
      });
  }

  onSubmit() {
    this.form.disable();

    this.authService.login(this.form.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this.router.navigate(['/overview'])
      }, error => {
        console.warn(error);
        this.form.enable();
      })
  }


}
