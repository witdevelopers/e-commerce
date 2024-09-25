import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/user/services/user.service'; // Adjust the path as necessary

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const email = this.forgotPasswordForm.value.email;

      this.userService.sendResetLink(email).subscribe(
        response => {
          Swal.fire({
            title: 'Success!',
            text: 'Reset link sent successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.isLoading = false;
          this.forgotPasswordForm.reset(); // Reset form after success
        },
        error => {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to send reset link. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.isLoading = false;
        }
      );
    }
  }
}
