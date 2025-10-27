import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Type, Hash, LinkIcon, AlertTriangle, Shield, Users, Zap, Lock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Sample Checker Box */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Detect Spam & Malware Instantly</h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Analyze emails and messages for suspicious patterns. All processing happens locally in your browser—no
              data ever leaves your device.
            </p>

            <Card className="p-6 border-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground">Sample Email</h3>
                <Badge variant="outline" className="text-xs">
                  Example
                </Badge>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 max-h-64 overflow-y-auto text-sm leading-relaxed">
                <p className="mb-3">Dear friend,</p>
                <p className="mb-3">
                  I am a <mark className="bg-yellow-200 px-1 rounded">Financial</mark> Consultant in control of{" "}
                  <mark className="bg-yellow-200 px-1 rounded">privately owned funds</mark> placed for long term
                  investments.
                </p>
                <p className="mb-3">
                  My client intends to invest these funds in projects. I am willing to finance projects at a{" "}
                  <mark className="bg-yellow-200 px-1 rounded">guaranteed</mark>{" "}
                  <mark className="bg-yellow-200 px-1 rounded">5%</mark> ROI per annum for projects ranging from 2 years
                  term and above but not exceeding 12 years.
                </p>
                <p>
                  <mark className="bg-yellow-200 px-1 rounded">Please</mark> answer{" "}
                  <mark className="bg-yellow-200 px-1 rounded">ASAP</mark>.
                </p>
              </div>
            </Card>
          </div>

          {/* Right: Live Sample Analysis Card */}
          <div className="space-y-6">
            <Card className="p-6 border-2 border-(--color-danger)">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-(--color-danger) text-white mb-2">Poor</Badge>
                  <p className="text-sm text-muted-foreground">Words: 57 • Read time: a few seconds</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-(--color-danger)" aria-hidden="true" />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm mb-3">Findings</h3>

                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Badge variant="destructive" className="text-xs">
                    Urgency
                  </Badge>
                  <span className="text-sm">1 match</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Badge variant="destructive" className="text-xs">
                    Shady
                  </Badge>
                  <span className="text-sm">4 matches</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <Badge className="bg-orange-500 text-white text-xs">Overpromise</Badge>
                  <span className="text-sm">2 matches</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Badge className="bg-(--color-warning) text-white text-xs">Unnatural</Badge>
                  <span className="text-sm">1 match</span>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="flex-1">
                <Link href="/check">Check Your Email Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent">
                <Link href="/learn">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Analyze Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Analyze</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <FileText className="h-8 w-8 text-(--color-primary) mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Text Length</h3>
              <p className="text-sm text-muted-foreground">Analyze total length and density</p>
            </Card>

            <Card className="p-6">
              <Type className="h-8 w-8 text-(--color-primary) mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Capital Letters</h3>
              <p className="text-sm text-muted-foreground">Count ALL-CAPS frequency</p>
            </Card>

            <Card className="p-6">
              <Hash className="h-8 w-8 text-(--color-primary) mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Special Characters</h3>
              <p className="text-sm text-muted-foreground">Measure special character use</p>
            </Card>

            <Card className="p-6">
              <Hash className="h-8 w-8 text-(--color-primary) mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Digits/Numbers</h3>
              <p className="text-sm text-muted-foreground">Count numerals and money patterns</p>
            </Card>

            <Card className="p-6">
              <LinkIcon className="h-8 w-8 text-(--color-primary) mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">URLs</h3>
              <p className="text-sm text-muted-foreground">Detect & count links</p>
            </Card>

            <Card className="p-6">
              <AlertTriangle className="h-8 w-8 text-(--color-primary) mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Misspelled Words</h3>
              <p className="text-sm text-muted-foreground">Flag probable typos</p>
            </Card>

            <Card className="p-6">
              <Shield className="h-8 w-8 text-(--color-primary) mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Suspicious Words</h3>
              <p className="text-sm text-muted-foreground">Flag common scam terms</p>
            </Card>

            <Card className="p-6">
              <Zap className="h-8 w-8 text-(--color-primary) mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Urgency Patterns</h3>
              <p className="text-sm text-muted-foreground">Detect pressure tactics</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Private by Design Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <Lock className="h-12 w-12 text-(--color-primary) mx-auto mb-6" aria-hidden="true" />
          <h2 className="text-3xl font-bold mb-4">Private by Design</h2>
          <p className="text-lg text-muted-foreground mb-6 text-pretty">
            Your privacy is paramount. All analysis happens entirely in your browser using JavaScript. No data is ever
            uploaded to our servers or transmitted over the internet. Your emails and messages stay on your device,
            always.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
              100% Local Processing
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Lock className="h-4 w-4 mr-2" aria-hidden="true" />
              Zero Data Collection
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" aria-hidden="true" />
              Instant Results
            </Badge>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Who Is This For?</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <Users className="h-10 w-10 text-(--color-primary) mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Marketers</h3>
              <p className="text-sm text-muted-foreground">
                Test your email campaigns before sending to ensure they won't trigger spam filters
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Shield className="h-10 w-10 text-(--color-primary) mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Security Teams</h3>
              <p className="text-sm text-muted-foreground">
                Train employees to recognize phishing attempts and suspicious communications
              </p>
            </Card>

            <Card className="p-6 text-center">
              <FileText className="h-10 w-10 text-(--color-primary) mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Students & Researchers</h3>
              <p className="text-sm text-muted-foreground">
                Learn about spam detection techniques and analyze real-world examples
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center bg-gradient-to-br from-blue-50 to-slate-50 border-2">
          <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your Messages?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Get instant insights into potential spam and malware indicators. Fast, private, and free.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/check">Run a Check</Link>
          </Button>
        </Card>
      </section>
    </div>
  )
}
