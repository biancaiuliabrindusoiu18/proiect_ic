"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Header.css" // Import the CSS file
import Logo from "../imag/logo.png" // Import the logo image

const Header = () => {
  const navigate = useNavigate()
  const [first_name, setFirst_name] = useState("")

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    navigate("/login")
  }

  // Handle home navigation
  const handleHomeClick = () => {
    navigate("/home")
  }

  useEffect(() => {
    // Check both localStorage and sessionStorage
    const storedFirst_name = localStorage.getItem("first_name") || sessionStorage.getItem("first_name")

    if (storedFirst_name) {
      setFirst_name(storedFirst_name)
    }
  }, [])

  return (
    <header className="headerBAR">
      {/* Left Section - Logo și MedTrack clickable */}
      <div className="container left-container">
        <div className="brand-section" onClick={handleHomeClick}>
          <img src={Logo || "/placeholder.svg"} alt="Medical icon" />
          <span className="brand-name">MedTrack</span>
        </div>
      </div>

      {/* Right Section - Username și Logout */}
      <div className="container right-container">
        <span className="username-text">Hello, {first_name}!</span>
        <button className="header-button logout-button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}

export default Header
