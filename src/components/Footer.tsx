import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    shop: [
      { name: 'SIM Cards', href: '/sims' },
      { name: 'Smoking Papers', href: '/smoking-papers' },
      { name: 'Chargers', href: '/chargers' },
      { name: 'Cables', href: '/cables' },
      { name: 'Power Banks', href: '/power' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping Policy', href: '#' },
      { name: 'Returns & Exchanges', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 7.609.035 6.298.097 4.993.16 4.088.32 3.397.597A5.878 5.878 0 001.95 1.95c-.277.69-.437.596-.597 1.9C1.035 5.161 1 5.948 1 9.569s.035 4.408.097 5.719c.063 1.301.223 2.206.5 2.897a5.878 5.878 0 001.45 1.45c.69.277 1.596.437 2.897.5C7.609 20.965 8.396 21 12.017 21s4.408-.035 5.719-.097c1.301-.063 2.206-.223 2.897-.5a5.878 5.878 0 001.45-1.45c.277-.69.437-1.596.5-2.897.063-1.301.097-2.088.097-5.719s-.034-4.408-.097-5.719c-.063-1.301-.223-2.206-.5-2.897A5.878 5.878 0 0020.068 1.95c-.69-.277-1.596-.437-2.897-.5C16.409.035 15.622 0 12.017 0zm0 1.863c3.534 0 3.955.013 5.356.077 1.371.062 2.105.29 2.59.483a4.015 4.015 0 011.44.89c.38.38.64.84.89 1.44.193.485.42 1.219.483 2.59.064 1.401.077 1.822.077 5.356s-.013 3.955-.077 5.356c-.062 1.371-.29 2.105-.483 2.59a4.015 4.015 0 01-.89 1.44c-.38.38-.84.64-1.44.89-.485.193-1.219.42 2.59-.483-1.401.064-1.822.077-5.356.077s-3.955-.013-5.356-.077c-1.371-.062-2.105-.29-2.59-.483a4.015 4.015 0 01-1.44-.89c-.38-.38-.64-.84-.89-1.44-.193-.485-.42-1.219-.483-2.59-.064-1.401-.077-1.822-.077-5.356s.013-3.955.077-5.356c.062-1.371.29-2.105.483-2.59a4.015 4.015 0 011.44-.89c.38-.38.84-.64 1.44-.89.485-.193 1.219-.42 2.59-.483C8.062 1.876 8.483 1.863 12.017 1.863zm0 3.534a8.17 8.17 0 100 16.34 8.17 8.17 0 000-16.34zm0 2.693a5.477 5.477 0 110 10.954 5.477 5.477 0 010-10.954zm8.354-2.693a1.91 1.91 0 11-3.82 0 1.91 1.91 0 013.82 0z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary p-0.5 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                  <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                TG Accessories
              </span>
            </Link>
            <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
              Your trusted source for premium tech accessories. We offer a curated selection of SIM cards, chargers, and cables to keep you connected and powered up.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/25"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-primary rounded-full mr-3" />
              Shop
            </h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-accent rounded-full mr-3" />
              Support
            </h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-accent mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © {currentYear} TG Accessories. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-slate-600 text-sm">Crafted with</span>
            <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-slate-600 text-sm">by Antigravity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}