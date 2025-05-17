'use client';

import React, { use } from 'react';
import { useState, useEffect } from 'react';

export default function Overview() {
  const [marketData, setMarketData] = useState({
    totalMarketCap: 0,
    volume24h: 0,
    btcDominance: 0,
    isLoading: true,
    error: null,
  });
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Используем Binance API для получения глобальной статистики
        // Binance не предоставляет напрямую данные о рыночной капитализации и доминации BTC,
        // поэтому мы будем использовать их API для получения максимально возможного количества данных

        // 1. Получаем данные о ценах всех торговых пар
        const tickerResponse = await fetch(
          'https://api.binance.com/api/v3/ticker/price'
        );
        const tickerData = await tickerResponse.json();

        // 2. Получаем 24-часовую статистику для всех торговых пар
        const statsResponse = await fetch(
          'https://api.binance.com/api/v3/ticker/24hr'
        );
        const statsData = await statsResponse.json();

        // 3. Получаем информацию о биржевой статистике (если доступно)
        // Примечание: этот эндпоинт может быть недоступен в публичном API
        let exchangeInfoResponse;
        try {
          exchangeInfoResponse = await fetch(
            'https://api.binance.com/api/v3/exchangeInfo'
          );
        } catch (error) {
          console.warn('Не удалось получить данные exchangeInfo:', error);
        }

        // 4. Рассчитываем общий объем торгов за 24 часа
        // Учитываем только USDT пары, чтобы избежать двойного подсчета
        const totalVolume = statsData
          .filter((pair) => pair.symbol.endsWith('USDT'))
          .reduce((sum, pair) => sum + Number.parseFloat(pair.quoteVolume), 0);

        // 5. Получаем цену BTC
        const btcPriceData = tickerData.find(
          (pair) => pair.symbol === 'BTCUSDT'
        );
        const btcPrice = btcPriceData
          ? Number.parseFloat(btcPriceData.price)
          : 0;

        // 6. Получаем данные о рыночной капитализации и доминации BTC
        // Для этого используем специальный эндпоинт Binance (если доступен)
        // Если недоступен, используем альтернативный подход

        let marketCapData = null;
        let btcDominance = 0;
        let totalMarketCap = 0;

        try {
          // Пытаемся получить данные с Binance Spot API v1 (если доступно)
          const marketCapResponse = await fetch(
            'https://www.binance.com/exchange-api/v2/public/asset-service/product/get-products'
          );
          marketCapData = await marketCapResponse.json();

          if (marketCapData && marketCapData.data) {
            // Если данные доступны, извлекаем рыночную капитализацию и доминацию BTC
            const btcData = marketCapData.data.find(
              (coin) => coin.s === 'BTCUSDT'
            );
            if (btcData && btcData.cs && btcData.c) {
              const btcCirculatingSupply = Number.parseFloat(btcData.cs);
              const btcMarketCap = btcPrice * btcCirculatingSupply;

              // Рассчитываем общую рыночную капитализацию на основе доступных данных
              totalMarketCap = marketCapData.data
                .filter((coin) => coin.s.endsWith('USDT') && coin.cs)
                .reduce((sum, coin) => {
                  const price = Number.parseFloat(coin.c || 0);
                  const circulatingSupply = Number.parseFloat(coin.cs || 0);
                  return sum + price * circulatingSupply;
                }, 0);

              // Рассчитываем доминацию BTC
              btcDominance = (btcMarketCap / totalMarketCap) * 100;
            }
          }
        } catch (error) {
          console.warn(
            'Не удалось получить данные о рыночной капитализации с Binance:',
            error
          );
        }

        // Если не удалось получить данные о рыночной капитализации с Binance,
        // используем альтернативный подход с приблизительными данными
        if (!totalMarketCap || !btcDominance) {
          // Приблизительное количество BTC в обращении
          const btcCirculatingSupply = 19500000;
          const btcMarketCap = btcPrice * btcCirculatingSupply;

          // Используем данные о топ-20 криптовалютах для приблизительного расчета
          const majorCoins = [
            { symbol: 'ETHUSDT', supply: 120000000 },
            { symbol: 'BNBUSDT', supply: 155000000 },
            { symbol: 'SOLUSDT', supply: 430000000 },
            { symbol: 'XRPUSDT', supply: 53000000000 },
            { symbol: 'ADAUSDT', supply: 35000000000 },
            { symbol: 'AVAXUSDT', supply: 360000000 },
            { symbol: 'DOTUSDT', supply: 1200000000 },
            { symbol: 'MATICUSDT', supply: 9500000000 },
            { symbol: 'LINKUSDT', supply: 580000000 },
            { symbol: 'DOGEUSDT', supply: 142000000000 },
            { symbol: 'LTCUSDT', supply: 73000000 },
            { symbol: 'UNIUSDT', supply: 750000000 },
            { symbol: 'ATOMUSDT', supply: 300000000 },
            { symbol: 'ETCUSDT', supply: 143000000 },
            { symbol: 'FILUSDT', supply: 220000000 },
            { symbol: 'NEARUSDT', supply: 1000000000 },
            { symbol: 'ALGOUSDT', supply: 7500000000 },
            { symbol: 'VETUSDT', supply: 86000000000 },
          ];

          // Рассчитываем приблизительную общую рыночную капитализацию
          let approximateTotalMarketCap = btcMarketCap;

          for (const coin of majorCoins) {
            const priceData = tickerData.find(
              (pair) => pair.symbol === coin.symbol
            );
            if (priceData) {
              const price = Number.parseFloat(priceData.price);
              approximateTotalMarketCap += price * coin.supply;
            }
          }

          totalMarketCap = approximateTotalMarketCap;
          btcDominance = (btcMarketCap / totalMarketCap) * 100;
        }

        // Обновляем состояние с полученными данными
        setMarketData({
          totalMarketCap,
          volume24h: totalVolume,
          btcDominance,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Ошибка при получении рыночных данных:', error);
        setMarketData({
          ...marketData,
          isLoading: false,
          error: 'Не удалось получить рыночные данные',
        });
      }
    };

    fetchMarketData();

    // Устанавливаем интервал для обновления данных каждые 60 секунд
    const intervalId = setInterval(fetchMarketData, 60000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  // Форматирование больших чисел для удобочитаемости
  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + ' K';
    return num.toFixed(2);
  };

  if (marketData.isLoading) {
    return <div className="market-ticker loading">Loading market data...</div>;
  }

  if (marketData.error) {
    return <div className="market-ticker error">{marketData.error}</div>;
  }

  return (
    <div className="overview-container">
      <h1 className="overview-title">Market Overview</h1>

      <div className="market-ticker">
        <div className="ticker-item">
          <span className="ticker-label">Total Market Cap:</span>
          <span className="ticker-value">
            ${formatNumber(marketData.totalMarketCap)}
          </span>
        </div>

        <div className="ticker-item">
          <span className="ticker-label">Volume (24h):</span>
          <span className="ticker-value">
            ${formatNumber(marketData.volume24h)}
          </span>
        </div>

        <div className="ticker-item">
          <span className="ticker-label">BTC Dominance:</span>
          <span className="ticker-value">
            {marketData.btcDominance.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
