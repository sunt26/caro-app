"use client"

import { useState } from "react"
import { ArrowLeft, Users, Bot, Trophy, Globe, Loader2 } from "lucide-react"
import "../styles/game-menu.css"
import { MenuItemProps } from "../types"
import { MenuItem } from "./MenuItem"
import { useNavigate } from "react-router-dom"

export function GameMenu() {
  const navigate = useNavigate();

  const menuItems: MenuItemProps[] = [
    {
      icon: <Users className="menu-icon" />,
      text: "Tạo phòng chơi",
      number: 1,
      handler: () => { navigate("/new-room") },
    },
    {
      icon: <Users className="menu-icon" />,
      text: "Vào phòng chơi",
      number: 2,
      handler: () => { navigate("/room") },
    },
    {
      icon: <Bot className="menu-icon" />,
      text: "Chơi với robot",
      number: 3,
      handler: () => { },
    },
    {
      icon: <Globe className="menu-icon" />,
      text: "Chơi trực tuyến",
      number: 4,
      handler: () => { },
      subtext: "với một người chơi ngẫu nhiên",
      highlight: true
    }
  ];

  return (
    <div className="caro-game-container">
      {/* Background elements */}
      <div className="background-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
        <div className="grid-pattern"></div>
      </div>

      <div className="content-wrapper">
        {/* Header with logo and title */}
        <div className="header">
          <div className="logo-container">
            <div className="logo-glow"></div>
            <div className="logo-wrapper">
              <CaroLogo />
            </div>
          </div>
          <div className="title-container">
            <h1 className="main-title">Caro trực tuyến</h1>
            <p className="subtitle">Người đầu tiên nối được năm quân cờ sẽ thắng</p>
          </div>
        </div>

        {/* Main menu options */}
        <div className="menu-options">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>

        {/* Footer */}
        <div className="footer">
          <p>© 2025 Caro Game</p>
        </div>
      </div>
    </div>
  )
}

// Caro Logo component embedded within the same file
function CaroLogo() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="8" fill="#1e293b" />
      <line x1="10" y1="10" x2="10" y2="90" stroke="#334155" strokeWidth="0.5" />
      <line x1="20" y1="10" x2="20" y2="90" stroke="#334155" strokeWidth="0.5" />
      <line x1="30" y1="10" x2="30" y2="90" stroke="#334155" strokeWidth="0.5" />
      <line x1="40" y1="10" x2="40" y2="90" stroke="#334155" strokeWidth="0.5" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="#334155" strokeWidth="0.5" />
      <line x1="60" y1="10" x2="60" y2="90" stroke="#334155" strokeWidth="0.5" />
      <line x1="70" y1="10" x2="70" y2="90" stroke="#334155" strokeWidth="0.5" />
      <line x1="80" y1="10" x2="80" y2="90" stroke="#334155" strokeWidth="0.5" />
      <line x1="90" y1="10" x2="90" y2="90" stroke="#334155" strokeWidth="0.5" />

      <line x1="10" y1="10" x2="90" y2="10" stroke="#334155" strokeWidth="0.5" />
      <line x1="10" y1="20" x2="90" y2="20" stroke="#334155" strokeWidth="0.5" />
      <line x1="10" y1="30" x2="90" y2="30" stroke="#334155" strokeWidth="0.5" />
      <line x1="10" y1="40" x2="90" y2="40" stroke="#334155" strokeWidth="0.5" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="#334155" strokeWidth="0.5" />
      <line x1="10" y1="60" x2="90" y2="60" stroke="#334155" strokeWidth="0.5" />
      <line x1="10" y1="70" x2="90" y2="70" stroke="#334155" strokeWidth="0.5" />
      <line x1="10" y1="80" x2="90" y2="80" stroke="#334155" strokeWidth="0.5" />
      <line x1="10" y1="90" x2="90" y2="90" stroke="#334155" strokeWidth="0.5" />

      {/* Black pieces with shadow effect */}
      <circle cx="30" cy="30" r="5" fill="#0f172a" />
      <circle cx="30" cy="30" r="4" fill="#1e293b" />

      <circle cx="50" cy="30" r="5" fill="#0f172a" />
      <circle cx="50" cy="30" r="4" fill="#1e293b" />

      <circle cx="70" cy="20" r="5" fill="#0f172a" />
      <circle cx="70" cy="20" r="4" fill="#1e293b" />

      <circle cx="60" cy="50" r="5" fill="#0f172a" />
      <circle cx="60" cy="50" r="4" fill="#1e293b" />

      <circle cx="80" cy="60" r="5" fill="#0f172a" />
      <circle cx="80" cy="60" r="4" fill="#1e293b" />

      <circle cx="40" cy="70" r="5" fill="#0f172a" />
      <circle cx="40" cy="70" r="4" fill="#1e293b" />

      {/* Green pieces with glow effect */}
      <circle cx="20" cy="40" r="5" fill="#065f46" />
      <circle cx="20" cy="40" r="4" fill="#10b981" />

      <circle cx="30" cy="50" r="5" fill="#065f46" />
      <circle cx="30" cy="50" r="4" fill="#10b981" />

      <circle cx="40" cy="50" r="5" fill="#065f46" />
      <circle cx="40" cy="50" r="4" fill="#10b981" />

      <circle cx="50" cy="50" r="5" fill="#065f46" />
      <circle cx="50" cy="50" r="4" fill="#10b981" />

      <circle cx="20" cy="60" r="5" fill="#065f46" />
      <circle cx="20" cy="60" r="4" fill="#10b981" />

      <circle cx="60" cy="70" r="5" fill="#065f46" />
      <circle cx="60" cy="70" r="4" fill="#10b981" />
    </svg>
  )
}
