"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalysis } from "@/lib/analysis-context"

export function Navigation() {
  const pathname = usePathname()
  const { hasResults } = useAnalysis()

  const navLinks = [
    // { href: "/check", label: "Check Now" },
    { href: "/learn", label: "Learn" },
    { href: "/results", label: "Results", disabled: !hasResults },
  ]

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
          <Shield className="h-6 w-6 text-(--color-primary)" aria-hidden="true" />
          <span>Spam & Malware Detector</span>
        </Link>

        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-6" role="menubar">
            {navLinks.map((link) => (
              <li key={link.href} role="none">
                <Link
                  href={link.disabled ? "#" : link.href}
                  role="menuitem"
                  className={`text-sm font-medium transition-colors hover:text-(--color-primary) ${
                    pathname === link.href ? "text-(--color-primary)" : "text-foreground/80"
                  } ${link.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  aria-disabled={link.disabled}
                  tabIndex={link.disabled ? -1 : 0}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <Button asChild size="sm">
              <Link href="/check">Check Now</Link>
            </Button>
          </ul>
        </div>
      </div>
    </nav>
  )
}
