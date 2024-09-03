import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  Name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  async getUserFormData() {
    if (this.isValidForm()) {
      try {
        console.log("Sending sign-up request with data:", { Name: this.Name, email: this.email, password: this.password });

        const res = await firstValueFrom(this.authService.registerMLM(this.Name, this.email, this.password));
        console.log("API Response:", res);

        // Handle the response based on its structure
        if (res && res.status === true) {  // Adjust based on expected response structure
          Swal.fire("Registration Successful", '', 'success').then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          Swal.fire(res?.message || "Registration failed", '', 'error');
        }
      } catch (error) {
        console.error("Error during sign-up:", error);
        Swal.fire("An error occurred", '', 'error');
      }
    } else {
      Swal.fire("Please fill out the form correctly.", '', 'warning');
    }
  }

  private isValidForm(): boolean {
    return this.Name.trim() !== '' &&
      this.isValidEmail(this.email) &&
      this.password.trim() !== '' &&
      this.password === this.confirmPassword;
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
