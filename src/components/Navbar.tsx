// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-full flex justify-between items-center px-10 py-5 bg-black/80 backdrop-blur border-b border-white/10 select-none">
      
      {/* Logo + Brand Name */}
      <Link to="/" className="flex items-center gap-3">
        
        {/* Bigger Crown Icon */}
        <svg width="46" height="46" viewBox="0 0 24 24" fill="#ffdd73">
          <path d="M5 16l-1-9 5 4 3-6 3 6 5-4-1 9H5z" />
        </svg>

        {/* Bigger Brand Name */}
        <span className="text-3xl font-bold tracking-wider">
          <span className="text-[#ffdd73]">LUXSOR</span>
          <span className="text-white">AAI</span>
        </span>

      </Link>

      {/* Menu */}
      <nav className="flex gap-10 text-base font-medium">
        <Link to="/" className="text-white/80 hover:text-[#ffdd73] transition">Home</Link>
        <Link to="/install" className="text-white/80 hover:text-[#ffdd73] transition">Install</Link>
        <Link to="/color-grade" className="text-white/80 hover:text-[#ffdd73] transition">Color Grade</Link>
        <Link to="/auth" className="text-white/80 hover:text-[#ffdd73] transition">Login</Link>
      </nav>

    </div>
  );
}
