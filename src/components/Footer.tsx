import Link from "next/link";
import content from "@/data/site-content.json";

export default function Footer() {
  const links = [
    { name: "ABOUT", href: "#about" },
    { name: "PROGRAMS", href: "#programs" },
    { name: "BOOK", href: "#book" },
    { name: "EVENTS", href: "#events" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <footer className="border-t border-white/5 bg-black pt-16 pb-12 mt-auto">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-6 flex flex-col gap-4 max-w-md">
            <Link href="#hero" className="font-sans font-black tracking-[0.2em] text-white text-md uppercase">
              SAMUEL ADANUVO
            </Link>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              {content.footer.connectDescription}
            </p>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-6">Sitemap</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/60 hover:text-[#C5A059] transition-colors duration-200 uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Column */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-6">Connect</h4>
            <ul className="space-y-3">
              {content.footer.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/60 hover:text-white transition-colors duration-200 tracking-wider flex items-center gap-1"
                  >
                    <span className="text-[#C5A059] font-bold">↳</span> {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:justify-between items-center gap-4 text-[10px] tracking-wider text-white/40 uppercase">
          <p>{content.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
