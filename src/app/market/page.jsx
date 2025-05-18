'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './market.css';
import NavComp from '../components/NavComp';
import Footer from '../components/Footer';

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [topCoins, setTopCoins] = useState([]);
  const [earnCoins, setEarnCoins] = useState([]);
  const [allCoins, setAllCoins] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef(null);

  // Функция для форматирования цены
  const formatPrice = (price) => {
    const numPrice = Number.parseFloat(price);
    if (numPrice >= 1000) {
      return numPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    } else if (numPrice >= 10) {
      return numPrice.toFixed(2);
    } else if (numPrice >= 0.1) {
      return numPrice.toFixed(3);
    } else {
      return numPrice.toFixed(6);
    }
  };

  // Функция для получения данных о криптовалютах
  const fetchCryptoData = async () => {
    try {
      // Получаем данные о всех торговых парах с Binance
      const response = await fetch(
        'https://api.binance.com/api/v3/ticker/24hr'
      );
      const data = await response.json();

      // Фильтруем только USDT пары и исключаем деривативы
      const usdtPairs = data.filter(
        (pair) =>
          pair.symbol.endsWith('USDT') &&
          !pair.symbol.includes('UP') &&
          !pair.symbol.includes('DOWN') &&
          !pair.symbol.includes('BEAR') &&
          !pair.symbol.includes('BULL')
      );

      // Сохраняем все доступные монеты для поиска
      const formattedAllCoins = usdtPairs.map((pair) => ({
        pair: pair.symbol.replace('USDT', '/USDT'),
        symbol: pair.symbol.replace('USDT', ''),
        price: formatPrice(pair.lastPrice),
        change:
          Number.parseFloat(pair.priceChangePercent) >= 0
            ? `+${Number.parseFloat(pair.priceChangePercent).toFixed(2)}%`
            : `${Number.parseFloat(pair.priceChangePercent).toFixed(2)}%`,
        isPositive: Number.parseFloat(pair.priceChangePercent) >= 0,
        volume: Number.parseFloat(pair.quoteVolume),
      }));

      setAllCoins(formattedAllCoins);

      // Сортируем по объему торгов для топовых монет
      const sortedByVolume = [...formattedAllCoins].sort(
        (a, b) => b.volume - a.volume
      );

      // Берем топ-9 пар по объему торгов
      const top9Pairs = sortedByVolume.slice(0, 9);
      setTopCoins(top9Pairs);

      // Имитируем данные о стейкинге (в реальном приложении эти данные должны приходить с API)
      const stakingYields = {
        BTC: 4.2,
        ETH: 5.5,
        SOL: 7.8,
        DOT: 12.0,
        AVAX: 9.8,
        MATIC: 10.5,
        ATOM: 15.2,
        BNB: 8.4,
        ADA: 5.1,
      };

      // Создаем данные для секции "Top Earn"
      const earnData = formattedAllCoins
        .slice(0, 20)
        .map((coin) => {
          return {
            symbol: coin.symbol.charAt(0),
            name: coin.symbol,
            apy: `+${(
              stakingYields[coin.symbol] || Math.random() * 5 + 1
            ).toFixed(2)}%`,
            apyValue: stakingYields[coin.symbol] || Math.random() * 5 + 1,
          };
        })
        .sort((a, b) => b.apyValue - a.apyValue)
        .slice(0, 3);

      setEarnCoins(earnData);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      setIsLoading(false);
    }
  };

  // Обработчик поиска
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allCoins
      .filter(
        (coin) =>
          coin.pair.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      )
      .slice(0, 10); // Ограничиваем до 10 результатов

    setSearchResults(results);
  }, [searchQuery, allCoins]);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchCryptoData();

    // Обновляем данные каждые 30 секунд
    const intervalId = setInterval(fetchCryptoData, 30000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  // Обработчик клика вне поисковых результатов
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]);

  // Функция для добавления монеты в топ
  const addCoinToTop = (coin) => {
    // Проверяем, есть ли уже эта монета в топе
    const existingIndex = topCoins.findIndex((c) => c.pair === coin.pair);

    if (existingIndex === -1) {
      // Если монеты нет в топе, добавляем её и удаляем последнюю
      const newTopCoins = [coin, ...topCoins.slice(0, 8)];
      setTopCoins(newTopCoins);
    }

    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Разделяем топовые монеты на три колонки
  const coinsPerColumn = Math.ceil(topCoins.length / 3);
  const column1 = topCoins.slice(0, coinsPerColumn);
  const column2 = topCoins.slice(coinsPerColumn, coinsPerColumn * 2);
  const column3 = topCoins.slice(coinsPerColumn * 2);

  // Отображаем загрузку, если данные еще не получены
  if (isLoading) {
    return (
      <div className="market-page">
        <div className="market-header">
          <Link href="/" className="back-link">
            ← Back
          </Link>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading market data...</div>
        </div>
      </div>
    );
  }

  // Отображаем ошибку, если что-то пошло не так
  if (error) {
    return (
      <div className="market-page">
        <div className="market-header">
          <Link href="/" className="back-link">
            ← Back
          </Link>
        </div>
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button className="retry-button" onClick={fetchCryptoData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="market-main">
      <NavComp></NavComp>{' '}
      <div className="market-page">
        <div className="market-header">
          <Link href="/" className="back-link">
            ← Back
          </Link>
        </div>

        <div className="search-container" ref={searchContainerRef}>
          <div className="search-bar">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search any cryptocurrency..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="search-input"
            />
          </div>

          {/* Выпадающий список результатов поиска */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((coin, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => addCoinToTop(coin)}
                >
                  <div className="result-left">
                    <div className="result-symbol">{coin.symbol}</div>
                    <div className="result-pair">{coin.pair}</div>
                  </div>
                  <div className="result-right">
                    <div className="result-price">{coin.price}</div>
                    <div
                      className={
                        coin.isPositive
                          ? 'result-change positive'
                          : 'result-change negative'
                      }
                    >
                      {coin.change}
                    </div>
                  </div>
                </div>
              ))}
              <div className="search-footer">
                <div className="search-tip">
                  Click on a cryptocurrency to add it to your top list
                </div>
              </div>
            </div>
          )}

          {/* Сообщение, если ничего не найдено */}
          {showSearchResults &&
            searchQuery.trim() !== '' &&
            searchResults.length === 0 && (
              <div className="search-results">
                <div className="no-results">
                  No cryptocurrencies found matching "{searchQuery}"
                </div>
              </div>
            )}
        </div>

        <div className="market-content">
          <div className="section">
            <div className="section-header">In Top</div>
            <div className="coin-grid">
              {/* Первая колонка */}
              <div className="coin-column">
                {column1.map((coin, index) => (
                  <Link
                    href={`/coin/${coin.symbol}`}
                    key={`col1-${index}`}
                    className="coin-card"
                  >
                    <div className="coin-info">
                      <div className="coin-pair">{coin.pair}</div>
                      <div className="coin-price">
                        {coin.price}
                        <span
                          className={
                            coin.isPositive
                              ? 'coin-change positive'
                              : 'coin-change negative'
                          }
                        >
                          {coin.change}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Вторая колонка */}
              <div className="coin-column">
                {column2.map((coin, index) => (
                  <Link
                    href={`/coin/${coin.symbol}`}
                    key={`col2-${index}`}
                    className="coin-card"
                  >
                    <div className="coin-info">
                      <div className="coin-pair">{coin.pair}</div>
                      <div className="coin-price">
                        {coin.price}
                        <span
                          className={
                            coin.isPositive
                              ? 'coin-change positive'
                              : 'coin-change negative'
                          }
                        >
                          {coin.change}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Третья колонка */}
              <div className="coin-column">
                {column3.map((coin, index) => (
                  <Link
                    href={`/coin/${coin.symbol}`}
                    key={`col3-${index}`}
                    className="coin-card"
                  >
                    <div className="coin-info">
                      <div className="coin-pair">{coin.pair}</div>
                      <div className="coin-price">
                        {coin.price}
                        <span
                          className={
                            coin.isPositive
                              ? 'coin-change positive'
                              : 'coin-change negative'
                          }
                        >
                          {coin.change}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-header">Top Earn</div>
            <div className="earn-grid">
              {earnCoins.map((coin, index) => (
                <Link
                  href={`/coin/${coin.name}`}
                  key={index}
                  className="earn-card"
                >
                  <div className="coin-symbol">{coin.symbol}</div>
                  <div className="coin-name">{coin.name}</div>
                  <div className="coin-apy">{coin.apy}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
