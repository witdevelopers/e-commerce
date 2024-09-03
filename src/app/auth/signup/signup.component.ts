import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      // userId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      const { password, name, email } = this.signupForm.value;

      try {
        const res: any = await this.authService.registerMLM({  password, name, email });

        if (res && res.status) {
          console.log("Registered");
          Swal.fire("Registered Successfully", '', 'success');
          this.router.navigate(['/auth/signin']);
        } else {
          Swal.fire(res.message || "Registration failed", '', 'error');
        }
      } catch (error) {
        console.error("Error during registration:", error);
        Swal.fire("Registration failed. Please try again.", '', 'error');
      }
    } else {
      Swal.fire("Please fill out the form correctly.", '', 'warning');
    }
  }
}
