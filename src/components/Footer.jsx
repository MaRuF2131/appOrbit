import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 mt-12 w-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        
        {/* Logo / Website Name */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            AppOrbit<span className="text-blue-400">.</span>
          </h2>
        </div>

        {/* Useful Links */}
        <div className="space-x-6  flex flex-wrap overflow-hidden justify-start items-start">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          <a target="_blank" href="https://www.linkedin.com/in/maruf-ahmmed-81325824a" className="hover:text-blue-400 transition">Linkedin</a>
          <a target="_blank" href="https://github.com/MaRuF2131" className="hover:text-blue-400 transition">Github</a>
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
