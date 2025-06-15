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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <div className="font-courier-bold text-white">{tokenInfo.symbol}</div>
          <div className="text-sm text-gray-400 font-courier">{tokenInfo.name}</div>
        </div>
      </div>
      <div className="text-right">
        <input 
          type="text" 
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="bg-transparent text-right text-xl font-courier border-none outline-none w-24 text-white placeholder-gray-500"
          readOnly={readOnly}
        />
        <div className="text-sm text-gray-400 font-courier">
          Balance: {balance}
        </div>
      </div>
    </div>
  );
}
