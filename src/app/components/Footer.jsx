"use client"

import React from "react"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-top-content">
          <h2 className="footer-heading">Overcome Ignorance and Fight for Equality</h2>
          <button className="footer-button">Learn More</button>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-section">
          <h3 className="footer-title">NAVIGATION</h3>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Crypto rate</a></li>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Wallet</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">WHAT WE DO</h3>
          <ul className="footer-links">
            <li><a href="#">Encouraging Testing</a></li>
            <li><a href="#">Strengthening Advocacy</a></li>
            <li><a href="#">Sharing Information</a></li>
            <li><a href="#">Building Leadership</a></li>
            <li><a href="#">Engaging With Global Fund</a></li>
            <li><a href="#">Shining a Light</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">LEGAL</h3>
          <ul className="footer-links">
            <li><a href="#">General Info</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">TALK TO US</h3>
          <ul className="footer-links">
            <li><a href="mailto:support@ercom.com">support@ercom.com</a></li>
            <li><a href="tel:+66-2399-1145">+66 2399 1145</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-logo">
          <span className="logo-text">Lume<span className="logo-highlight">X</span></span>
        </div>
        <div className="footer-copyright">
          © 2019 Lift Media. All Rights Reserved.
        </div>
        <div className="footer-social">
          <a href="#" className="social-icon">f</a>
          <a href="#" className="social-icon">in</a>
          <a href="#" className="social-icon">t</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
