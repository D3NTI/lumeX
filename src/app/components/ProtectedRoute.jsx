"use client"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/")
      } else {
        setShowContent(true)
      }
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Проверка авторизации...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-required-container">
        <div className="auth-required-message">
          <h2>Требуется авторизация</h2>
          <p>Для доступа к кошельку необходимо войти в аккаунт</p>
          <button onClick={() => router.push("/")} className="back-to-home-btn">
            Вернуться на главную
          </button>
        </div>
      </div>
    )
  }

  return showContent ? children : null
}
