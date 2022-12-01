import { fadeAnimation } from 'src/app/app.animation';
import { Customer } from 'src/app/model/customer';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { CustomerService } from 'src/app/service/customer.service';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { 
  faPencil, 
  faTimes, 
  faEnvelope, 
  faPhone 
  } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [DatePipe],
  animations: [fadeAnimation]
})
export class CustomerComponent implements OnInit {
  public faPencil = faPencil;
  public faTimes = faTimes;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;

  public customers!: Customer[];
  public customer?: Customer;
  public date?: NgbDate;

  constructor(
    private customerService: CustomerService,
    private modalService: NgbModal,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  public getCustomers(): void {
    this.customerService.getCustomers().subscribe({
        next: (response: Customer[]) => this.customers = [...response],
        error: (e: HttpErrorResponse) => console.error(e),
      }
    )
  }

  public getCustomer(): void {
    if (this.customer) {
      let find = this.customers?.find(
        x => x?.customerID === this.customer!.customerID
        );
      this.customerService.getCustomer(this.customer?.customerID).subscribe({
        next: (response: Customer) => {
          this.customers[this.customers.indexOf(find!)] = response;
        console.log(response)},
        error: (e: HttpErrorResponse) => this.customer = undefined,
      }
    )
    }
    
  }

  private formatDate(ngbDate: NgbDate): string {
    let myDate = new Date(ngbDate.year+'-'+ngbDate.month+'-'+ngbDate.day);
    return this.datePipe.transform(myDate,"yyyy-MM-dd")!;
  }

  private formatNgbDate(date:string): NgbDate {
    let data = date.split('-');
    return new NgbDate(
      parseInt(data[0]),
      parseInt(data[1]),
      parseInt(data[2])
      );

  }

  private addCustomer(res: any): void {
    let date = this.formatDate(res.dob);
        this.customerService.addCustomer({
          name:res.name,
          customerID: 0,
          phone:res.phone,
          email:res.email,
          dob: date,
          age: 0,
        })
        .subscribe({
          next: (c: Customer) => this.customers.push(c),
          error: (e) => console.log(e),
        }
        );
  }

  public updateCustomer(customer: Customer): void {
    customer.dob = this.formatDate(this.date!);
    this.customerService.updateCustomer(customer)
      .subscribe({
        next: () => this.getCustomers(),
        error: (e) => console.log(e),
      });
  }

  public deleteCustomer(customer: Customer): void {
    this.modalService.dismissAll();
    this.customerService.deleteCustomer(customer.customerID)
      .subscribe({
        next: () => {
          this.customers.splice(
            this.customers.indexOf(customer),1);
        },
        error: (e) => console.log(e),
      });
  }

  open(content: TemplateRef<any>, customer?: Customer) {
    this.customer = customer;
    if (customer)
      this.date = this.formatNgbDate(customer.dob);
		this.modalService.open(content, { 
      ariaLabelledBy: 'modal-basic-title' ,
      animation: true
    }).result.then(
      (res) => this.addCustomer(res),
      () => this.getCustomer()
    );
  }

}
