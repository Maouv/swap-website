import { TOKEN_CONFIG } from '@/lib/web3-config';

interface TokenSelectorProps {
  token: 'MON' | 'WMON';
  amount: string;
  balance: string;
  onAmountChange?: (amount: string) => void;
  readOnly?: boolean;
}

export function TokenSelector({ token, amount, balance, onAmountChange, readOnly }: TokenSelectorProps) {
  const tokenInfo = TOKEN_CONFIG[token];

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="2" />
            <rect x="3" y="7" width="18" height="2" />
            <rect x="3" y="11" width="18" height="2" />
          </svg>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src={tokenInfo.logo} alt={tokenInfo.symbol} className="w-8 h-8 object-cover" />
        </div>
        <div>
          <div className="font-courier-bold text-white text-lg">{tokenInfo.symbol}</div>
          <div className="text-sm text-gray-400 font-courier">{tokenInfo.name}</div>
        </div>
      </div>
      <div className="text-right">
        <input
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="bg-transparent text-right text-2xl font-courier-bold border-none outline-none"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
