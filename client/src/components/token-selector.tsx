import { TOKEN_CONFIG } from '@/lib/web3-config';

interface TokenSelectorProps {
  token: 'MON' | 'WMON';
  amount: string;
  balance: string;
  onAmountChange?: (amount: string) => void;
  readOnly?: boolean;
}

function MonadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <path d="M15 20 L50 5 L85 20 L85 35 L50 20 L15 35 Z" fill="#8B5CF6"/>
      <path d="M15 45 L50 30 L85 45 L85 60 L50 45 L15 60 Z" fill="#A855F7"/>
      <path d="M15 70 L50 55 L85 70 L85 85 L50 70 L15 85 Z" fill="#C084FC"/>
    </svg>
  );
}

export function TokenSelector({ token, amount, balance, onAmountChange, readOnly }: TokenSelectorProps) {
  const tokenInfo = TOKEN_CONFIG[token];

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="2"/>
            <rect x="3" y="7" width="18" height="2"/>
            <rect x="3" y="11" width="18" height="2"/>
          </svg>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-lg flex items-center justify-center">
          <MonadIcon className="w-6 h-6 text-white" />
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
          className="bg-transparent text-right text-2xl font-courier-bold border-none outline-none w-32 text-white placeholder-gray-500"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
