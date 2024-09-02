import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async getUserFormData() {
    if (this.isValidForm()) {
      try {
        const res: any = await this.authService.saveUsers(this.email, this.password);

        if (res.status) {
          console.log("Registered");
          Swal.fire("Registration Successful", '', 'success').then(() => {
            this.router.navigate(['/login']); // Navigate to login page after successful registration
          });
        } else {
          Swal.fire(res.message || "Registration failed", '', 'error');
        }
      } catch (error) {
        Swal.fire("An error occurred", '', 'error');
        console.error(error);
      }
    } else {
      Swal.fire("Please fill out the form correctly.", '', 'warning');
    }
  }

  private isValidForm(): boolean {
    return this.fullName.trim() !== '' &&
           this.isValidEmail(this.email) &&
           this.password.trim() !== '' &&
           this.password === this.confirmPassword;
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
