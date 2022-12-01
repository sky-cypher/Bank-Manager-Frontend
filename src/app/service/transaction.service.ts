import { Transaction } from './../model/transaction';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }
  
  public getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.apiServerUrl}/transaction/all`
      )
  }

  public deposit(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiServerUrl}/transaction/deposit`,
      transaction
    )
  }

  public withdraw(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiServerUrl}/transaction/withdraw`,
      transaction
    )
  }

  public transfer(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiServerUrl}/transaction/transfer`,
      transaction
    )
  }
}