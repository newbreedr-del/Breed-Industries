// Stitch Money API Types
// Documentation: https://stitch.money/docs

export interface StitchConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
  redirectUri: string;
}

export interface StitchPaymentRequest {
  amount: {
    quantity: string; // Amount in cents (e.g., "100000" for R1000.00)
    currency: 'ZAR';
  };
  payerReference: string; // Your reference for the payer
  beneficiaryReference: string; // Reference that will appear on beneficiary's statement
  externalReference?: string; // Your internal reference (e.g., invoice ID)
  beneficiaryName: string;
  beneficiaryBankId: string; // Bank identifier
  beneficiaryAccountNumber: string;
}

export interface StitchPaymentInitiation {
  id: string;
  url: string; // URL to redirect user to complete payment
  paymentRequestId: string;
}

export interface StitchPaymentStatus {
  id: string;
  status: 'pending' | 'complete' | 'failed' | 'cancelled';
  amount: {
    quantity: string;
    currency: 'ZAR';
  };
  created: string;
  updated: string;
  externalReference?: string;
}

export interface StitchWebhookPayload {
  id: string;
  type: 'payment.status.updated';
  data: {
    paymentRequestId: string;
    status: 'pending' | 'complete' | 'failed' | 'cancelled';
    amount: {
      quantity: string;
      currency: 'ZAR';
    };
  };
}

export interface StitchBankAccount {
  accountNumber: string;
  accountType: 'current' | 'savings';
  bankId: string;
  name: string;
}

export interface StitchRefund {
  id: string;
  paymentRequestId: string;
  amount: {
    quantity: string;
    currency: 'ZAR';
  };
  reason: string;
  status: 'pending' | 'complete' | 'failed';
}
