import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise = loadStripe('pk_test_51RCLLhHKr1IwGIW7SYnQLgmvzHXmSyyehY71Fm3tWUol4hptl2fsbLd7YKM8JqK7pWmhRq2YbgTW04OrQ6tAi8US00eeXKAt5F'); // 👉 Remplace par ta clé publique Stripe

  constructor(private http: HttpClient) {}

  createPaymentIntent(data: any) {
    return this.http.post<any>('http://localhost:8081/api/payment/create-payment-intent', data);
  }
  
  async getStripe(): Promise<Stripe | null> {
    return await this.stripePromise;
  }
}
