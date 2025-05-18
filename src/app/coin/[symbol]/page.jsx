'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import React from 'react';
import './coin.css';
import Footer from '@/app/components/Footer';

export default function CoinDetailPage({ params }) {
  console.log();
  const { symbol } = React.use(params);
  const [coinData, setCoinData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1D');
  const [hoverInfo, setHoverInfo] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setIsLoading(true);

        // Получаем текущие данные о монете
        const tickerResponse = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}USDT`
        );

        // Если монета не найдена, выбрасываем ошибку
        if (!tickerResponse.ok) {
          throw new Error(`Cryptocurrency ${symbol} not found`);
        }

        const tickerData = await tickerResponse.json();

        // Получаем историю цен для графика (используем klines API)
        const interval = timeframeToInterval(timeframe);
        const klinesResponse = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=${interval}&limit=100`
        );
        const klinesData = await klinesResponse.json();

        // Форматируем данные для графика
        const chartData = klinesData.map((kline) => ({
          time: kline[0], // время открытия
          open: Number.parseFloat(kline[1]), // цена открытия
          high: Number.parseFloat(kline[2]), // максимальная цена
          low: Number.parseFloat(kline[3]), // минимальная цена
          close: Number.parseFloat(kline[4]), // цена закрытия
          volume: Number.parseFloat(kline[5]), // объем
        }));

        // Получаем информацию о монете (в реальном приложении это должно приходить с API)
        const coinInfo = getCoinInfo(symbol.toUpperCase());

        // Формируем полные данные о монете
        const formattedData = {
          name: getCoinName(symbol.toUpperCase()),
          symbol: symbol.toUpperCase(),
          price: Number.parseFloat(tickerData.lastPrice),
          priceChange: Number.parseFloat(tickerData.priceChangePercent),
          marketCap: coinInfo.marketCap,
          volume24h: Number.parseFloat(tickerData.quoteVolume),
          fdv: coinInfo.fdv,
          volMarketCapRatio: (
            (Number.parseFloat(tickerData.quoteVolume) / coinInfo.marketCap) *
            100
          ).toFixed(2),
          totalSupply: coinInfo.totalSupply,
          maxSupply: coinInfo.maxSupply,
          circulatingSupply: coinInfo.circulatingSupply,
          profileScore: 100,
          rank: coinInfo.rank,
          chartData: chartData,
        };

        setCoinData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        setError(error.message || 'Failed to load cryptocurrency data');
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, [symbol, timeframe]);

  // Преобразование временного интервала в формат для API
  const timeframeToInterval = (timeframe) => {
    switch (timeframe) {
      case '1D':
        return '15m';
      case '7D':
        return '2h';
      case '1M':
        return '6h';
      case '1Y':
        return '1d';
      case 'All':
        return '1w';
      default:
        return '15m';
    }
  };

  // Функция для получения информации о монете (имитация данных)
  const getCoinInfo = (symbol) => {
    const coinInfoMap = {
      BTC: {
        marketCap: 2090000000000,
        fdv: 2210000000000,
        totalSupply: '19.86M BTC',
        maxSupply: '21M BTC',
        circulatingSupply: '19.86M BTC',
        rank: 1,
      },
      ETH: {
        marketCap: 390000000000,
        fdv: 420000000000,
        totalSupply: '120.27M ETH',
        maxSupply: '∞',
        circulatingSupply: '120.27M ETH',
        rank: 2,
      },
      BNB: {
        marketCap: 76000000000,
        fdv: 95000000000,
        totalSupply: '153.85M BNB',
        maxSupply: '200M BNB',
        circulatingSupply: '153.85M BNB',
        rank: 3,
      },
      SOL: {
        marketCap: 58000000000,
        fdv: 82000000000,
        totalSupply: '562.19M SOL',
        maxSupply: '∞',
        circulatingSupply: '435.28M SOL',
        rank: 4,
      },
      XRP: {
        marketCap: 32000000000,
        fdv: 64000000000,
        totalSupply: '99.98B XRP',
        maxSupply: '100B XRP',
        circulatingSupply: '54.94B XRP',
        rank: 5,
      },
    };

    // Возвращаем данные о монете или дефолтные значения, если монета не найдена
    return (
      coinInfoMap[symbol] || {
        marketCap: 1000000000,
        fdv: 1500000000,
        totalSupply: '100M ' + symbol,
        maxSupply: '100M ' + symbol,
        circulatingSupply: '50M ' + symbol,
        rank: 100,
      }
    );
  };

  // Функция для получения полного названия криптовалюты
  function getCoinName(symbol) {
    const names = {
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      BNB: 'BNB',
      SOL: 'Solana',
      XRP: 'XRP',
      ADA: 'Cardano',
      AVAX: 'Avalanche',
      DOT: 'Polkadot',
      MATIC: 'Polygon',
      LINK: 'Chainlink',
      DOGE: 'Dogecoin',
      SHIB: 'Shiba Inu',
      LTC: 'Litecoin',
      UNI: 'Uniswap',
      ATOM: 'Cosmos',
    };

    return names[symbol] || symbol;
  }

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Форматирование больших чисел
  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  // Форматирование даты
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Форматирование времени
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // Обработчик наведения мыши на график
  const handleMouseMove = (e) => {
    if (
      !chartRef.current ||
      !coinData ||
      !coinData.chartData ||
      coinData.chartData.length === 0
    )
      return;

    const chartRect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - chartRect.left;
    const chartWidth = chartRect.width;

    // Вычисляем индекс точки данных на основе позиции мыши
    const dataIndex = Math.min(
      Math.floor((x / chartWidth) * coinData.chartData.length),
      coinData.chartData.length - 1
    );

    if (dataIndex >= 0) {
      const dataPoint = coinData.chartData[dataIndex];
      setHoverInfo({
        price: dataPoint.close,
        time: dataPoint.time,
        x: x,
        y:
          chartRect.height -
          ((dataPoint.close - minPrice) / (maxPrice - minPrice)) *
            chartRect.height,
      });
    }
  };

  // Обработчик ухода мыши с графика
  const handleMouseLeave = () => {
    setHoverInfo(null);
  };

  // Отображаем загрузку, если данные еще не получены
  if (isLoading) {
    return (
      <div className="coin-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Отображаем ошибку, если что-то пошло не так
  if (error) {
    return (
      <div className="coin-detail-page">
        <div className="error-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  // Определяем минимальную и максимальную цену для масштабирования графика
  const prices = coinData.chartData.map((d) => d.close);
  const minPrice = Math.min(...prices) * 0.995; // Немного уменьшаем для отступа
  const maxPrice = Math.max(...prices) * 1.005; // Немного увеличиваем для отступа

  // Определяем, растет или падает цена
  const priceIncreasing = coinData.priceChange >= 0;
  const lineColor = priceIncreasing ? '#00c853' : '#ff3d00';
  const changeColor = priceIncreasing ? 'positive' : 'negative';
  const changeIcon = priceIncreasing ? '▲' : '▼';

  // Создаем путь для SVG линии
  const createChartPath = () => {
    if (!coinData.chartData || coinData.chartData.length === 0) return '';

    const height = 400;
    const width = chartRef.current ? chartRef.current.clientWidth : 1000;
    const xStep = width / (coinData.chartData.length - 1);

    return coinData.chartData
      .map((point, i) => {
        const x = i * xStep;
        const y =
          height - ((point.close - minPrice) / (maxPrice - minPrice)) * height;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="with-footer">
      <div className="coin-detail-page">
        <div className="coin-header">
          <Link href="/market" className="back-link">
            ← Back to Market
          </Link>
        </div>

        <div className="coin-main-info">
          <div className="coin-title">
            <div className="coin-icon">{coinData.symbol.charAt(0)}</div>
            <h1 className="coin-name">
              {coinData.name}{' '}
              <span className="coin-symbol">{coinData.symbol}</span>{' '}
              <span className="coin-rank">#{coinData.rank}</span>
            </h1>
          </div>
          <div className="coin-actions">
            <button className="action-button">
              <span className="star-icon">★</span> 5M
            </button>
            <button className="action-button">
              <span className="share-icon">↗</span>
            </button>
          </div>
        </div>

        <div className="coin-price-container">
          <h2 className="coin-price-lw">${coinData.price.toLocaleString()}</h2>
          <div className={`coin-price-change ${changeColor}`}>
            <span className="change-icon">{changeIcon}</span>{' '}
            {Math.abs(coinData.priceChange).toFixed(2)}% (1d)
          </div>
        </div>

        <div className="coin-stats-grid">
          <div className="coin-stat-card">
            <div className="stat-title">
              Market cap <span className="info-icon">ⓘ</span>
            </div>
            <div className="stat-value">
              ${formatNumber(coinData.marketCap)}
            </div>
            <div className={`stat-change ${changeColor}`}>
              <span className="change-icon">{changeIcon}</span>{' '}
              {Math.abs(coinData.priceChange).toFixed(2)}%
            </div>
          </div>

          <div className="coin-stat-card">
            <div className="stat-title">
              Volume (24h) <span className="info-icon">ⓘ</span>
            </div>
            <div className="stat-value">
              ${formatNumber(coinData.volume24h)}
            </div>
            <div className="stat-change positive">
              <span className="change-icon">▲</span> 2.47%
            </div>
          </div>

          <div className="coin-stat-card">
            <div className="stat-title">
              FDV <span className="info-icon">ⓘ</span>
            </div>
            <div className="stat-value">${formatNumber(coinData.fdv)}</div>
          </div>

          <div className="coin-stat-card">
            <div className="stat-title">
              Vol/Mkt Cap (24h) <span className="info-icon">ⓘ</span>
            </div>
            <div className="stat-value">{coinData.volMarketCapRatio}%</div>
          </div>

          <div className="coin-stat-card">
            <div className="stat-title">
              Total supply <span className="info-icon">ⓘ</span>
            </div>
            <div className="stat-value">{coinData.totalSupply}</div>
          </div>

          <div className="coin-stat-card">
            <div className="stat-title">
              Max. supply <span className="info-icon">ⓘ</span>
            </div>
            <div className="stat-value">{coinData.maxSupply}</div>
          </div>

          <div className="coin-stat-card">
            <div className="stat-title">
              Circulating supply <span className="info-icon">ⓘ</span>
            </div>
            <div className="stat-value">{coinData.circulatingSupply}</div>
          </div>

          <div className="coin-stat-card">
            <div className="stat-title">
              Profile score <span className="info-icon">ⓘ</span>
            </div>
            <div className="profile-score-container">
              <div className="profile-score-bar">
                <div
                  className="profile-score-fill"
                  style={{ width: `${coinData.profileScore}%` }}
                ></div>
              </div>
              <div className="profile-score-value">
                {coinData.profileScore}%
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div
            className="chart-area"
            ref={chartRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <svg width="100%" height="400" className="chart-svg">
              {/* Горизонтальные линии сетки */}
              {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={400 * ratio}
                  x2="100%"
                  y2={400 * ratio}
                  stroke="#333"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
              ))}

              {/* Линия графика */}
              <path
                d={createChartPath()}
                stroke={lineColor}
                strokeWidth="2"
                fill="none"
              />

              {/* Градиентная заливка под графиком */}
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={`${lineColor}33`} />
                <stop offset="100%" stopColor={`${lineColor}00`} />
              </linearGradient>
              <path
                d={`${createChartPath()} L${
                  chartRef.current ? chartRef.current.clientWidth : 1000
                },400 L0,400 Z`}
                fill="url(#chartGradient)"
              />

              {/* Точка при наведении */}
              {hoverInfo && (
                <circle
                  cx={hoverInfo.x}
                  cy={hoverInfo.y}
                  r="4"
                  fill={lineColor}
                  stroke="#fff"
                  strokeWidth="2"
                />
              )}
            </svg>

            {/* Ценовые метки справа */}
            <div className="price-scale">
              <div className="price-scale-item">{maxPrice.toFixed(2)}</div>
              <div className="price-scale-item">
                {(minPrice + (maxPrice - minPrice) * 0.75).toFixed(2)}
              </div>
              <div className="price-scale-item">
                {(minPrice + (maxPrice - minPrice) * 0.5).toFixed(2)}
              </div>
              <div className="price-scale-item">
                {(minPrice + (maxPrice - minPrice) * 0.25).toFixed(2)}
              </div>
              <div className="price-scale-item">{minPrice.toFixed(2)}</div>
            </div>

            {/* Информация при наведении */}
            {hoverInfo && (
              <div
                className="hover-info"
                style={{
                  left:
                    hoverInfo.x > chartRef.current.clientWidth / 2
                      ? hoverInfo.x - 150
                      : hoverInfo.x + 20,
                  top: hoverInfo.y - 80,
                }}
              >
                <div className="hover-date">{formatDate(hoverInfo.time)}</div>
                <div className="hover-time">{formatTime(hoverInfo.time)}</div>
                <div className="hover-price">
                  <span className="hover-label">Price:</span>{' '}
                  {formatPrice(hoverInfo.price)}
                </div>
              </div>
            )}
          </div>

          <div className="chart-timeframes">
            <button
              className={`timeframe-button ${
                timeframe === '1D' ? 'active' : ''
              }`}
              onClick={() => setTimeframe('1D')}
            >
              1D
            </button>
            <button
              className={`timeframe-button ${
                timeframe === '7D' ? 'active' : ''
              }`}
              onClick={() => setTimeframe('7D')}
            >
              7D
            </button>
            <button
              className={`timeframe-button ${
                timeframe === '1M' ? 'active' : ''
              }`}
              onClick={() => setTimeframe('1M')}
            >
              1M
            </button>
            <button
              className={`timeframe-button ${
                timeframe === '1Y' ? 'active' : ''
              }`}
              onClick={() => setTimeframe('1Y')}
            >
              1Y
            </button>
            <button
              className={`timeframe-button ${
                timeframe === 'All' ? 'active' : ''
              }`}
              onClick={() => setTimeframe('All')}
            >
              All
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
