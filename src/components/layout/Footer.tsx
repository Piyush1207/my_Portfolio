import Link from "next/link";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Me", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Works", href: "#works" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="w-full bg-foreground text-background relative overflow-hidden pt-50 pb-12 mt-auto">
      {/* Huge MAJD Watermark */}
      <div className="absolute bottom-[-10%] left-1/2 transform -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
        <h1 className="text-[100px] md:text-[300px] lg:text-[400px] font-black tracking-tighter text-white/3 leading-none">
          Piyush
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-300 mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between gap-12">
        {/* Left: Scaling Start-ups */}
        <div className="flex-1">
          <h2 className="text-[50px] md:text-[70px] font-bold tracking-tighter leading-[1.1] max-w-sm">
            Scaling Start-ups for Growth.
          </h2>
        </div>

        <div className="flex-1 flex flex-col md:flex-row justify-between gap-12 md:gap-8">
          {/* Middle: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl md:text-2xl font-medium">/Quick links</h3>
            <div className="flex flex-wrap gap-3 max-w-70">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="bg-white text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Contact */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl md:text-2xl font-medium">/Contact</h3>
            <a 
              href="mailto:piyushatalkar12@gmail.com" 
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              piyushatalkar12@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}