'use client';

import { useState, useEffect } from 'react';
import './CryptoTable.css';

// Создаем кэш для API запросов
const apiCache = {
  data: null,
  timestamp: 0,
  CACHE_DURATION: 3 * 60 * 1000, // 3 минуты в миллисекундах (было 5 минут)

  // Сохранение данных в кэш
  saveToCache: function (data) {
    this.data = data;
    this.timestamp = Date.now();

    // Сохраняем в localStorage для персистентности между сессиями
    try {
      localStorage.setItem(
        'cryptoApiCache',
        JSON.stringify({
          data,
          timestamp: this.timestamp,
        })
      );
    } catch (e) {
      console.warn('Не удалось сохранить кэш в localStorage:', e);
    }
  },

  // Загрузка данных из кэша
  loadFromCache: function () {
    // Если данные уже есть в памяти и не устарели, используем их
    if (this.data && Date.now() - this.timestamp < this.CACHE_DURATION) {
      return this.data;
    }

    // Пробуем загрузить из localStorage
    try {
      const cachedData = localStorage.getItem('cryptoApiCache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (Date.now() - parsed.timestamp < this.CACHE_DURATION) {
          this.data = parsed.data;
          this.timestamp = parsed.timestamp;
          return this.data;
        }
      }
    } catch (e) {
      console.warn('Не удалось загрузить кэш из localStorage:', e);
    }

    return null;
  },

  // Проверка актуальности кэша
  isCacheValid: function () {
    return this.data && Date.now() - this.timestamp < this.CACHE_DURATION;
  },

  // Очистка кэша
  clearCache: function () {
    this.data = null;
    this.timestamp = 0;
    try {
      localStorage.removeItem('cryptoApiCache');
    } catch (e) {
      console.warn('Не удалось очистить кэш из localStorage:', e);
    }
  },
};

function CryptoTable() {
  const [activeTab, setActiveTab] = useState('derivatives');
  const [cryptoData, setCryptoData] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Загружаем избранное из localStorage при инициализации
    try {
      const savedFavorites = localStorage.getItem('cryptoFavorites');
      return savedFavorites ? JSON.parse(savedFavorites) : ['BTC', 'ETH'];
    } catch (e) {
      return ['BTC', 'ETH'];
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Увеличиваем количество отображаемых криптовалют с 6 до 9
  const MAX_DISPLAY_COINS = 9;

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setIsLoading(true);

        // Проверяем, есть ли данные в кэше
        const cachedData = apiCache.loadFromCache();
        if (cachedData) {
          console.log('Используем данные из кэша');
          setCryptoData(cachedData);
          setIsLoading(false);
          return;
        }

        // Если кэш недействителен или пуст, делаем новый запрос
        console.log('Загружаем новые данные с API');

        // Получаем данные о всех торговых парах с Binance
        const response = await fetch(
          'https://api.binance.com/api/v3/ticker/24hr'
        );
        const allData = await response.json();

        // Фильтруем только основные USDT пары (расширенный список)
        const mainCoins = [
          'BTC',
          'ETH',
          'BNB',
          'SOL',
          'XRP',
          'ADA',
          'AVAX',
          'DOT',
          'MATIC',
          'LINK',
          'DOGE',
          'SHIB',
          'LTC',
          'UNI',
          'ATOM',
        ];

        const usdtPairs = allData
          .filter(
            (pair) =>
              pair.symbol.endsWith('USDT') &&
              mainCoins.some((coin) => pair.symbol === `${coin}USDT`) &&
              !pair.symbol.includes('UP') &&
              !pair.symbol.includes('DOWN')
          )
          .map((pair) => {
            const symbol = pair.symbol.replace('USDT', '');
            return {
              symbol,
              fullSymbol: pair.symbol,
              price: Number.parseFloat(pair.lastPrice),
              priceChange24h: Number.parseFloat(pair.priceChangePercent),
              priceChange7h:
                Number.parseFloat(pair.priceChangePercent) *
                (Math.random() > 0.5 ? 1.2 : 0.8), // Имитация 7ч изменения
              volume: Number.parseFloat(pair.quoteVolume),
            };
          });

        // Добавляем дополнительные данные
        const enrichedData = usdtPairs.map((pair, index) => {
          // Имитация данных о рыночной капитализации и циркулирующем предложении
          const circulatingSupply = getCirculatingSupply(pair.symbol);
          const marketCap = pair.price * circulatingSupply;

          // Добавляем данные о стейкинге и доходности (имитация)
          const stakingData = getStakingData(pair.symbol);

          return {
            ...pair,
            rank: index + 1,
            marketCap,
            circulatingSupply,
            isFavorite: favorites.includes(pair.symbol),
            stakingYield: stakingData.yield,
            stakingAvailable: stakingData.available,
          };
        });

        // Сортируем по рыночной капитализации
        const sortedData = enrichedData.sort(
          (a, b) => b.marketCap - a.marketCap
        );

        // Сохраняем данные в кэш
        apiCache.saveToCache(sortedData);

        setCryptoData(sortedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при получении данных о криптовалютах:', error);
        setError('Не удалось получить данные о криптовалютах');
        setIsLoading(false);
      }
    };

    fetchCryptoData();

    // Обновляем данные каждые 3 минуты (было 5 минут)
    const intervalId = setInterval(fetchCryptoData, 3 * 60 * 1000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [favorites]);

  // Сохраняем избранное в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('cryptoFavorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Не удалось сохранить избранное в localStorage:', e);
    }
  }, [favorites]);

  // Функция для получения приблизительного циркулирующего предложения
  const getCirculatingSupply = (symbol) => {
    const supplyData = {
      BTC: 19500000,
      ETH: 120000000,
      BNB: 155000000,
      SOL: 430000000,
      XRP: 53000000000,
      ADA: 35000000000,
      AVAX: 360000000,
      DOT: 1200000000,
      MATIC: 9500000000,
      LINK: 580000000,
      DOGE: 142000000000,
      SHIB: 589000000000000,
      LTC: 73000000,
      UNI: 750000000,
      ATOM: 300000000,
    };

    return supplyData[symbol] || 1000000000;
  };

  // Функция для получения данных о стейкинге (имитация)
  const getStakingData = (symbol) => {
    const stakingYields = {
      ETH: 4.5,
      SOL: 6.2,
      ADA: 5.1,
      DOT: 12.0,
      AVAX: 9.8,
      MATIC: 10.5,
      ATOM: 15.2,
      BNB: 8.4,
      XRP: 2.1,
      LINK: 3.8,
      // Для остальных монет доходность не определена
    };

    return {
      yield: stakingYields[symbol] || 0,
      available: symbol in stakingYields,
    };
  };

  // Функция для форматирования больших чисел
  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + ' K';
    return num.toFixed(2);
  };

  // Функция для форматирования цены
  const formatPrice = (price) => {
    return '₿' + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  // Функция для переключения избранного
  const toggleFavorite = (symbol) => {
    if (favorites.includes(symbol)) {
      setFavorites(favorites.filter((fav) => fav !== symbol));
    } else {
      setFavorites([...favorites, symbol]);
    }
  };

  // Функция для фильтрации данных в зависимости от активной вкладки
  const getFilteredData = () => {
    let filtered = [];

    switch (activeTab) {
      case 'favorites':
        filtered = cryptoData.filter((crypto) =>
          favorites.includes(crypto.symbol)
        );
        break;
      case 'trending':
        filtered = cryptoData
          .sort((a, b) => b.volume - a.volume)
          .slice(0, MAX_DISPLAY_COINS);
        break;
      case 'topGainers':
        filtered = cryptoData
          .sort((a, b) => b.priceChange24h - a.priceChange24h)
          .slice(0, MAX_DISPLAY_COINS);
        break;
      case 'topLosers':
        filtered = cryptoData
          .sort((a, b) => a.priceChange24h - b.priceChange24h)
          .slice(0, MAX_DISPLAY_COINS);
        break;
      case 'topEarn':
        // Сортируем по доходности стейкинга (только доступные для стейкинга)
        filtered = cryptoData
          .filter((crypto) => crypto.stakingAvailable)
          .sort((a, b) => b.stakingYield - a.stakingYield)
          .slice(0, MAX_DISPLAY_COINS);
        break;
      default:
        filtered = cryptoData.slice(0, MAX_DISPLAY_COINS);
    }

    // Ограничиваем количество отображаемых криптовалют
    return filtered.slice(0, MAX_DISPLAY_COINS);
  };

  // Отображаем загрузку, если данные еще не получены
  if (isLoading) {
    return (
      <div className="crypto-table-loading">
        Загрузка данных о криптовалютах...
      </div>
    );
  }

  // Отображаем ошибку, если что-то пошло не так
  if (error) {
    return <div className="crypto-table-error">{error}</div>;
  }

  const filteredData = getFilteredData();

  return (
    <div className="crypto-table-container">
      <div className="crypto-table-tabs">
        <button
          className={`crypto-table-tab ${
            activeTab === 'derivatives' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('derivatives')}
        >
          Derivatives
        </button>
        <button
          className={`crypto-table-tab ${
            activeTab === 'favorites' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
        <button
          className={`crypto-table-tab ${
            activeTab === 'trending' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('trending')}
        >
          Trending
        </button>
        <button
          className={`crypto-table-tab ${
            activeTab === 'topGainers' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('topGainers')}
        >
          Top Gainers
        </button>
        <button
          className={`crypto-table-tab ${
            activeTab === 'topLosers' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('topLosers')}
        >
          Top Losers
        </button>
        <button
          className={`crypto-table-tab ${
            activeTab === 'topEarn' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('topEarn')}
        >
          Top Earn
        </button>
      </div>

      <div className="crypto-table-wrapper">
        <table className="crypto-table">
          <thead>
            <tr>
              <th className="star-column"></th>
              <th>Name</th>
              <th>Price</th>
              <th>24h %</th>
              <th>7h %</th>
              <th>Market Cap</th>
              {activeTab === 'topEarn' && <th>Staking %</th>}
              <th>Volume(24h)</th>
              <th>Circulating Supply</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((crypto) => (
              <tr key={crypto.symbol}>
                <td className="star-column">
                  <button
                    className="favorite-button"
                    onClick={() => toggleFavorite(crypto.symbol)}
                    aria-label={
                      favorites.includes(crypto.symbol)
                        ? `Удалить ${crypto.symbol} из избранного`
                        : `Добавить ${crypto.symbol} в избранное`
                    }
                  >
                    <span
                      className={
                        favorites.includes(crypto.symbol)
                          ? 'star-filled'
                          : 'star-outline'
                      }
                    >
                      ★
                    </span>
                  </button>
                </td>
                <td className="name-column">
                  <span className="crypto-name">
                    {getCryptoName(crypto.symbol)}
                  </span>{' '}
                  <span className="crypto-symbol">{crypto.symbol}</span>
                </td>
                <td>{formatPrice(crypto.price)}</td>
                <td
                  className={
                    crypto.priceChange24h >= 0
                      ? 'positive-change'
                      : 'negative-change'
                  }
                >
                  {crypto.priceChange24h >= 0 ? '+' : ''}
                  {crypto.priceChange24h.toFixed(2)}%
                </td>
                <td
                  className={
                    crypto.priceChange7h >= 0
                      ? 'positive-change'
                      : 'negative-change'
                  }
                >
                  {crypto.priceChange7h >= 0 ? '+' : ''}
                  {crypto.priceChange7h.toFixed(2)}%
                </td>
                <td>${formatNumber(crypto.marketCap)}</td>
                {activeTab === 'topEarn' && (
                  <td className="staking-yield">
                    {crypto.stakingYield > 0
                      ? `${crypto.stakingYield.toFixed(1)}%`
                      : 'N/A'}
                  </td>
                )}
                <td>${formatNumber(crypto.volume)}</td>
                <td>
                  {formatNumber(crypto.circulatingSupply)} {crypto.symbol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Функция для получения полного названия криптовалюты
function getCryptoName(symbol) {
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

export default CryptoTable;
