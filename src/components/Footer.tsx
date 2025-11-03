import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">TG Accessories</h3>
            <p className="text-gray-300 mb-4">
              Your trusted source for quality accessories. We offer a wide range of SIM cards,
              smoking papers, chargers, and cables to meet all your needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 7.609.035 6.298.097 4.993.16 4.088.32 3.397.597A5.878 5.878 0 001.95 1.95c-.277.69-.437.596-.597 1.9C1.035 5.161 1 5.948 1 9.569s.035 4.408.097 5.719c.063 1.301.223 2.206.5 2.897a5.878 5.878 0 001.45 1.45c.69.277 1.596.437 2.897.5C7.609 20.965 8.396 21 12.017 21s4.408-.035 5.719-.097c1.301-.063 2.206-.223 2.897-.5a5.878 5.878 0 001.45-1.45c.277-.69.437-1.596.5-2.897.063-1.301.097-2.088.097-5.719s-.034-4.408-.097-5.719c-.063-1.301-.223-2.206-.5-2.897A5.878 5.878 0 0020.068 1.95c-.69-.277-1.596-.437-2.897-.5C16.409.035 15.622 0 12.017 0zm0 1.863c3.534 0 3.955.013 5.356.077 1.371.062 2.105.29 2.59.483a4.015 4.015 0 011.44.89c.38.38.64.84.89 1.44.193.485.42 1.219.483 2.59.064 1.401.077 1.822.077 5.356s-.013 3.955-.077 5.356c-.062 1.371-.29 2.105-.483 2.59a4.015 4.015 0 01-.89 1.44c-.38.38-.84.64-1.44.89-.485.193-1.219.42-2.59.483-1.401.064-1.822.077-5.356.077s-3.955-.013-5.356-.077c-1.371-.062-2.105-.29-2.59-.483a4.015 4.015 0 01-1.44-.89c-.38-.38-.64-.84-.89-1.44-.193-.485-.42-1.219-.483-2.59-.064-1.401-.077-1.822-.077-5.356s.013-3.955.077-5.356c.062-1.371.29-2.105.483-2.59a4.015 4.015 0 011.44-.89c.38-.38.84-.64 1.44-.89.485-.193 1.219-.42 2.59-.483C8.062 1.876 8.483 1.863 12.017 1.863zm0 3.534a8.17 8.17 0 100 16.34 8.17 8.17 0 000-16.34zm0 2.693a5.477 5.477 0 110 10.954 5.477 5.477 0 010-10.954zm8.354-2.693a1.91 1.91 0 11-3.82 0 1.91 1.91 0 013.82 0z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/sims" className="text-gray-300 hover:text-white transition-colors">SIMs</Link></li>
              <li><Link href="/smoking-papers" className="text-gray-300 hover:text-white transition-colors">Smoking Papers</Link></li>
              <li><Link href="/chargers" className="text-gray-300 hover:text-white transition-colors">Chargers</Link></li>
              <li><Link href="/cables" className="text-gray-300 hover:text-white transition-colors">Cables</Link></li>
              <li><Link href="/power" className="text-gray-300 hover:text-white transition-colors">Power</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 TG Accessories. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}