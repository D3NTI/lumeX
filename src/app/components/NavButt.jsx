import React from 'react';
import Link from 'next/link';

export default function () {
  return (
    <div className="butt-cont">
      <div className="left-butts">
        <Link href="/market">Market</Link>
        <a href="#">Wallet</a>
        <a href="#">Support</a>
      </div>
      <div className="right-butts">
        <a className="prof-butt" href="">
          Profile
        </a>
      </div>
    </div>
  );
}
