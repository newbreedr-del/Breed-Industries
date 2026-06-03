import crypto from 'crypto';

const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const PASSPHRASE = process.env.PAYFAST_PASSPHRASE;
const SANDBOX = process.env.PAYFAST_SANDBOX === 'true';

const PAYFAST_URL = SANDBOX
  ? 'https://sandbox.payfast.co.za/eng/process'
  : 'https://www.payfast.co.za/eng/process';

export interface PayFastPaymentData {
  name_first: string;
  name_last: string;
  email_address: string;
  amount: number;
  item_name: string;
  item_description?: string;
  custom_str1?: string; // invoice ID or quote ID
  custom_str2?: string; // customer ID
  custom_str3?: string; // any other reference
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  email_confirmation?: 1 | 0;
  confirmation_address?: string;
  payment_method?: string;
  subscription_type?: 1; // 1 = subscription
  billing_date?: string; // YYYY-MM-DD
  recurring_amount?: number;
  frequency?: 3 | 4 | 5; // 3 = monthly, 4 = quarterly, 5 = biannually
  cycles?: number; // number of billing cycles
  m_payment_id?: string; // unique payment ID
}

/**
 * Generate PayFast signature for payment data
 */
function generateSignature(data: Record<string, string | number>): string {
  const signatureData: Record<string, string> = {};

  // PayFast requires specific field ordering
  const fieldOrder = [
    'merchant_id',
    'merchant_key',
    'return_url',
    'cancel_url',
    'notify_url',
    'name_first',
    'name_last',
    'email_address',
    'cell_number',
    'm_payment_id',
    'amount',
    'item_name',
    'item_description',
    'custom_str1',
    'custom_str2',
    'custom_str3',
    'custom_str4',
    'custom_str5',
    'custom_int1',
    'custom_int2',
    'custom_int3',
    'custom_int4',
    'custom_int5',
    'email_confirmation',
    'confirmation_address',
    'payment_method',
    'subscription_type',
    'billing_date',
    'recurring_amount',
    'frequency',
    'cycles',
  ];

  // Build signature string with passphrase
  const signatureString = fieldOrder
    .map(field => {
      const value = data[field];
      if (value === undefined || value === null || value === '') return '';
      return `${field}=${encodeURIComponent(value.toString())}`;
    })
    .filter(s => s)
    .join('&') + `&passphrase=${encodeURIComponent(PASSPHRASE || '')}`;

  return crypto.createHash('md5').update(signatureString).digest('hex');
}

/**
 * Generate PayFast payment URL with all required parameters
 */
export function generatePayFastUrl(
  paymentData: PayFastPaymentData,
  returnUrl: string,
  cancelUrl: string,
  notifyUrl: string
): { url: string; signature: string; formData: Record<string, string> } {
  if (!MERCHANT_ID || !MERCHANT_KEY) {
    throw new Error('PayFast credentials not configured');
  }

  const formData: Record<string, string> = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    name_first: paymentData.name_first,
    name_last: paymentData.name_last,
    email_address: paymentData.email_address,
    amount: paymentData.amount.toFixed(2),
    item_name: paymentData.item_name,
  };

  // Optional fields
  if (paymentData.item_description) formData.item_description = paymentData.item_description;
  if (paymentData.custom_str1) formData.custom_str1 = paymentData.custom_str1;
  if (paymentData.custom_str2) formData.custom_str2 = paymentData.custom_str2;
  if (paymentData.custom_str3) formData.custom_str3 = paymentData.custom_str3;
  if (paymentData.custom_str4) formData.custom_str4 = paymentData.custom_str4;
  if (paymentData.custom_str5) formData.custom_str5 = paymentData.custom_str5;
  if (paymentData.custom_int1) formData.custom_int1 = paymentData.custom_int1;
  if (paymentData.custom_int2) formData.custom_int2 = paymentData.custom_int2;
  if (paymentData.custom_int3) formData.custom_int3 = paymentData.custom_int3;
  if (paymentData.custom_int4) formData.custom_int4 = paymentData.custom_int4;
  if (paymentData.custom_int5) formData.custom_int5 = paymentData.custom_int5;
  if (paymentData.email_confirmation !== undefined) formData.email_confirmation = paymentData.email_confirmation.toString();
  if (paymentData.confirmation_address) formData.confirmation_address = paymentData.confirmation_address;
  if (paymentData.payment_method) formData.payment_method = paymentData.payment_method;
  if (paymentData.m_payment_id) formData.m_payment_id = paymentData.m_payment_id;

  // Subscription fields
  if (paymentData.subscription_type === 1) {
    formData.subscription_type = '1';
    if (paymentData.billing_date) formData.billing_date = paymentData.billing_date;
    if (paymentData.recurring_amount) formData.recurring_amount = paymentData.recurring_amount.toFixed(2);
    if (paymentData.frequency) formData.frequency = paymentData.frequency.toString();
    if (paymentData.cycles) formData.cycles = paymentData.cycles.toString();
  }

  const signature = generateSignature(formData);
  formData.signature = signature;

  const queryString = Object.entries(formData)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return {
    url: `${PAYFAST_URL}?${queryString}`,
    signature,
    formData,
  };
}

/**
 * Validate PayFast ITN (Instant Transaction Notification) signature
 */
export function validateITNSignature(data: Record<string, string>): boolean {
  if (!PASSPHRASE) {
    console.warn('PayFast passphrase not configured - cannot validate ITN signature');
    return false;
  }

  const receivedSignature = data.signature;
  if (!receivedSignature) return false;

  // Remove signature from data before generating our own
  const { signature: _sig, ...dataWithoutSignature } = data;

  // Rebuild signature string with passphrase
  const fieldOrder = [
    'm_payment_id',
    'pf_payment_id',
    'payment_status',
    'item_name',
    'item_description',
    'amount_gross',
    'amount_fee',
    'amount_net',
    'custom_str1',
    'custom_str2',
    'custom_str3',
    'custom_str4',
    'custom_str5',
    'custom_int1',
    'custom_int2',
    'custom_int3',
    'custom_int4',
    'custom_int5',
    'name_first',
    'name_last',
    'email_address',
    'merchant_id',
  ];

  const signatureString = fieldOrder
    .map(field => {
      const value = dataWithoutSignature[field];
      if (value === undefined || value === null || value === '') return '';
      return `${field}=${encodeURIComponent(value.toString())}`;
    })
    .filter(s => s)
    .join('&') + `&passphrase=${encodeURIComponent(PASSPHRASE)}`;

  const expectedSignature = crypto.createHash('md5').update(signatureString).digest('hex');

  return receivedSignature === expectedSignature;
}

/**
 * Verify ITN comes from PayFast by checking IP address
 */
export function isValidPayFastIP(ip: string): boolean {
  const validIPs = [
    '41.74.179.1',
    '41.74.179.2',
    '41.74.179.3',
    '41.74.179.4',
    '41.74.179.5',
    '41.74.179.6',
    '41.74.179.7',
    '41.74.179.8',
    '41.74.179.9',
    '41.74.179.10',
    '41.74.182.5',
    '41.74.182.6',
    '41.74.182.7',
    '41.74.182.8',
    '41.74.182.9',
    '41.74.182.10',
    '41.74.182.20',
    '41.74.182.21',
    '41.74.182.22',
    '41.74.182.23',
    '41.74.182.24',
    '41.74.182.25',
    '41.74.182.26',
    '41.74.182.27',
    '41.74.182.28',
    '41.74.182.29',
    '41.74.182.30',
    '41.74.182.31',
    '41.74.182.32',
    '41.74.182.33',
    '41.74.182.34',
    '41.74.182.35',
    '41.74.182.36',
    '41.74.182.37',
    '41.74.182.38',
    '41.74.182.39',
    '41.74.182.40',
    '41.74.182.41',
    '41.74.182.42',
    '41.74.182.43',
    '41.74.182.44',
    '41.74.182.45',
    '41.74.182.46',
    '41.74.182.47',
    '41.74.182.48',
    '41.74.182.49',
    '41.74.182.50',
    '41.74.182.51',
    '41.74.182.52',
    '41.74.182.53',
    '41.74.182.54',
    '41.74.182.55',
    '41.74.182.56',
    '41.74.182.57',
    '41.74.182.58',
    '41.74.182.59',
    '41.74.182.60',
    '41.74.182.61',
    '41.74.182.62',
    '41.74.182.63',
    '41.74.182.64',
    '41.74.182.65',
    '41.74.182.66',
    '41.74.182.67',
    '41.74.182.68',
    '41.74.182.69',
    '41.74.182.70',
    '41.74.182.71',
    '41.74.182.72',
    '41.74.182.73',
    '41.74.182.74',
    '41.74.182.75',
    '41.74.182.76',
    '41.74.182.77',
    '41.74.182.78',
    '41.74.182.79',
    '41.74.182.80',
    '41.74.182.81',
    '41.74.182.82',
    '41.74.182.83',
    '41.74.182.84',
    '41.74.182.85',
    '41.74.182.86',
    '41.74.182.87',
    '41.74.182.88',
    '41.74.182.89',
    '41.74.182.90',
    '41.74.182.91',
    '41.74.182.92',
    '41.74.182.93',
    '41.74.182.94',
    '41.74.182.95',
    '41.74.182.96',
    '41.74.182.97',
    '41.74.182.98',
    '41.74.182.99',
    '41.74.182.100',
    '41.74.182.101',
    '41.74.182.102',
    '41.74.182.103',
    '41.74.182.104',
    '41.74.182.105',
    '41.74.182.106',
    '41.74.182.107',
    '41.74.182.108',
    '41.74.182.109',
    '41.74.182.110',
    '41.74.182.111',
    '41.74.182.112',
    '41.74.182.113',
    '41.74.182.114',
    '41.74.182.115',
    '41.74.182.116',
    '41.74.182.117',
    '41.74.182.118',
    '41.74.182.119',
    '41.74.182.120',
    '41.74.182.121',
    '41.74.182.122',
    '41.74.182.123',
    '41.74.182.124',
    '41.74.182.125',
    '41.74.182.126',
    '41.74.182.127',
    '41.74.182.128',
    '41.74.182.129',
    '41.74.182.130',
    '41.74.182.131',
    '41.74.182.132',
    '41.74.182.133',
    '41.74.182.134',
    '41.74.182.135',
    '41.74.182.136',
    '41.74.182.137',
    '41.74.182.138',
    '41.74.182.139',
    '41.74.182.140',
    '41.74.182.141',
    '41.74.182.142',
    '41.74.182.143',
    '41.74.182.144',
    '41.74.182.145',
    '41.74.182.146',
    '41.74.182.147',
    '41.74.182.148',
    '41.74.182.149',
    '41.74.182.150',
    '41.74.182.151',
    '41.74.182.152',
    '41.74.182.153',
    '41.74.182.154',
    '41.74.182.155',
    '41.74.182.156',
    '41.74.182.157',
    '41.74.182.158',
    '41.74.182.159',
    '41.74.182.160',
    '41.74.182.161',
    '41.74.182.162',
    '41.74.182.163',
    '41.74.182.164',
    '41.74.182.165',
    '41.74.182.166',
    '41.74.182.167',
    '41.74.182.168',
    '41.74.182.169',
    '41.74.182.170',
    '41.74.182.171',
    '41.74.182.172',
    '41.74.182.173',
    '41.74.182.174',
    '41.74.182.175',
    '41.74.182.176',
    '41.74.182.177',
    '41.74.182.178',
    '41.74.182.179',
    '41.74.182.180',
    '41.74.182.181',
    '41.74.182.182',
    '41.74.182.183',
    '41.74.182.184',
    '41.74.182.185',
    '41.74.182.186',
    '41.74.182.187',
    '41.74.182.188',
    '41.74.182.189',
    '41.74.182.190',
    '41.74.182.191',
    '41.74.182.192',
    '41.74.182.193',
    '41.74.182.194',
    '41.74.182.195',
    '41.74.182.196',
    '41.74.182.197',
    '41.74.182.198',
    '41.74.182.199',
    '41.74.182.200',
  ];

  return validIPs.includes(ip);
}

export interface PayFastITNData {
  m_payment_id: string;
  pf_payment_id: string;
  payment_status: string;
  item_name: string;
  item_description: string;
  amount_gross: string;
  amount_fee: string;
  amount_net: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  name_first: string;
  name_last: string;
  email_address: string;
  merchant_id: string;
  signature: string;
}
