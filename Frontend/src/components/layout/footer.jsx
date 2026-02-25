import { Heart } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t-2 border-sky-200 bg-gradient-to-r from-blue-950 to-blue-900 text-white">
      <div className="px-6 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="mb-2 font-bold text-sky-300">AquaTrack</h3>
            <p className="text-sm text-blue-200">Smart water management for sustainable communities</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-1 text-sm text-blue-300">
              <li><a href="#" className="hover:text-sky-300 transition">About Us</a></li>
              <li><a href="#" className="hover:text-sky-300 transition">Contact</a></li>
              <li><a href="#" className="hover:text-sky-300 transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 font-semibold text-white">Support</h4>
            <ul className="space-y-1 text-sm text-blue-300">
              <li><a href="#" className="hover:text-sky-300 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-sky-300 transition">Documentation</a></li>
              <li><a href="#" className="hover:text-sky-300 transition">Status Page</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-sky-400/30 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-blue-300">
              © {currentYear} AquaTrack. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-blue-300">
              Made with <Heart size={16} className="text-sky-400" /> for sustainable water futures
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer