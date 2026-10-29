import React, { useState } from 'react';
import { Calculator, HelpCircle, CheckCircle, AlertCircle, Coins } from 'lucide-react';

export const ZakatCalculatorSection: React.FC = () => {
  // Asset values in USD (or local currency units)
  const [cash, setCash] = useState<number>(0);
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(85); // ~$85/g gold
  const [silverGrams, setSilverGrams] = useState<number>(0);
  const [silverPricePerGram, setSilverPricePerGram] = useState<number>(1.05); // ~$1.05/g silver
  const [stocksAndInvestments, setStocksAndInvestments] = useState<number>(0);
  const [businessInventory, setBusinessInventory] = useState<number>(0);
  const [moneyOwedToYou, setMoneyOwedToYou] = useState<number>(0);

  // Liabilities
  const [shortTermDebts, setShortTermDebts] = useState<number>(0);
  const [dueBills, setDueBills] = useState<number>(0);

  // Standard: Gold (85g) or Silver (595g)
  const [nisabStandard, setNisabStandard] = useState<'gold' | 'silver'>('gold');

  const goldValue = goldGrams * goldPricePerGram;
  const silverValue = silverGrams * silverPricePerGram;

  const totalAssets = cash + goldValue + silverValue + stocksAndInvestments + businessInventory + moneyOwedToYou;
  const totalLiabilities = shortTermDebts + dueBills;
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);

  const goldNisabThreshold = 85 * goldPricePerGram;
  const silverNisabThreshold = 595 * silverPricePerGram;
  const selectedNisab = nisabStandard === 'gold' ? goldNisabThreshold : silverNisabThreshold;

  const isEligible = netZakatableWealth >= selectedNisab;
  const zakatDue = isEligible ? netZakatableWealth * 0.025 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              <span>Third Pillar of Islam</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Interactive Zakat Calculator</h2>
            <p className="text-xs text-slate-400 mt-1">
              Calculate your mandatory 2.5% annual Zakat on surplus qualifying assets held for a full lunar year (Hawl).
            </p>
          </div>

          {/* Nisab Selector */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium pl-1">Nisab Standard:</span>
            <button
              onClick={() => setNisabStandard('gold')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                nisabStandard === 'gold'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gold (85g)
            </button>
            <button
              onClick={() => setNisabStandard('silver')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                nisabStandard === 'silver'
                  ? 'bg-slate-200 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Silver (595g)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Zakatable Assets */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Coins className="w-4 h-4" />
              <span>1. Zakatable Assets (Cash & Wealth)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Cash in Bank & Hand ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cash || ''}
                  onChange={(e) => setCash(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Stocks & Investments ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={stocksAndInvestments || ''}
                  onChange={(e) => setStocksAndInvestments(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Gold Weight (Grams)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={goldGrams || ''}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    placeholder="0 g"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    title="Price per gram in $"
                    value={goldPricePerGram}
                    onChange={(e) => setGoldPricePerGram(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-400 text-center"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Est. Value: ${goldValue.toLocaleString()} (${goldPricePerGram}/g)
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Silver Weight (Grams)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={silverGrams || ''}
                    onChange={(e) => setSilverGrams(Number(e.target.value))}
                    placeholder="0 g"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    title="Price per gram in $"
                    value={silverPricePerGram}
                    onChange={(e) => setSilverPricePerGram(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-400 text-center"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Est. Value: ${silverValue.toLocaleString()} (${silverPricePerGram}/g)
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Business Merchandise / Goods ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={businessInventory || ''}
                  onChange={(e) => setBusinessInventory(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Loans Expected Back ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={moneyOwedToYou || ''}
                  onChange={(e) => setMoneyOwedToYou(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Deductible Liabilities */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <HelpCircle className="w-4 h-4" />
              <span>2. Deductible Current Liabilities</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Immediate Debts Due Now ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={shortTermDebts || ''}
                  onChange={(e) => setShortTermDebts(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Overdue Bills & Living Expenses ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dueBills || ''}
                  onChange={(e) => setDueBills(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950 rounded-2xl border border-emerald-500/30 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Calculation Summary</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Total Zakatable Assets:</span>
                <span className="font-bold text-white">${totalAssets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Total Deductions:</span>
                <span className="font-bold text-red-400">-${totalLiabilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300 font-semibold">Net Zakatable Wealth:</span>
                <span className="font-bold text-emerald-300 text-sm">
                  ${netZakatableWealth.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Nisab Threshold ({nisabStandard.toUpperCase()}):</span>
                <span className="font-semibold text-slate-200">
                  ${selectedNisab.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Eligibility Banner */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              {isEligible ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Wealth meets or exceeds Nisab</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Zakat is obligatory on your net surplus wealth at the standard 2.5% rate.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Below Nisab threshold</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Your net assets do not meet the minimum Nisab. Zakat is not obligatory, though voluntary Sadaqah is always rewarded.
                  </p>
                </div>
              )}
            </div>

            {/* Total Zakat Due */}
            <div className="mt-5 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider block">
                Total Zakat Due (2.5%)
              </span>
              <span className="text-3xl font-extrabold text-white mt-1 block">
                ${zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-2">
            <span className="font-semibold text-slate-300 block">Surah At-Tawbah (9:60) Eligible Recipients:</span>
            <p className="leading-relaxed">
              Zakat must be distributed to: The poor (Fuqara), the needy (Masakin), zakat administrators, those whose hearts are to be reconciled, freeing captives, those in debt, in the cause of Allah, and the stranded traveler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
