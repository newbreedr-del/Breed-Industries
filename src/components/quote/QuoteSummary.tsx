'use client';

import { theme } from '@/lib/theme';

export interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  pricingType?: 'one-time' | 'monthly';
}

interface QuoteSummaryProps {
  items: QuoteItem[];
  requireDeposit: boolean;
}

export function QuoteSummary({ items, requireDeposit }: QuoteSummaryProps) {
  const calculateTotals = () => {
    let oneTimeTotal = 0;
    let monthlyTotal = 0;

    items.forEach(item => {
      const amount = item.quantity * item.rate;
      if (item.pricingType === 'monthly') {
        monthlyTotal += amount;
      } else {
        oneTimeTotal += amount;
      }
    });

    const deposit = requireDeposit ? oneTimeTotal * 0.5 : 0;
    const balance = requireDeposit ? oneTimeTotal - deposit : oneTimeTotal;

    return { oneTimeTotal, monthlyTotal, deposit, balance };
  };

  const { oneTimeTotal, monthlyTotal, deposit, balance } = calculateTotals();

  const formatCurrency = (amount: number) => {
    return 'R ' + amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className={`${theme.cardAccent} p-6 sticky top-24`}>
      <h3 className="text-xl font-heading font-bold text-white mb-4">
        Quote Summary
      </h3>

      {/* Items List */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-start pb-3 border-b border-white/10 last:border-0">
            <div className="flex-1">
              <p className="text-white font-medium text-sm">
                {item.name}
                {item.pricingType === 'monthly' && (
                  <span className="text-accent text-xs ml-2">(Monthly)</span>
                )}
              </p>
              <p className="text-white/50 text-xs mt-1">
                Qty: {item.quantity} × {formatCurrency(item.rate)}
              </p>
            </div>
            <p className="text-white font-bold">
              {formatCurrency(item.quantity * item.rate)}
              {item.pricingType === 'monthly' && <span className="text-xs">/mo</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-4 border-t border-accent/30">
        {/* One-Time Total */}
        <div className="flex justify-between items-center">
          <span className={theme.text.secondary}>One-Time Fees:</span>
          <span className="text-white font-bold">{formatCurrency(oneTimeTotal)}</span>
        </div>

        {/* Monthly Total */}
        {monthlyTotal > 0 && (
          <div className="flex justify-between items-center">
            <span className={theme.text.secondary}>Monthly Fees:</span>
            <span className="text-white font-bold">
              {formatCurrency(monthlyTotal)}/mo
            </span>
          </div>
        )}

        {/* Deposit */}
        {requireDeposit && (
          <>
            <div className="flex justify-between items-center text-accent">
              <span className="font-semibold">50% Deposit:</span>
              <span className="font-bold">{formatCurrency(deposit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme.text.secondary}>Balance:</span>
              <span className="text-white font-bold">{formatCurrency(balance)}</span>
            </div>
          </>
        )}

        {/* Grand Total */}
        <div className="flex justify-between items-center pt-3 border-t border-accent/30">
          <span className="text-white font-heading font-bold">Total:</span>
          <span className="text-accent font-heading font-bold text-xl">
            {formatCurrency(oneTimeTotal)}
          </span>
        </div>

        {monthlyTotal > 0 && (
          <p className="text-white/50 text-xs">
            + {formatCurrency(monthlyTotal)}/mo recurring
          </p>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white/60 text-xs">
          All prices exclude VAT. Breed Industries is not VAT registered.
        </p>
      </div>
    </div>
  );
}
