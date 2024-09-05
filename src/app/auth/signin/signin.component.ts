import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit{



  userID: string = '';
  password: string = '';
  isSignUp: boolean = false; // Flag to determine if the user is signing up

  constructor(
    private api: AuthService,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) {}
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async onSubmit() {
    this.spinnerService.show();
    
    if (this.userID && this.password) {
      try {
        let res: any;
        if (this.isSignUp) {
          // Handle sign-up
          // res = await this.api.signUp(this.email, this.password , ); // Ensure your AuthService has a signUp method
        } else {
          // Handle sign-in
          res = await this.api.loginMLM(this.userID, this.password);
        }
        
        console.log(res);
        if (res.status) {
          sessionStorage.setItem('userId', this.userID);
          sessionStorage.setItem('memberId', res.data.table[0].memberId.toString());
          sessionStorage.setItem('token', res.token);
          
          localStorage.setItem('userId', this.userID);
          localStorage.setItem('memberId', res.data.table[0].memberId.toString());
          localStorage.setItem('token', res.token);
          
          this.spinnerService.hide();
          
          this.router.navigateByUrl('/auth/signin', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/home']).then(() => {
              window.location.href = '/home';  // Forces a full page reload to the home page
          });          
        });
        
          Swal.fire("Login Successfully", '', 'success');
        } else {
          this.spinnerService.hide();
          Swal.fire(res.message, '', 'error');
        }
      } catch (error) {
        this.spinnerService.hide();
        Swal.fire('An error occurred. Please try again later.', '', 'error');
      }
    } else {
      this.spinnerService.hide();
      Swal.fire('Please fill in all fields.', '', 'warning');
    }
  }

  toggleSignUp() {
    this.isSignUp = !this.isSignUp;
  }
}
