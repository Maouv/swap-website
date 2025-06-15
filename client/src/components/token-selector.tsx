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
    <div className="flex items-center justify-between gap-4 py-3">
      {/* Token Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
          <img src={tokenInfo.logo} alt={tokenInfo.symbol} className="w-full h-full object-contain" />
        </div>
        <div className="truncate">
          <div className="font-courier-bold text-white text-base leading-tight">
            {tokenInfo.symbol}
          </div>
          <div className="text-sm text-gray-400 font-courier leading-tight truncate">
            {tokenInfo.name}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="text-right w-1/2">
        <input
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="bg-transparent text-right text-2xl font-courier-bold border-none outline-none w-full"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
