import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        
        {/* Logo / Website Name */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            AppOrbit<span className="text-blue-400">.</span>
          </h2>
        </div>

        {/* Useful Links */}
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          <Link to="/about" className="hover:text-blue-400 transition">About</Link>
          <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
          <Link to="/privacy" className="hover:text-blue-400 transition">Privacy</Link>
        </div>

        {/* Copyright */}
        <div className="text-sm">
          &copy; {new Date().getFullYear()} AppOrbit. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
