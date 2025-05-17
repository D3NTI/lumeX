"use client"

import { useState, useEffect } from "react"
import "./MarketMovers.css"

function MarketMovers() {
  const [marketData, setMarketData] = useState({
    topGainers: [],
    topLosers: [],
    trending: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchMarketMovers = async () => {
      try {
        // Получаем данные о всех торговых парах с Binance
        const response = await fetch("https://api.binance.com/api/v3/ticker/24hr")
        const data = await response.json()

        // Фильтруем только USDT пары для основных криптовалют
        const usdtPairs = data.filter(
          (pair) =>
            pair.symbol.endsWith("USDT") &&
            !pair.symbol.includes("UP") &&
            !pair.symbol.includes("DOWN") &&
            !pair.symbol.includes("BEAR") &&
            !pair.symbol.includes("BULL"),
        )

        // Сортируем по изменению цены в процентах
        const sortedByPriceChange = [...usdtPairs].sort((a, b) => {
          return Number.parseFloat(b.priceChangePercent) - Number.parseFloat(a.priceChangePercent)
        })

        // Получаем топ-10 по росту
        const topGainers = sortedByPriceChange
          .filter((pair) => Number.parseFloat(pair.priceChangePercent) > 0)
          .slice(0, 10)
          .map((pair) => ({
            symbol: pair.symbol.replace("USDT", ""),
            priceChange: Number.parseFloat(pair.priceChangePercent),
          }))

        // Получаем топ-10 по падению (сортируем в обратном порядке)
        const topLosers = sortedByPriceChange
          .filter((pair) => Number.parseFloat(pair.priceChangePercent) < 0)
          .slice(-10)
          .reverse()
          .map((pair) => ({
            symbol: pair.symbol.replace("USDT", ""),
            priceChange: Number.parseFloat(pair.priceChangePercent),
          }))

        // Для trending используем популярные монеты с наибольшим объемом торгов
        const sortedByVolume = [...usdtPairs].sort((a, b) => {
          return Number.parseFloat(b.quoteVolume) - Number.parseFloat(a.quoteVolume)
        })

        const trending = sortedByVolume.slice(0, 10).map((pair) => ({
          symbol: pair.symbol.replace("USDT", ""),
          priceChange: Number.parseFloat(pair.priceChangePercent),
        }))

        setMarketData({
          topGainers,
          topLosers,
          trending,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error("Ошибка при получении данных о рынке:", error)
        setMarketData((prevData) => ({
          ...prevData,
          isLoading: false,
          error: "Не удалось получить данные о рынке",
        }))
      }
    }

    fetchMarketMovers()

    // Обновляем данные каждые 60 секунд
    const intervalId = setInterval(fetchMarketMovers, 60000)

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId)
  }, [])

  // Функция для отображения процентного изменения с соответствующим цветом
  const renderPercentChange = (change) => {
    const color = change >= 0 ? "var(--color-gain)" : "var(--color-loss)"
    const prefix = change >= 0 ? "+" : ""
    return (
      <span className="percent-change" style={{ color }}>
        {prefix}
        {change.toFixed(1)}%
      </span>
    )
  }

  // Отображаем загрузку, если данные еще не получены
  if (marketData.isLoading) {
    return <div className="market-movers-loading">Загрузка данных о рынке...</div>
  }

  // Отображаем ошибку, если что-то пошло не так
  if (marketData.error) {
    return <div className="market-movers-error">{marketData.error}</div>
  }

  return (
    <div className="market-movers-container">
      <div className="market-movers-column">
        <h2 className="market-movers-title">Top Gainers</h2>
        <ul className="market-movers-list">
          {marketData.topGainers.map((coin, index) => (
            <li key={`gain-${index}`} className="market-movers-item">
              <span className="coin-symbol">{coin.symbol}</span>
              {renderPercentChange(coin.priceChange)}
            </li>
          ))}
        </ul>
      </div>

      <div className="market-movers-column">
        <h2 className="market-movers-title">Top Losers</h2>
        <ul className="market-movers-list">
          {marketData.topLosers.map((coin, index) => (
            <li key={`loss-${index}`} className="market-movers-item">
              <span className="coin-symbol">{coin.symbol}</span>
              {renderPercentChange(coin.priceChange)}
            </li>
          ))}
        </ul>
      </div>

      <div className="market-movers-column">
        <h2 className="market-movers-title">Trending</h2>
        <ul className="market-movers-list">
          {marketData.trending.map((coin, index) => (
            <li key={`trend-${index}`} className="market-movers-item">
              <span className="coin-symbol">{coin.symbol}</span>
              {renderPercentChange(coin.priceChange)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MarketMovers
