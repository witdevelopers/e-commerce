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
  userID: any = '';
  password: any = '';



  constructor(private authService: AuthService, private router: Router) {
  
  }

  // getUserFormData(data:any): void {
  //   if (this.signupForm.valid) {
  //     const userData = this.signupForm.value;
  //     console.log(userData);
  //     // Subscribe to the Observable returned by the service
  //     this.authService.saveUsers(data).subscribe((result)=>{
  //       console.log(result);
  //     })
  //   } else {
  //     window.alert('Please fill out the form correctly.');
  //   }
  // }
 

  async getUserFormData(){
    
    if (this.userID != "" && this.password != "") {
      var res: any = await this.authService.saveUsers(this.userID, this.password);
      
      if (res.status) {
      
        console.log("Registered");

        Swal.fire("Registered Succesfull");
      } else {
       
        Swal.fire(res.message, '', 'error');
      }
    }
  }


  

}
