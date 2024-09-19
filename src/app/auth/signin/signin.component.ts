import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  userID: string = '';
  password: string = '';
  isSignUp: boolean = false; // Flag to determine if the user is signing up

  constructor(
    private api: AuthService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private userservice: UserService
  ) {}

  ngOnInit(): void {
    // Initialization logic, if needed
  }

  async onSubmit() {
    this.spinnerService.show();
    
    if (this.userID && this.password) {
      try {
        let res: any;
        if (this.isSignUp) {
          // Handle sign-up (implement the signUp method in AuthService if needed)
          // res = await this.api.signUp(this.userID, this.password);
        } else {
          // Handle sign-in
          res = await this.api.loginMLM(this.userID, this.password);
        }
        
        if (res.status) {
          sessionStorage.setItem('userId', this.userID);
          sessionStorage.setItem('memberId', res.data.table[0].memberId.toString());
          sessionStorage.setItem('token', res.token);
          
          localStorage.setItem('userId', this.userID);
          localStorage.setItem('memberId', res.data.table[0].memberId.toString());
          localStorage.setItem('token', res.token);

          const uid = sessionStorage.getItem('memberId');
          const Tuid  = localStorage.getItem('TempUserId');
          this.userservice.updateCustomer(Number(Tuid), Number(uid)).subscribe((res) =>{
            console.log(res);
          });


          // const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
          // console.log("Cart data: ", cart);

          // for (let index = 0; index < cart.length; index++) {
          //   const element = cart[index];
          //   const productId = element.productId;
          //   const quantity = element.quantity;
          //   const customerId = Number(localStorage.getItem('memberId'))
          //   // console.log(element.productId)
          //   console.log(element.quantity)
          //   console.log(localStorage.getItem('memberId'))
          //   // this.userservice.addToCart(localStorage.getItem('memberId').toString(), productDtId, quantity)
          //   this.userservice.addToCart(customerId, productId, quantity).subscribe((res) =>{
          //     console.log(res)
          //   })
          // }
          // // [{"productId":3,"quantity":1},{"productId":7,"quantity":1},{"productId":13,"quantity":1},{"productId":24,"quantity":1},{"productId":12,"quantity":1},{"productId":23,"quantity":1},{"productId":9,"quantity":1}]
          
          // // return cart
          // // return cart ? JSON.parse(cart) : [];


          // // this.cartItems = this.userService.loadAnonCart();
          // // console.log("Cart data: ", this.cartItems);
          
          this.spinnerService.hide();
          
          Swal.fire("Login Successfully", '', 'success').then(() => {
            // Forcefully reload the home page route
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/home']);  // Redirect to home page
            });
          });
          
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
