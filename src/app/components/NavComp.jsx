import React from 'react';
import NavButt from '../components/NavButt';
export default function NavComp() {
  return (
    <div className="nav-cont">
      <h1 className="logo">
        Lume
        <span className="logx">X</span>
      </h1>

      <NavButt></NavButt>
    </div>
  );
}
