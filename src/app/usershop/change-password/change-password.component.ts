import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup; // Form group for handling form inputs
  userId: string | null = ''; // User ID from session storage

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize the form controls and validators
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });

    this.userId = sessionStorage.getItem('userId'); // Get userId from session storage
    if (!this.userId) {
      Swal.fire('Error', 'User not logged in', 'error');
      this.router.navigate(['/auth/signin']); // Redirect to login if user is not found
    }
  }

  // Method to handle password change
  changePassword() {
    if (this.changePasswordForm.invalid) {
      Swal.fire('Invalid Input', 'Please fill in all fields', 'error');
      return;
    }

    const { newPassword, confirmNewPassword, oldPassword } = this.changePasswordForm.value;

    // Check if the new password and confirmation password match
    if (newPassword !== confirmNewPassword) {
      Swal.fire('Password Mismatch', 'New password and confirm password do not match', 'error');
      return;
    }

    // Payload for the password change request
    const payload = {
      userId: this.userId, // Use the userId from session storage
      oldPassword,
      newPassword,
      userType: 1,
      isByAdmin: false,
      byAdminId: 0,
      isForgotPassword: false,
    };

    // Call the service to change the password
    this.userService.changePassword(payload).subscribe(
      (response) => {
        Swal.fire('Success', 'Password changed successfully', 'success');
        this.changePasswordForm.reset(); // Reset the form after successful submission
      },
      (error) => {
        Swal.fire('Error', 'There was an error changing the password', 'error');
      }
    );
  }
}
