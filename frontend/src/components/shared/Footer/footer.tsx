"use client";

import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { FoodHubLogo } from "../Navbar1/foodhub-logo";
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const { user } = useUser();
  const year = new Date().getFullYear();

  return (
    <>
      <style jsx global>{`
        @keyframes footer-gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float-icon {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes link-shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .footer-gradient {
          background: linear-gradient(
            135deg,
            hsl(var(--background)) 0%,
            hsl(var(--muted) / 0.5) 50%,
            hsl(var(--background)) 100%
          );
          background-size: 200% 200%;
          animation: footer-gradient 15s ease infinite;
        }

        .animate-float-icon {
          animation: float-icon 3s ease-in-out infinite;
        }

        .link-hover-effect {
          position: relative;
          background: linear-gradient(
            90deg,
            transparent 0%,
            hsl(var(--primary) / 0.2) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          background-position: -200% center;
          transition: background-position 0.3s ease;
        }

        .link-hover-effect:hover {
          background-position: 0% center;
        }
      `}</style>

      <footer className="relative overflow-hidden bg-linear-to-b from-background via-muted/20 to-background">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />

        <div className="container relative mx-auto px-4 sm:px-6 py-12 lg:py-16">
      

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="space-y-6 lg:col-span-2">
              <div className="animate-float-icon">
                <FoodHubLogo />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Fresh homemade meals from trusted local providers. Supporting local food entrepreneurs and bringing authentic flavors to your table.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    support@foodhub.com
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-sm group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    +880 1234-567890
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    Dhaka, Bangladesh
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 pt-2">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Youtube, href: "#" },
                ].map((social, i) => (
                  <Link
                    key={i}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-border/40 bg-background/50 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:rotate-6"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <social.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Explore Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                Explore
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Meals", href: "/meals" },
                  { label: "Providers", href: "/providers" },
                  { label: "Categories", href: "/categories" },
                  { label: "About Us", href: "/about" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                    >
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="link-hover-effect px-1 rounded">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                Account
              </h4>
              <ul className="space-y-3">
                {!user ? (
                  <>
                    {[
                      { label: "Login", href: "/login" },
                      { label: "Register", href: "/register" },
                    ].map((item, i) => (
                      <li key={i}>
                        <Link
                          href={item.href}
                          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                        >
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="link-hover-effect px-1 rounded">
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/profile"
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                      >
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="link-hover-effect px-1 rounded">
                          Profile
                        </span>
                      </Link>
                    </li>

                    {user.role === "CUSTOMER" && (
                      <li>
                        <Link
                          href="/orders"
                          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                        >
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="link-hover-effect px-1 rounded">
                            My Orders
                          </span>
                        </Link>
                      </li>
                    )}

                    {user.role === "PROVIDER" && (
                      <li>
                        <Link
                          href="/provider/dashboard"
                          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                        >
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="link-hover-effect px-1 rounded">
                            Provider Dashboard
                          </span>
                        </Link>
                      </li>
                    )}

                    {user.role === "ADMIN" && (
                      <li>
                        <Link
                          href="/admin"
                          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                        >
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="link-hover-effect px-1 rounded">
                            Admin Panel
                          </span>
                        </Link>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                Legal
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "/cookies" },
                  { label: "Support", href: "/support" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                    >
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="link-hover-effect px-1 rounded">
                        {item.label}
                      </span>
                      {item.label === "Support" && (
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          <div className="flex  items-center justify-center gap-4 text-xs text-muted-foreground md:flex-row">
           
              © {year} FoodHub. All rights reserved.
            

          </div>
        </div>
      </footer>
    </>
  );
}