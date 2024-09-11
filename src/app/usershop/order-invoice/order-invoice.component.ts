import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
 // Adjust path based on your folder structure

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
  styleUrls: ['./order-invoice.component.css']
})
export class OrderInvoiceComponent implements OnInit {
  invoiceData: any;  // To store the invoice data retrieved from API

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchInvoice();
  }

  // Fetch the invoice data based on orderId from session storage
  fetchInvoice(): void {
    this.userService.getInvoiceByOrderNo().subscribe(
      (response) => {
        this.invoiceData = response;
        console.log('Invoice data:', this.invoiceData);
      },
      (error) => {
        console.error('Error fetching invoice:', error);
      }
    );
  }

  downloadInvoicePDF() {
    const DATA = document.getElementById('invoice-content')!;
    html2canvas(DATA).then(canvas => {
      const fileWidth = 210;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILE_URI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      PDF.addImage(FILE_URI, 'PNG', 0, 0, fileWidth, fileHeight);
      PDF.save('invoice.pdf');
    });
  }
  goToHomePage() {
    this.router.navigate(['/home']);
  }
  
}
