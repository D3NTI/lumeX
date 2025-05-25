'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DepositModal({ isOpen, onClose, onDeposit }) {
  const { user } = useAuth();
  const [depositForm, setDepositForm] = useState({
    currency: 'USDT',
    amount: '',
    method: 'bank_transfer',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: confirmation, 3: success

  const currencies = [
    { symbol: 'USDT', name: 'Tether USD', icon: '💵', minAmount: 10 },
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', minAmount: 0.001 },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', minAmount: 0.01 },
    { symbol: 'BNB', name: 'Binance Coin', icon: '🟡', minAmount: 0.1 },
    { symbol: 'SOL', name: 'SolanaSOSIHUI', icon: '🟣', minAmount: 1 },
  ];

  const depositMethods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      fee: '0%',
      time: '1-3 business days',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      fee: '2.5%',
      time: 'Instant',
    },
    {
      id: 'crypto',
      name: 'Crypto Transfer',
      icon: '₿',
      fee: 'Network fee',
      time: '10-30 minutes',
    },
    {
      id: 'demo',
      name: 'Demo Funds (Free)',
      icon: '🎮',
      fee: 'Free',
      time: 'Instant',
    },
  ];

  const selectedCurrency = currencies.find(
    (c) => c.symbol === depositForm.currency
  );
  const selectedMethod = depositMethods.find(
    (m) => m.id === depositForm.method
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepositForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const amount = Number.parseFloat(depositForm.amount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return false;
    }
    if (amount < selectedCurrency.minAmount) {
      alert(
        `Minimum deposit amount is ${selectedCurrency.minAmount} ${selectedCurrency.symbol}`
      );
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep(2);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);

    // Симуляция обработки депозита
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Вызываем callback для обновления баланса
    if (onDeposit) {
      onDeposit({
        currency: depositForm.currency,
        amount: Number.parseFloat(depositForm.amount),
        method: depositForm.method,
      });
    }

    setIsProcessing(false);
    setStep(3);
  };

  const handleClose = () => {
    setStep(1);
    setDepositForm({
      currency: 'USDT',
      amount: '',
      method: 'bank_transfer',
    });
    onClose();
  };

  const calculateFee = () => {
    const amount = Number.parseFloat(depositForm.amount) || 0;
    if (depositForm.method === 'card') {
      return amount * 0.025;
    }
    return 0;
  };

  const calculateTotal = () => {
    const amount = Number.parseFloat(depositForm.amount) || 0;
    const fee = calculateFee();
    return amount + fee;
  };

  if (!isOpen) return null;

  return (
    <div className="deposit-modal-overlay" onClick={handleClose}>
      <div className="deposit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="deposit-header">
          <h2>
            {step === 1 && 'Deposit Funds'}
            {step === 2 && 'Confirm Deposit'}
            {step === 3 && 'Deposit Successful'}
          </h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="deposit-content">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="deposit-form">
              <div className="form-section">
                <h3>Select Currency</h3>
                <div className="currency-grid">
                  {currencies.map((currency) => (
                    <label key={currency.symbol} className="currency-option">
                      <input
                        type="radio"
                        name="currency"
                        value={currency.symbol}
                        checked={depositForm.currency === currency.symbol}
                        onChange={handleInputChange}
                      />
                      <div className="currency-card">
                        <span className="currency-icon">{currency.icon}</span>
                        <div className="currency-info">
                          <div className="currency-symbol">
                            {currency.symbol}
                          </div>
                          <div className="currency-name">{currency.name}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Deposit Amount</h3>
                <div className="amount-input-container">
                  <input
                    type="number"
                    name="amount"
                    value={depositForm.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="any"
                    min={selectedCurrency?.minAmount}
                    className="amount-input"
                    required
                  />
                  <span className="currency-label">{depositForm.currency}</span>
                </div>
                <div className="amount-info">
                  Minimum: {selectedCurrency?.minAmount}{' '}
                  {selectedCurrency?.symbol}
                </div>
                <div className="quick-amounts">
                  {depositForm.currency === 'USDT' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setDepositForm({ ...depositForm, amount: '100' })
                        }
                      >
                        $100
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDepositForm({ ...depositForm, amount: '500' })
                        }
                      >
                        $500
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDepositForm({ ...depositForm, amount: '1000' })
                        }
                      >
                        $1000
                      </button>
                    </>
                  )}
                  {depositForm.currency === 'BTC' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setDepositForm({ ...depositForm, amount: '0.01' })
                        }
                      >
                        0.01 BTC
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDepositForm({ ...depositForm, amount: '0.1' })
                        }
                      >
                        0.1 BTC
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDepositForm({ ...depositForm, amount: '1' })
                        }
                      >
                        1 BTC
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="method-grid">
                  {depositMethods.map((method) => (
                    <label key={method.id} className="method-option">
                      <input
                        type="radio"
                        name="method"
                        value={method.id}
                        checked={depositForm.method === method.id}
                        onChange={handleInputChange}
                      />
                      <div className="method-card">
                        <span className="method-icon">{method.icon}</span>
                        <div className="method-info">
                          <div className="method-name">{method.name}</div>
                          <div className="method-details">
                            Fee: {method.fee} • {method.time}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="continue-btn">
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="confirmation-step">
              <div className="confirmation-details">
                <h3>Deposit Summary</h3>
                <div className="summary-item">
                  <span>Currency:</span>
                  <span>
                    {selectedCurrency?.icon} {selectedCurrency?.name}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Amount:</span>
                  <span>
                    {depositForm.amount} {depositForm.currency}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Payment Method:</span>
                  <span>
                    {selectedMethod?.icon} {selectedMethod?.name}
                  </span>
                </div>
                {calculateFee() > 0 && (
                  <div className="summary-item">
                    <span>Fee:</span>
                    <span>
                      {calculateFee().toFixed(2)} {depositForm.currency}
                    </span>
                  </div>
                )}
                <div className="summary-item total">
                  <span>Total:</span>
                  <span>
                    {calculateTotal().toFixed(8)} {depositForm.currency}
                  </span>
                </div>
              </div>

              {depositForm.method === 'demo' && (
                <div className="demo-notice">
                  <span className="demo-icon">🎮</span>
                  <div>
                    <strong>Demo Mode</strong>
                    <p>
                      These are virtual funds for testing purposes only. No real
                      money will be charged.
                    </p>
                  </div>
                </div>
              )}

              <div className="confirmation-actions">
                <button onClick={() => setStep(1)} className="back-btn">
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="confirm-btn"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="success-step">
              <div className="success-icon">✅</div>
              <h3>Deposit Successful!</h3>
              <p>
                Your deposit of {depositForm.amount} {depositForm.currency} has
                been processed successfully.
              </p>
              <div className="success-details">
                <div className="detail-item">
                  <span>Transaction ID:</span>
                  <span>TXN{Date.now()}</span>
                </div>
                <div className="detail-item">
                  <span>Status:</span>
                  <span className="status-confirmed">Confirmed</span>
                </div>
              </div>
              <button onClick={handleClose} className="done-btn">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
