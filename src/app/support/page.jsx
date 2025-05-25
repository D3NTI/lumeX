'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqCategories = [
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'wallet', name: 'Wallet', icon: '💼' },
    { id: 'trading', name: 'Trading', icon: '📈' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'deposits', name: 'Deposits', icon: '💰' },
  ];

  const faqData = {
    general: [
      {
        id: 1,
        question: 'What is this crypto platform?',
        answer:
          'Our platform is a comprehensive cryptocurrency wallet and trading solution that allows you to securely store, send, receive, and trade various cryptocurrencies including Bitcoin, Ethereum, USDT, BNB, and Solana.',
      },
      {
        id: 2,
        question: 'How do I get started?',
        answer:
          "Getting started is easy! Simply create an account by clicking 'Sign Up', verify your email, and you can immediately start using our demo features. You can deposit virtual funds to test all functionalities.",
      },
      {
        id: 3,
        question: 'Is this platform free to use?',
        answer:
          'Yes! Our platform offers free demo trading and wallet features. You can test all functionalities with virtual funds at no cost. Real trading may involve standard network fees.',
      },
      {
        id: 4,
        question: 'What cryptocurrencies do you support?',
        answer:
          "We currently support Bitcoin (BTC), Ethereum (ETH), Tether USD (USDT), Binance Coin (BNB), and Solana (SOL). We're constantly working to add more cryptocurrencies.",
      },
    ],
    wallet: [
      {
        id: 5,
        question: 'How do I create a wallet?',
        answer:
          "Wallets are automatically created when you register an account. You'll have separate wallets for each supported cryptocurrency, each with its own unique address.",
      },
      {
        id: 6,
        question: 'Are my funds safe?',
        answer:
          'Security is our top priority. We use industry-standard encryption and security practices. However, please note that demo funds are virtual and for testing purposes only.',
      },
      {
        id: 7,
        question: 'Can I export my wallet?',
        answer:
          "Currently, wallet export features are in development. You can view and copy your wallet addresses from the 'Receive' tab in your wallet.",
      },
      {
        id: 8,
        question: 'What if I lose access to my account?',
        answer:
          "If you lose access to your account, please contact our support team immediately. We'll help you recover your account through our secure verification process.",
      },
    ],
    trading: [
      {
        id: 9,
        question: 'How do I send cryptocurrency?',
        answer:
          "Go to your wallet, click the 'Send' tab, select the cryptocurrency, enter the recipient's address and amount, then confirm the transaction. Always double-check the recipient address.",
      },
      {
        id: 10,
        question: 'What are network fees?',
        answer:
          'Network fees are small amounts paid to blockchain miners to process your transactions. These fees vary by network congestion and cryptocurrency type.',
      },
      {
        id: 11,
        question: 'How long do transactions take?',
        answer:
          'Transaction times vary by cryptocurrency: Bitcoin (10-60 minutes), Ethereum (1-15 minutes), USDT (1-15 minutes), BNB (3 seconds), Solana (1-2 seconds).',
      },
      {
        id: 12,
        question: 'Can I cancel a transaction?',
        answer:
          'Once a transaction is broadcast to the blockchain, it cannot be cancelled. Always verify all details before confirming a transaction.',
      },
    ],
    security: [
      {
        id: 13,
        question: 'How do I secure my account?',
        answer:
          'Use a strong, unique password, enable two-factor authentication (2FA), never share your login credentials, and always log out when using public computers.',
      },
      {
        id: 14,
        question: 'What is two-factor authentication?',
        answer:
          '2FA adds an extra layer of security by requiring a second verification step (usually a code from your phone) in addition to your password when logging in.',
      },
      {
        id: 15,
        question: 'How do I report suspicious activity?',
        answer:
          'If you notice any suspicious activity on your account, immediately change your password and contact our support team. We take security incidents very seriously.',
      },
      {
        id: 16,
        question: 'Do you store my private keys?',
        answer:
          'We use industry-standard security practices for key management. For demo purposes, keys are managed securely on our platform. Always use strong passwords and enable 2FA.',
      },
    ],
    deposits: [
      {
        id: 17,
        question: 'How do I deposit funds?',
        answer:
          "Click the 'Deposit' button in your wallet, select your preferred cryptocurrency and payment method. For demo purposes, you can use 'Demo Funds' to add virtual currency instantly.",
      },
      {
        id: 18,
        question: 'What deposit methods do you accept?',
        answer:
          'We support bank transfers, credit/debit cards, crypto transfers, and demo funds. Demo funds are perfect for testing all platform features without real money.',
      },
      {
        id: 19,
        question: 'Are there deposit limits?',
        answer:
          'Demo deposits have no limits. Each cryptocurrency has minimum deposit amounts: BTC (0.001), ETH (0.01), USDT ($10), BNB (0.1), SOL (1).',
      },
      {
        id: 20,
        question: "Why isn't my deposit showing?",
        answer:
          "Demo deposits appear instantly. If you're having issues, try refreshing the page or contact support. Check that you selected the correct cryptocurrency and amount.",
      },
    ],
  };

  const handleFaqToggle = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert(
      "Thank you for contacting us! We'll get back to you within 24 hours."
    );
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="support-page">
      <div className="support-header">
        <h1 className="support-title">Help & Support</h1>
        <p className="support-subtitle">
          Find answers to common questions or contact our support team
        </p>
      </div>

      <div className="support-container">
        {/* Quick Help Cards */}
        <div className="quick-help-section">
          <h2>Quick Help</h2>
          <div className="quick-help-grid">
            <div className="help-card">
              <div className="help-icon">🚀</div>
              <h3>Getting Started</h3>
              <p>
                New to crypto? Learn the basics and get started with our
                platform.
              </p>
              <button
                onClick={() => setActiveCategory('general')}
                className="help-btn"
              >
                Learn More
              </button>
            </div>
            <div className="help-card">
              <div className="help-icon">💼</div>
              <h3>Wallet Guide</h3>
              <p>
                Learn how to manage your cryptocurrency wallets safely and
                efficiently.
              </p>
              <button
                onClick={() => setActiveCategory('wallet')}
                className="help-btn"
              >
                View Guide
              </button>
            </div>
            <div className="help-card">
              <div className="help-icon">🔒</div>
              <h3>Security Tips</h3>
              <p>
                Keep your account and funds secure with our security best
                practices.
              </p>
              <button
                onClick={() => setActiveCategory('security')}
                className="help-btn"
              >
                Stay Safe
              </button>
            </div>
            <div className="help-card">
              <div className="help-icon">💰</div>
              <h3>Deposit Help</h3>
              <p>
                Learn how to deposit funds and start trading with virtual
                currency.
              </p>
              <button
                onClick={() => setActiveCategory('deposits')}
                className="help-btn"
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>

          <div className="faq-categories">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  activeCategory === category.id ? 'active' : ''
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          <div className="faq-content">
            {faqData[activeCategory]?.map((faq) => (
              <div key={faq.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => handleFaqToggle(faq.id)}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`faq-arrow ${
                      expandedFaq === faq.id ? 'expanded' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {expandedFaq === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-section">
          <h2>Still Need Help?</h2>
          <p>
            Can't find what you're looking for? Send us a message and we'll get
            back to you!
          </p>

          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={contactForm.priority}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                required
                className="form-textarea"
                rows="6"
                placeholder="Please describe your issue in detail..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info-section">
          <h2>Other Ways to Reach Us</h2>
          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">📧</div>
              <div className="method-info">
                <h3>Email Support</h3>
                <p>support@cryptoplatform.com</p>
                <span>Response within 24 hours</span>
              </div>
            </div>
            <div className="contact-method">
              <div className="method-icon">💬</div>
              <div className="method-info">
                <h3>Live Chat</h3>
                <p>Available 24/7</p>
                <span>Average response: 5 minutes</span>
              </div>
            </div>
            <div className="contact-method">
              <div className="method-icon">📱</div>
              <div className="method-info">
                <h3>Telegram</h3>
                <p>@CryptoPlatformSupport</p>
                <span>Community support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
