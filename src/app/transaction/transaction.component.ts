import { TransactionService } from './../service/transaction.service';
import { Transaction } from './../model/transaction';
import { Component, OnInit } from '@angular/core';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import { fadeAnimation } from '../app.animation';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
  animations: [fadeAnimation],
})
export class TransactionComponent implements OnInit {

  public transactions: Transaction[] = [];
  public faRupee = faIndianRupeeSign;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.getTransactions()
  }

  public getTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (response: Transaction[]) => this.transactions = response,
      error: (e: HttpErrorResponse) => console.error(e),
    });
  }
}
