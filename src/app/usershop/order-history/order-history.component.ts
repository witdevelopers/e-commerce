import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting'; // Assuming Settings is your config for image URLs

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: any[] = [];
  errorMessage: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const customerId = sessionStorage.getItem('memberId');
    
    if (customerId) {
      this.userService.getOrderDetails(customerId).subscribe(
        (data) => {
          this.orderHistory = data.map(order => ({
            ...order,
            imageUrl: this.processImageUrl(order.imageUrl)
          }));
          console.log("Order history data", this.orderHistory);
        },
        (error) => {
          this.errorMessage = 'Failed to load order history. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'Please login to see your orders.';
    }
  }

  processImageUrl(imageUrl: string): string {
    return imageUrl
      ? imageUrl.includes('~/')
        ? imageUrl.replace('~/', Settings.imageBaseUrl)
        : imageUrl.startsWith('http')
          ? imageUrl
          : `${Settings.imageBaseUrl}${imageUrl}`
      : 'assets/default-image.jpg';
  }

  // Navigate to order details page
  showOrderDetails(id: string) {
    console.log("Navigating to order details for orderNo:", id);
    this.router.navigate(['/usershop/order-details', id]); // Pass the actual orderNo here
  }
  

  cancelOrder(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.cancelOrder(id).subscribe(
          (response) => {
            this.orderHistory = this.orderHistory.filter(order => order.id !== id);
            Swal.fire(
              'Canceled!',
              'Your order has been canceled.',
              'success'
            );
          },
          (error) => {
            Swal.fire('Failed', 'Please try again later.');
          }
        );
      }
    });
  }
  
}
