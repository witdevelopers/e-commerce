import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      userId: ['', Validators.required],   
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check that password and confirmPassword fields match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      const { userId, password, name, email } = this.signupForm.value;
  
      try {
        const res: any = await this.authService.saveUsers({ userId, password, name, email });
  
        if (res.status) {
          console.log("Registered");
          Swal.fire("Registered Successfully", '', 'success');
          this.router.navigate(['/auth/signin']);
        } else {
          Swal.fire(res.message, '', 'error');
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