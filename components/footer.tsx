import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <nav className="flex gap-6" aria-label="Footer navigation">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground text-center md:text-right">
            Front-end demo. No data is uploaded; analysis runs in your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}
