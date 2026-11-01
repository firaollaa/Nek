import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Check, 
  Crown, 
  Zap, 
  ShieldCheck, 
  X, 
  Lock, 
  Smartphone, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  RefreshCw,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { PaymentPlan, PaymentMethod, SubscriptionTier } from '../types';
import { PAYMENT_PLANS } from '../data/paymentPlans';

interface SubscriptionModalProps {
  currentTier: SubscriptionTier;
  onUpgrade: (plan: PaymentPlan, method: PaymentMethod) => void;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  currentTier,
  onUpgrade,
  onClose,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>(PAYMENT_PLANS[1]); // Default to Monthly 249 ETB
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('telebirr');
  const [phoneNumber, setPhoneNumber] = useState<string>('0912345678');
  const [paymentStep, setPaymentStep] = useState<'plans' | 'checkout' | 'processing' | 'success'>('plans');
  const [telebirrPin, setTelebirrPin] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');

  const handleStartCheckout = () => {
    setPaymentStep('checkout');
  };

  const handleProcessPayment = () => {
    setPaymentStep('processing');

    setTimeout(() => {
      const ref = `ASTU-TX-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTransactionRef(ref);
      setPaymentStep('success');

      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#f43f5e', '#10b981'],
      });

      onUpgrade(selectedPlan, paymentMethod);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>ASTU Spark Gold VIP</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">ETB</span>
              </h2>
              <p className="text-[11px] text-slate-400">Unlimited Campus Matches &amp; Advanced Filters</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: Select Plan */}
          {paymentStep === 'plans' && (
            <div className="space-y-5">
              {/* Value Pitch Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-amber-300">Pay securely in Ethiopian Birr (ETB).</span> Unlimited daily swipes, see who already liked your profile, and filter by specific ASTU schools!
                </div>
              </div>

              {/* Plans Grid */}
              <div className="space-y-3">
                {PAYMENT_PLANS.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-[10px] font-extrabold text-white uppercase tracking-wider shadow">
                          Most Popular at ASTU
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{plan.title}</span>
                            <span className="text-[10px] text-slate-400">{plan.durationLabel}</span>
                          </div>

                          <div className="mt-2 space-y-1">
                            {plan.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price Tag in Birr */}
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-amber-400 font-mono">
                            {plan.priceETB} <span className="text-xs font-semibold text-slate-300">ETB</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {plan.id === 'plan_weekly' ? '~14 Br/day' : plan.id === 'plan_monthly' ? '~8 Br/day' : 'Best Semester Deal'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue to Payment button */}
              <button
                type="button"
                onClick={handleStartCheckout}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <span>Continue to Birr Payment</span>
                <span className="font-mono">({selectedPlan.priceETB} ETB)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Ethiopian Birr Checkout (Telebirr, CBE Birr, Awash) */}
          {paymentStep === 'checkout' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Order Summary */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Selected Package</span>
                  <span className="font-bold text-white">{selectedPlan.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Amount Due</span>
                  <span className="font-mono font-bold text-amber-400 text-base">{selectedPlan.priceETB} ETB (Br)</span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Select Ethiopian Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'telebirr', name: 'telebirr', subtitle: 'Ethio Telecom', color: 'border-emerald-500 bg-emerald-500/10' },
                    { id: 'cbe_birr', name: 'CBE Birr', subtitle: 'Commercial Bank of Ethiopia', color: 'border-purple-500 bg-purple-500/10' },
                    { id: 'awash_birr', name: 'Awash Birr', subtitle: 'Awash Bank Wallet', color: 'border-blue-500 bg-blue-500/10' },
                    { id: 'chapa', name: 'Chapa Pay', subtitle: 'Debit Cards & Local Wallets', color: 'border-sky-500 bg-sky-500/10' },
                  ].map((method) => {
                    const isMethodSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isMethodSelected
                            ? 'border-amber-500 bg-amber-500/15 ring-1 ring-amber-500'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{method.name}</span>
                          {isMethodSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block leading-tight">{method.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Telebirr / CBE Birr Phone Input */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Enter {paymentMethod === 'telebirr' ? 'telebirr Mobile Number' : 'CBE Wallet Number'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">+251 (Ethiopia)</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">+251</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="09... or 07..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-14 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {paymentMethod === 'telebirr' && (
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">telebirr Security PIN (Demo Checkout)</label>
                    <input
                      type="password"
                      maxLength={6}
                      value={telebirrPin}
                      onChange={(e) => setTelebirrPin(e.target.value)}
                      placeholder="Enter 4-6 digit telebirr PIN"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white tracking-widest focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div className="text-[10px] text-slate-500 leading-tight">
                  Upon confirmation, an authorized USSD prompt will be sent to your mobile device to complete this transaction securely.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentStep('plans')}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back to Plans
                </button>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize {selectedPlan.priceETB} ETB via {paymentMethod === 'telebirr' ? 'telebirr' : 'CBE'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {paymentStep === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
                <Smartphone className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Connecting with {paymentMethod.toUpperCase()} Gateway</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Authorizing {selectedPlan.priceETB} ETB transaction for {phoneNumber}... Please wait while the campus network confirms your payment.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success Receipt */}
          {paymentStep === 'success' && (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  ASTU Spark VIP Status Activated
                </p>
              </div>

              {/* Digital Ethiopian Receipt */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">TRANSACTION REF</span>
                  <span className="font-mono font-bold text-white">{transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PLAN</span>
                  <span className="text-white font-semibold">{selectedPlan.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PAYMENT METHOD</span>
                  <span className="text-amber-400 uppercase font-mono">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AMOUNT PAID</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedPlan.priceETB} ETB (Br)</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-500">
                  <span>CAMPUS RECIPIENT</span>
                  <span>ASTU SPARK STUDENT NETWORK</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full max-w-sm py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all"
              >
                Start Exploring Unlimited ASTU Matches
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
