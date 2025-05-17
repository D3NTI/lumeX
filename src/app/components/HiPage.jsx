import React from 'react';
import Some from '../assets/some.png';
import Image from 'next/image';
import LeftHi from '../components/LeftHi';
import RightHi from '../components/RightHi';

export default function HiPage() {
  return (
    <div className="hipage">
      <div className="background-container">
        <Image
          src={Some || '/placeholder.svg'}
          alt=""
          className="background-image"
        />
      </div>
      <LeftHi></LeftHi>
      <RightHi></RightHi>
    </div>
  );
}
