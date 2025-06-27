import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isLoggedIn, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  return (
    <nav className="bg-[hsl(var(--foreground))] text-[hsl(var(--card))] border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand + Nav Links */}
        <div className="flex items-center gap-6">
          {/* Brand */}
          <Link to="/" className="text-xl font-extrabold text-primary">
            NutriGenie
          </Link>
          {/* Desktop Nav Links */}
          <div className="hidden lg:flex gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-[hsl(var(--card))]">Dashboard</Button>
            </Link>
            <Link to="/dietPlan">
              <Button variant="ghost" className="text-[hsl(var(--card))]">Diet Plan</Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" className="text-[hsl(var(--card))]">Profile</Button>
            </Link>
            {/* ✅ My Plans Button */}
            <Link to="/my-plans">
              <Button variant="ghost" className="text-[hsl(var(--card))]">My Plans</Button>
            </Link>
          </div>

        </div>

        {/* Right: Auth Controls */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn && user?.username && (
            <span className="text-sm font-medium text-[hsl(var(--card))]">
              Welcome, {user.username}
            </span>
          )}
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="ghost">Register</Button>
              </Link>
            </>
          ) : (
            <Button type="button" onClick={logout} variant="outline">Logout</Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            className="text-[hsl(var(--card))] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
      <div className="lg:hidden mt-4 flex flex-col gap-2">
        <MobileLink to="/dashboard" label="Dashboard" />
        <MobileLink to="/dietplan" label="Diet Plan" />
        <MobileLink to="/profile" label="Profile" />
        {/* ✅ Add My Plans to Mobile */}
        <MobileLink to="/my-plans" label="My Plans" />
        <hr className="border-muted/40" />
        {isLoggedIn && user?.username && (
          <span className="px-4 text-sm text-[hsl(var(--card))]">Welcome, {user.username}</span>
        )}
        {!isLoggedIn ? (
          <>
            <MobileLink to="/login" label="Login" />
            <MobileLink to="/register" label="Register" />
          </>
    ) : (
      <Button
        type="button"
        onClick={logout}
        variant="outline"
        className="mx-4 mt-2"
      >
        Logout
      </Button>
    )}
  </div>
)}
    </nav>
  );
}

function MobileLink({ to, label }) {
  return (
    <Link to={to}>
      <Button variant="ghost" className="w-full text-left px-4 py-2 text-[hsl(var(--card))]">
        {label}
      </Button>
    </Link>
  );
}

export default Navbar;
