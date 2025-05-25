'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import DepositModal from '../components/DepositModal';
import './wallet.css';

export default function WalletPage() {
  const [walletData, setWalletData] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [sendForm, setSendForm] = useState({
    symbol: 'BTC',
    amount: '',
    toAddress: '',
    description: '',
  });

  // Используем ref для предотвращения дублирования депозитов
  const lastDepositRef = useRef(null);

  useEffect(() => {
    fetchCryptoPrices();
    fetchWalletData();

    // Обновляем курсы каждые 30 секунд
    const priceInterval = setInterval(fetchCryptoPrices, 30000);

    return () => clearInterval(priceInterval);
  }, []);

  const fetchCryptoPrices = async () => {
    try {
      // Получаем курсы с Binance API
      const response = await fetch(
        'https://api.binance.com/api/v3/ticker/price'
      );
      const prices = await response.json();

      // Создаем объект с курсами для наших криптовалют
      const priceMap = {};
      const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];

      symbols.forEach((symbol) => {
        const priceData = prices.find((p) => p.symbol === symbol);
        if (priceData) {
          const crypto = symbol.replace('USDT', '');
          priceMap[crypto] = Number.parseFloat(priceData.price);
        }
      });

      // USDT всегда равен 1 доллару
      priceMap.USDT = 1.0;

      setCryptoPrices(priceMap);
      console.log('Updated crypto prices:', priceMap);
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
    }
  };

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);

      // Получаем данные из localStorage или используем дефолтные
      const savedWalletData = localStorage.getItem('walletData');
      let mockWalletData;

      if (savedWalletData) {
        mockWalletData = JSON.parse(savedWalletData);
      } else {
        // Пока используем тестовые данные, но с реальными курсами
        mockWalletData = {
          wallets: [
            {
              id: '1',
              symbol: 'BTC',
              balance: '0.05234567',
              address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            },
            {
              id: '2',
              symbol: 'ETH',
              balance: '2.45678901',
              address: '0x742d35Cc6634C0532925a3b8D4C2C4e',
            },
            {
              id: '3',
              symbol: 'USDT',
              balance: '1250.00000000',
              address: '0x742d35Cc6634C0532925a3b8D4C2C4e',
            },
            {
              id: '4',
              symbol: 'BNB',
              balance: '5.12345678',
              address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
            },
            {
              id: '5',
              symbol: 'SOL',
              balance: '12.87654321',
              address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            },
          ],
          transactions: [
            {
              id: '1',
              type: 'DEPOSIT',
              symbol: 'BTC',
              amount: '0.01000000',
              status: 'CONFIRMED',
              createdAt: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
              description: 'Deposit from external wallet',
              fromAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
            },
            {
              id: '2',
              type: 'WITHDRAW',
              symbol: 'ETH',
              amount: '0.50000000',
              status: 'CONFIRMED',
              createdAt: new Date(
                Date.now() - 1 * 24 * 60 * 60 * 1000
              ).toISOString(),
              description: 'Send to DeFi protocol',
              toAddress: '0x8ba1f109551bD432803012645Hac136c',
            },
            {
              id: '3',
              type: 'TRADE',
              symbol: 'USDT',
              amount: '500.00000000',
              status: 'CONFIRMED',
              createdAt: new Date(
                Date.now() - 3 * 60 * 60 * 1000
              ).toISOString(),
              description: 'Buy BTC with USDT',
            },
            {
              id: '4',
              type: 'DEPOSIT',
              symbol: 'SOL',
              amount: '10.00000000',
              status: 'CONFIRMED',
              createdAt: new Date(
                Date.now() - 6 * 60 * 60 * 1000
              ).toISOString(),
              description: 'Solana staking rewards',
            },
            {
              id: '5',
              type: 'WITHDRAW',
              symbol: 'BNB',
              amount: '2.50000000',
              status: 'PENDING',
              createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              description: 'Send to Binance Smart Chain',
              toAddress: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
            },
          ],
        };
      }

      setWalletData(mockWalletData);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load wallet data');
      setIsLoading(false);
    }
  };

  const handleDeposit = (depositData) => {
    // Создаем уникальный ID для депозита
    const depositId = `${depositData.currency}_${
      depositData.amount
    }_${Date.now()}`;

    // Проверяем, не был ли этот депозит уже обработан
    if (lastDepositRef.current === depositId) {
      console.log('Duplicate deposit prevented');
      return;
    }

    lastDepositRef.current = depositId;

    console.log('Processing deposit:', depositData);

    // Получаем текущие данные из localStorage для точности
    const currentWalletData =
      JSON.parse(localStorage.getItem('walletData') || 'null') || walletData;

    const updatedData = { ...currentWalletData };

    // Находим кошелек для данной валюты
    const walletIndex = updatedData.wallets.findIndex(
      (w) => w.symbol === depositData.currency
    );

    if (walletIndex !== -1) {
      // Обновляем существующий кошелек
      const currentBalance = Number.parseFloat(
        updatedData.wallets[walletIndex].balance
      );
      const newBalance = currentBalance + depositData.amount;
      updatedData.wallets[walletIndex].balance = newBalance.toFixed(8);

      console.log(
        `Updated ${depositData.currency} balance from ${currentBalance} to ${newBalance}`
      );
    } else {
      // Создаем новый кошелек если его нет
      const newWallet = {
        id: Date.now().toString(),
        symbol: depositData.currency,
        balance: depositData.amount.toFixed(8),
        address: `${depositData.currency.toLowerCase()}1${Math.random()
          .toString(36)
          .substring(7)}`,
      };
      updatedData.wallets.push(newWallet);

      console.log(
        `Created new wallet for ${depositData.currency} with balance ${depositData.amount}`
      );
    }

    // Добавляем транзакцию
    const newTransaction = {
      id: depositId,
      type: 'DEPOSIT',
      symbol: depositData.currency,
      amount: depositData.amount.toFixed(8),
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      description: `Deposit via ${depositData.method}`,
      method: depositData.method,
    };

    updatedData.transactions = [newTransaction, ...updatedData.transactions];

    // Сохраняем в localStorage
    localStorage.setItem('walletData', JSON.stringify(updatedData));

    // Обновляем состояние
    setWalletData(updatedData);
    setIsDepositModalOpen(false);

    // Показываем уведомление об успехе
    alert(
      `Successfully deposited ${depositData.amount} ${depositData.currency}!`
    );
  };

  const calculateTotalBalance = () => {
    if (
      !walletData ||
      !cryptoPrices ||
      Object.keys(cryptoPrices).length === 0
    ) {
      return 0;
    }

    return walletData.wallets.reduce((total, wallet) => {
      const balance = Number.parseFloat(wallet.balance);
      const price = cryptoPrices[wallet.symbol] || 0;
      return total + balance * price;
    }, 0);
  };

  const calculateWalletValue = (balance, symbol) => {
    const balanceNum = Number.parseFloat(balance);
    const price = cryptoPrices[symbol] || 0;
    return balanceNum * price;
  };

  const get24hChange = () => {
    // Имитация изменения за 24 часа (в реальном приложении получать с API)
    return Math.random() > 0.5
      ? { value: (Math.random() * 5 + 0.5).toFixed(2), isPositive: true }
      : { value: (Math.random() * 3 + 0.1).toFixed(2), isPositive: false };
  };

  const handleSendTransaction = async (e) => {
    e.preventDefault();
    try {
      // В реальном приложении здесь будет запрос к API
      alert('Transaction sent successfully!');
      setSendForm({
        symbol: 'BTC',
        amount: '',
        toAddress: '',
        description: '',
      });
      setActiveTab('history');
      fetchWalletData();
    } catch (err) {
      alert('Transaction failed');
    }
  };

  const formatBalance = (balance, symbol) => {
    const num = Number.parseFloat(balance);
    if (symbol === 'USDT') {
      return num.toFixed(2);
    }
    return num.toFixed(8);
  };

  const formatPrice = (price) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } else if (price >= 1) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return '↓';
      case 'WITHDRAW':
        return '↑';
      case 'TRADE':
        return '⇄';
      default:
        return '•';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return 'positive';
      case 'WITHDRAW':
        return 'negative';
      case 'TRADE':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  if (isLoading) {
    return (
      <div className="wallet-page">
        <div className="wallet-header">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            Loading wallet and fetching live prices...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-page">
        <div className="wallet-header">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={fetchWalletData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalBalance = calculateTotalBalance();
  const change24h = get24hChange();

  return (
    <>
      <div className="wallet-page">
        <div className="wallet-header">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
          <h1 className="wallet-title">My Wallet</h1>
          <div className="price-update-indicator">
            <span className="live-indicator">🟢 Live Prices</span>
          </div>
        </div>

        <div className="wallet-tabs">
          <button
            className={`wallet-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`wallet-tab ${activeTab === 'deposit' ? 'active' : ''}`}
            onClick={() => setIsDepositModalOpen(true)}
          >
            💰 Deposit
          </button>
          <button
            className={`wallet-tab ${activeTab === 'send' ? 'active' : ''}`}
            onClick={() => setActiveTab('send')}
          >
            Send
          </button>
          <button
            className={`wallet-tab ${activeTab === 'receive' ? 'active' : ''}`}
            onClick={() => setActiveTab('receive')}
          >
            Receive
          </button>
          <button
            className={`wallet-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        <div className="wallet-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="total-balance-card">
                <h2 className="balance-title">Total Portfolio Value</h2>
                <div className="total-balance">{formatPrice(totalBalance)}</div>
                <div
                  className={`balance-change ${
                    change24h.isPositive ? 'positive' : 'negative'
                  }`}
                >
                  {change24h.isPositive ? '+' : '-'}
                  {change24h.value}% (24h)
                </div>

                {/* Добавляем кнопки действий */}
                <div className="balance-actions">
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="deposit-btn"
                  >
                    💰 Deposit Funds
                  </button>
                  <button
                    onClick={() => setActiveTab('send')}
                    className="send-btn"
                  >
                    📤 Send Crypto
                  </button>
                </div>
              </div>

              <div className="wallets-grid">
                <div className="section-header">
                  <h3 className="section-title">Your Wallets</h3>
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="add-funds-btn"
                  >
                    + Add Funds
                  </button>
                </div>
                {walletData?.wallets.map((wallet) => {
                  const currentPrice = cryptoPrices[wallet.symbol] || 0;
                  const walletValue = calculateWalletValue(
                    wallet.balance,
                    wallet.symbol
                  );

                  return (
                    <div key={wallet.id} className="wallet-card">
                      <div className="wallet-info">
                        <div className="crypto-icon">
                          {wallet.symbol.charAt(0)}
                        </div>
                        <div className="wallet-details">
                          <div className="wallet-symbol">{wallet.symbol}</div>
                          <div className="wallet-address">
                            {wallet.address.slice(0, 10)}...
                            {wallet.address.slice(-6)}
                          </div>
                          <div className="current-price">
                            {formatPrice(currentPrice)}
                          </div>
                        </div>
                      </div>
                      <div className="wallet-balance">
                        <div className="balance-amount">
                          {formatBalance(wallet.balance, wallet.symbol)}{' '}
                          {wallet.symbol}
                        </div>
                        <div className="balance-usd">
                          ≈ {formatPrice(walletValue)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="recent-transactions">
                <h3 className="section-title">Recent Transactions</h3>
                {walletData?.transactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="transaction-item">
                    <div className="transaction-icon">
                      <span
                        className={`tx-icon ${getTransactionColor(tx.type)}`}
                      >
                        {getTransactionIcon(tx.type)}
                      </span>
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-description">
                        {tx.description}
                      </div>
                      <div className="transaction-date">
                        {formatDate(tx.createdAt)}
                      </div>
                    </div>
                    <div className="transaction-amount">
                      <div className={`amount ${getTransactionColor(tx.type)}`}>
                        {tx.type === 'DEPOSIT'
                          ? '+'
                          : tx.type === 'WITHDRAW'
                          ? '-'
                          : ''}
                        {tx.amount} {tx.symbol}
                      </div>
                      <div className={`status ${tx.status.toLowerCase()}`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Остальные табы остаются без изменений */}
          {activeTab === 'send' && (
            <div className="send-tab">
              <div className="send-form-container">
                <h3 className="section-title">Send Cryptocurrency</h3>
                <form onSubmit={handleSendTransaction} className="send-form">
                  <div className="form-group">
                    <label htmlFor="symbol">Cryptocurrency</label>
                    <select
                      id="symbol"
                      value={sendForm.symbol}
                      onChange={(e) =>
                        setSendForm({ ...sendForm, symbol: e.target.value })
                      }
                      className="form-select"
                    >
                      {walletData?.wallets.map((wallet) => (
                        <option key={wallet.symbol} value={wallet.symbol}>
                          {wallet.symbol} (Balance:{' '}
                          {formatBalance(wallet.balance, wallet.symbol)}) -{' '}
                          {formatPrice(cryptoPrices[wallet.symbol] || 0)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                      type="number"
                      id="amount"
                      step="0.00000001"
                      value={sendForm.amount}
                      onChange={(e) =>
                        setSendForm({ ...sendForm, amount: e.target.value })
                      }
                      className="form-input"
                      placeholder="0.00000000"
                      required
                    />
                    {sendForm.amount && cryptoPrices[sendForm.symbol] && (
                      <div className="amount-usd">
                        ≈{' '}
                        {formatPrice(
                          Number.parseFloat(sendForm.amount) *
                            cryptoPrices[sendForm.symbol]
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="toAddress">Recipient Address</label>
                    <input
                      type="text"
                      id="toAddress"
                      value={sendForm.toAddress}
                      onChange={(e) =>
                        setSendForm({ ...sendForm, toAddress: e.target.value })
                      }
                      className="form-input"
                      placeholder="Enter recipient address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <input
                      type="text"
                      id="description"
                      value={sendForm.description}
                      onChange={(e) =>
                        setSendForm({
                          ...sendForm,
                          description: e.target.value,
                        })
                      }
                      className="form-input"
                      placeholder="Transaction description"
                    />
                  </div>

                  <div className="transaction-fee">
                    <div className="fee-info">
                      <span>Network Fee:</span>
                      <span>0.001 {sendForm.symbol}</span>
                    </div>
                  </div>

                  <button type="submit" className="send-button">
                    Send {sendForm.symbol}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'receive' && (
            <div className="receive-tab">
              <div className="receive-container">
                <h3 className="section-title">Receive Cryptocurrency</h3>
                <div className="receive-wallets">
                  {walletData?.wallets.map((wallet) => (
                    <div key={wallet.id} className="receive-wallet-card">
                      <div className="receive-header">
                        <div className="crypto-icon">
                          {wallet.symbol.charAt(0)}
                        </div>
                        <h4>{wallet.symbol} Wallet</h4>
                        <div className="current-price-small">
                          Current:{' '}
                          {formatPrice(cryptoPrices[wallet.symbol] || 0)}
                        </div>
                      </div>
                      <div className="receive-address">
                        <label>Your {wallet.symbol} Address:</label>
                        <div className="address-container">
                          <input
                            type="text"
                            value={wallet.address}
                            readOnly
                            className="address-input"
                          />
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(wallet.address)
                            }
                            className="copy-button"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div className="qr-placeholder">
                        <div className="qr-code">QR Code</div>
                        <p>Scan this QR code to get the address</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab">
              <h3 className="section-title">Transaction History</h3>
              <div className="transactions-list">
                {walletData?.transactions.map((tx) => (
                  <div key={tx.id} className="transaction-item detailed">
                    <div className="transaction-icon">
                      <span
                        className={`tx-icon ${getTransactionColor(tx.type)}`}
                      >
                        {getTransactionIcon(tx.type)}
                      </span>
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-description">
                        {tx.description}
                      </div>
                      <div className="transaction-meta">
                        <span className="transaction-date">
                          {formatDate(tx.createdAt)}
                        </span>
                        {tx.fromAddress && (
                          <span className="address">
                            From: {tx.fromAddress.slice(0, 10)}...
                            {tx.fromAddress.slice(-6)}
                          </span>
                        )}
                        {tx.toAddress && (
                          <span className="address">
                            To: {tx.toAddress.slice(0, 10)}...
                            {tx.toAddress.slice(-6)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="transaction-amount">
                      <div className={`amount ${getTransactionColor(tx.type)}`}>
                        {tx.type === 'DEPOSIT'
                          ? '+'
                          : tx.type === 'WITHDRAW'
                          ? '-'
                          : ''}
                        {tx.amount} {tx.symbol}
                      </div>
                      <div className="transaction-usd">
                        ≈{' '}
                        {formatPrice(
                          Number.parseFloat(tx.amount) *
                            (cryptoPrices[tx.symbol] || 0)
                        )}
                      </div>
                      <div className={`status ${tx.status.toLowerCase()}`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно депозита */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={handleDeposit}
      />
    </>
  );
}
