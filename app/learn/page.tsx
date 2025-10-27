import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Code, BookOpen, ArrowRight } from "lucide-react"

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-12">
        <Lightbulb className="h-16 w-16 text-(--color-primary) mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">How the System Works</h1>
        <p className="text-xl text-muted-foreground text-pretty">
          Transparent heuristics. Machine learning coming soon.
        </p>
      </div>

      {/* Overview */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Analysis Overview</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Our spam and malware detector uses a combination of heuristic analysis techniques to evaluate messages for
          suspicious patterns. All processing happens entirely in your browser using JavaScript, ensuring complete
          privacy and instant results.
        </p>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Text Parsing</h3>
              <p className="text-sm text-muted-foreground">
                We extract and tokenize the message content, identifying words, characters, URLs, and patterns.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Pattern Matching</h3>
              <p className="text-sm text-muted-foreground">
                We compare the content against known suspicious word lists and common scam patterns.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Metric Calculation</h3>
              <p className="text-sm text-muted-foreground">
                We analyze various metrics like capital letter frequency, special characters, and urgency indicators.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Risk Scoring</h3>
              <p className="text-sm text-muted-foreground">
                We combine all metrics into a weighted risk score from 0-100, categorized as low, medium, high, or
                severe.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Detection Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">What We Detect</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-6">
            <Badge variant="destructive" className="mb-3">
              Urgency
            </Badge>
            <p className="text-sm text-muted-foreground">
              Words like "ASAP", "urgent", "act now", and "limited time" that create artificial pressure.
            </p>
          </Card>

          <Card className="p-6">
            <Badge variant="destructive" className="mb-3">
              Shady Language
            </Badge>
            <p className="text-sm text-muted-foreground">
              Vague greetings like "dear friend", mentions of "confidential" deals, and offshore references.
            </p>
          </Card>

          <Card className="p-6">
            <Badge className="bg-orange-500 mb-3">Overpromises</Badge>
            <p className="text-sm text-muted-foreground">
              "Guaranteed" returns, "risk-free" investments, and unrealistic profit claims.
            </p>
          </Card>

          <Card className="p-6">
            <Badge className="bg-(--color-warning) mb-3">Unnatural Phrasing</Badge>
            <p className="text-sm text-muted-foreground">
              Awkward expressions like "kindly revert back" and "do the needful" common in automated scams.
            </p>
          </Card>
        </div>
      </div>

      {/* Coming Soon */}
      <Card className="p-12 text-center bg-gradient-to-br from-blue-50 to-slate-50 border-2 mb-8">
        <Code className="h-12 w-12 text-(--color-primary) mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold mb-4">Documentation Coming Soon</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto text-pretty">
          We're working on comprehensive documentation of our detection pipeline and plan to open-source our word lists
          and heuristics. Stay tuned for updates!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Badge variant="outline" className="px-4 py-2">
            <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
            Full Pipeline Docs
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Code className="h-4 w-4 mr-2" aria-hidden="true" />
            Open Source Word Lists
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Lightbulb className="h-4 w-4 mr-2" aria-hidden="true" />
            ML Model Training
          </Badge>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Try It?</h2>
        <p className="text-muted-foreground mb-6">
          Test the analyzer with your own messages and see the results instantly.
        </p>
        <Button asChild size="lg">
          <Link href="/check">
            Check Your Message
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
