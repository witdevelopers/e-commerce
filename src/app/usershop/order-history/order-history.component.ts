import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';


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
          console.log(data);
          this.orderHistory = data; // Bind the order history data
        },
        (error) => {
          console.error('Error fetching customer details:', error);
          this.errorMessage = 'Failed to load order history. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'No customerId found in session storage.';
    }
  }
}
