import {
  StitchConfig,
  StitchPaymentRequest,
  StitchPaymentInitiation,
  StitchPaymentStatus,
  StitchRefund
} from '@/types/stitch';

// Stitch API Configuration
const STITCH_CONFIG: StitchConfig = {
  clientId: process.env.STITCH_CLIENT_ID || '',
  clientSecret: process.env.STITCH_CLIENT_SECRET || '',
  environment: (process.env.STITCH_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  redirectUri: process.env.STITCH_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/stitch/callback`
};

const STITCH_API_URL = STITCH_CONFIG.environment === 'production'
  ? 'https://api.stitch.money/graphql'
  : 'https://api.sandbox.stitch.money/graphql';

// Your company bank account details for receiving payments
const COMPANY_BANK_ACCOUNT = {
  accountNumber: process.env.COMPANY_ACCOUNT_NUMBER || '',
  bankId: process.env.COMPANY_BANK_ID || 'absa', // absa, fnb, nedbank, standard_bank, capitec
  name: 'The Breed Industries (PTY) LTD'
};

/**
 * Get OAuth2 access token from Stitch
 */
async function getAccessToken(): Promise<string> {
  const response = await fetch('https://secure.stitch.money/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: STITCH_CONFIG.clientId,
      client_secret: STITCH_CONFIG.clientSecret,
      scope: 'client_paymentrequest'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Execute GraphQL query against Stitch API
 */
async function executeGraphQL(query: string, variables: any = {}): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(STITCH_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
}

/**
 * Create a payment request for an invoice
 */
export async function createPaymentRequest(
  invoiceId: string,
  amount: number,
  customerName: string,
  invoiceNumber: string
): Promise<StitchPaymentInitiation> {
  const amountInCents = Math.round(amount * 100).toString();

  const mutation = `
    mutation CreatePaymentRequest($input: ClientPaymentInitiationRequestInput!) {
      clientPaymentInitiationRequestCreate(input: $input) {
        paymentInitiationRequest {
          id
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      amount: {
        quantity: amountInCents,
        currency: 'ZAR'
      },
      payerReference: `${customerName} - ${invoiceNumber}`,
      beneficiaryReference: `Invoice ${invoiceNumber}`,
      externalReference: invoiceId,
      beneficiary: {
        bankAccount: {
          name: COMPANY_BANK_ACCOUNT.name,
          bankId: COMPANY_BANK_ACCOUNT.bankId,
          accountNumber: COMPANY_BANK_ACCOUNT.accountNumber
        }
      }
    }
  };

  const data = await executeGraphQL(mutation, variables);
  
  return {
    id: data.clientPaymentInitiationRequestCreate.paymentInitiationRequest.id,
    url: data.clientPaymentInitiationRequestCreate.paymentInitiationRequest.url,
    paymentRequestId: data.clientPaymentInitiationRequestCreate.paymentInitiationRequest.id
  };
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentRequestId: string): Promise<StitchPaymentStatus> {
  const query = `
    query GetPaymentRequest($id: ID!) {
      node(id: $id) {
        ... on ClientPaymentInitiationRequest {
          id
          state {
            __typename
            ... on ClientPaymentInitiationRequestCompleted {
              date
            }
            ... on ClientPaymentInitiationRequestPending {
              __typename
            }
            ... on ClientPaymentInitiationRequestCancelled {
              date
              reason
            }
          }
          amount {
            quantity
            currency
          }
          created
          updated
          externalReference
        }
      }
    }
  `;

  const data = await executeGraphQL(query, { id: paymentRequestId });
  const payment = data.node;

  let status: 'pending' | 'complete' | 'failed' | 'cancelled' = 'pending';
  
  if (payment.state.__typename === 'ClientPaymentInitiationRequestCompleted') {
    status = 'complete';
  } else if (payment.state.__typename === 'ClientPaymentInitiationRequestCancelled') {
    status = 'cancelled';
  }

  return {
    id: payment.id,
    status,
    amount: payment.amount,
    created: payment.created,
    updated: payment.updated,
    externalReference: payment.externalReference
  };
}

/**
 * Create a refund for a payment
 */
export async function createRefund(
  paymentRequestId: string,
  amount: number,
  reason: string
): Promise<StitchRefund> {
  const amountInCents = Math.round(amount * 100).toString();

  const mutation = `
    mutation CreateRefund($input: ClientRefundInput!) {
      clientRefund(input: $input) {
        refund {
          id
          status
          amount {
            quantity
            currency
          }
        }
      }
    }
  `;

  const variables = {
    input: {
      paymentRequestId,
      amount: {
        quantity: amountInCents,
        currency: 'ZAR'
      },
      reason
    }
  };

  const data = await executeGraphQL(mutation, variables);
  const refund = data.clientRefund.refund;

  return {
    id: refund.id,
    paymentRequestId,
    amount: refund.amount,
    reason,
    status: refund.status
  };
}

/**
 * Verify webhook signature (for security)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Stitch uses HMAC-SHA256 for webhook signatures
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  
  return signature === expectedSignature;
}

/**
 * Generate payment link for invoice
 */
export function generatePaymentLink(paymentRequestId: string): string {
  return `https://pay.stitch.money/payment/${paymentRequestId}`;
}
