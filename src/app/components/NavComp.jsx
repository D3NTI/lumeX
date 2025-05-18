import React from 'react';
import NavButt from '../components/NavButt';
import Link from 'next/link';
export default function NavComp() {
  return (
    <div className="nav-cont">
      <Link href="/" className="logo">
        Lume
        <span className="logx">X</span>
      </Link>

      <NavButt></NavButt>
    </div>
  );
}
