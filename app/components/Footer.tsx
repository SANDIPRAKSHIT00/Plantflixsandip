import { FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-8">
      <div className="container mx-auto px-4 text-center">

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-4">

          <a href="#" className="hover:text-gray-200 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-200 transition"><FaInstagram /></a>
          <a href="#" className="hover:text-gray-200 transition"><FaGithub /></a>
        </div>

        <p className="text-sm text-gray-200">© {new Date().getFullYear()} Plantflix. All rights reserved.</p>
      </div>
    </footer>
  );
}
