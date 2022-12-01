import { PageNotFound } from './pagenotfound.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { CustomerComponent } from './customer/customer.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
  {path: 'customer', component: CustomerComponent},
  {path: 'account', component: AccountComponent},
  {path: 'transaction', component: TransactionComponent},
  { path: '', redirectTo: '/account', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
