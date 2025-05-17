import React from 'react';
import Image from 'next/image';
import Mac from '../assets/mac.png';

export default function RightHi() {
  return (
    <div>
      <div className="mac-cont">
        <Image
          src={Mac || '/placeholder.svg'}
          alt="##"
          fill
          className="mac-image"
        />
      </div>
    </div>
  );
}
