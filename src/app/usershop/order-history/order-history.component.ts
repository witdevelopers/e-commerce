import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: any[] = []; // Initialize with an empty array
  errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const customerId = sessionStorage.getItem('memberId');
    
    if (customerId) {
      this.userService.getOrderDetails(customerId).subscribe(
        (data) => {
          this.orderHistory = data; // Bind the order history data
        },
        (error) => {
          this.errorMessage = 'Failed to load order history. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'Please login to see your orders.';
    }
  }

  // Method to cancel an order
  cancelOrder(orderId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.cancelOrder(orderId).subscribe(
          (response) => {
            this.orderHistory = this.orderHistory.filter(order => order.id !== orderId);
            Swal.fire(
              
              'Canceled!',
              'Your order has been canceled.',
              'success'
                        );
          },
          (error) => {
            Swal.fire(
              'Failed',
              'Please try again later.',
            );
          }
        );
      }
    });
  }
}
