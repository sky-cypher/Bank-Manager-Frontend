import { TransactionService } from './../service/transaction.service';
import { fadeAnimation } from 'src/app/app.animation';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { 
  faTimes, 
  faIndianRupeeSign
  } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from '../service/account.service';
import { Account } from '../model/account';
import { Customer } from '../model/customer';
import { CustomerService } from '../service/customer.service';
import {
  AbstractControl, 
  FormBuilder, 
  ValidationErrors, 
  ValidatorFn, 
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  animations: [fadeAnimation],
})
export class AccountComponent implements OnInit {

  public faTimes = faTimes;
  public faRupee = faIndianRupeeSign;

  public customers?: Customer[];
  public accounts!: Account[];
  public account?: Account;
  

  addForm = this.fb.group({
    id:['', {
      validators: [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        this.checkCustomerID()
      ], updateOn: 'change'
    }],
    balance: ['',{
      Validators: [
        Validators.pattern('^[0-9]*$')
      ]
    }]
  }
  )

  transferForm = this.fb.group({
    id:['', {
      validators: [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        this.checkAccountID()
      ], updateOn: 'change'
    }],
    amount: ['',{
      Validators: [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ],
    }]
  }
  )

  depositForm = this.fb.group({
    amount: ['',{
      Validators: [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ],
    }]
  }
  )

  withdrawForm = this.fb.group({
    amount: ['',{
      Validators: [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ],
    }]
  }
  )

  constructor(
    private customerService: CustomerService,
    private transcactionService: TransactionService,
    private accountService: AccountService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    ) {}

  ngOnInit(): void {
    this.getCustomers();
    this.getAccounts();
  }

  public getCustomerByID(id: number): Customer | undefined {
    return this.customers?.find(
      x => x?.customerID === id
      );
  }

  public getCustomerNameByID(id: number): string | undefined {
    return this.getCustomerByID(id)?.name;
  }
  public checkCustomerID(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
    let find = this.getCustomerByID(parseInt(control.value))
    return find ? null : {customerFound:true};
    }
  }

  public getAccountByID(id: number): Account | undefined {
    return this.accounts?.find(
      x => x?.accountID === id
      );
  }

  public getAccountIndexByID(id:number): number | undefined {
    let account = this.getAccountByID(id)
    if (account)
      return this.accounts.indexOf(account);
    return undefined;
  }

  public checkAccountID(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
    let find = this.getAccountByID(parseInt(control.value))
    return find && this.account != control.value ? null : {accountFound:true};
    }
  }

  public getCustomers(): void {
    this.customerService.getCustomers().subscribe({
        next: (response: Customer[]) => this.customers = response,
        error: (e: HttpErrorResponse) => console.error(e),
      }
    )
  }

  public getAccounts(): void {
    this.accountService.getAccounts().subscribe({
        next: (response: Account[]) => this.accounts = response,
        error: (e: HttpErrorResponse) => console.error(e),
      }
    )
  }

  public transfer(res: any): void {
    this.modalService.dismissAll();
    this.transcactionService.transfer({
      accountFromID: this.account!.accountID,
      accountToID: res.id,
      amount: res.amount,
      transactionID: 0
    }).subscribe();
  }

  public deposit(res: any): void {
    this.modalService.dismissAll();
    this.transcactionService.deposit({
      accountFromID: 0,
      accountToID: this.account!.accountID,
      amount: res.amount,
      transactionID: 0
    }).subscribe();
  }

  public withdraw(res: any): void {
    this.modalService.dismissAll();
    this.transcactionService.withdraw({
      accountFromID: this.account!.accountID,
      accountToID: 0,
      amount: res.amount,
      transactionID: 0
    }).subscribe();
  }

  private addAccount(res: any): void {
        this.accountService.addAccount({
          accountID: 0,
          customerID: res.id,
          balance: res.balance,
        })
        .subscribe({
          next: (a) => this.accounts.push(a),
          error: (e) => console.log(e),
        }
        );
  }

  public deleteAccount(account: Account): void {
    this.modalService.dismissAll();
    this.accountService.deleteAccount(account.accountID)
      .subscribe({
        next: () => {
          this.accounts.splice(
            this.accounts.indexOf(account),1);
        },
        error: (e) => console.log(e),
      });
  }

  open(content: TemplateRef<any>, account?: Account) {
    this.account = account;
  
		this.modalService.open(content, { 
      ariaLabelledBy: 'modal-basic-title' ,
      animation: true
    }).result.then(
      (res) => {this.addAccount(res.value)
        res.reset()
      },
      () => {}
    );
  }


}
