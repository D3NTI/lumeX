import React from 'react';
import Main from '../assets/main.png';
import Image from 'next/image';

export default function LeftHi() {
  return (
    <div className="container">
      {/* Карточка с изображением и текстом */}
      <div className="card">
        {/* Изображение */}
        <div className="image-container">
          <Image
            src={Main || '/placeholder.svg'}
            alt="Lume - Your Gateway into Blockchain"
            fill
            className="card-image"
          />
        </div>

        {/* Текст поверх изображения */}
        <div className="card-content">
          <h2 className="card-title">
            Lume<span className="blue-dot">X</span>
          </h2>
          <h3 className="card-subtitle">
            Your Gateway
            <br />
            into Blockchain
          </h3>
          <p className="pp">Paronia is a blockchain platform.</p>
          <p className="pp"> We make blockchain accessible.</p>
          <button className="learn-button">Learn More</button>
        </div>
      </div>
    </div>
  );
}
