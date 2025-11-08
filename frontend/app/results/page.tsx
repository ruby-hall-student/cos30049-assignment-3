"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Download, FileText, AlertTriangle, CheckCircle2, XCircle, AlertCircle, ChevronDown } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"
import { exportToCSV, exportToJSON } from "@/lib/analyzer"
import SpamDonutChart from "@/lib/Charts/DonutChart"
import SpamBarChart from "@/lib/Charts/BarChart"

export default function ResultsPage() {
  const router = useRouter()
  const { result } = useAnalysis()

  useEffect(() => {
    if (!result) {
      router.push("/check")
    }
  }, [result, router])

  if (!result) {
    return null
  }

  const riskConfig = {
    low: { color: "text-(--color-success)", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2, rgbColor: "rgba(161, 214, 91, 1)" },
    medium: { color: "text-(--color-warning)", bg: "bg-yellow-50", border: "border-yellow-200", icon: AlertCircle, rgbColor: "rgba(223, 216, 83, 1)"  },
    high: { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: AlertTriangle, rgbColor: "rgba(222, 153, 74, 1)"  },
    severe: { color: "text-(--color-danger)", bg: "bg-red-50", border: "border-red-200", icon: XCircle, rgbColor: "rgba(197, 4, 4, 1)"  },
  }

  const config = riskConfig[result.riskLevel]
  const RiskIcon = config.icon

  const handleDownload = (format: "csv" | "json") => {
    const content = format === "csv" ? exportToCSV(result) : exportToJSON(result)
    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `spam-analysis-${new Date().toISOString().split("T")[0]}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    //testing
    // <div>
    //   <p>Spam? {result.label.toString()} Probability: {result.probability}</p>
    // </div>

    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <Card className={`p-6 mb-8 ${config.bg} ${config.border} border-2`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <RiskIcon className={`h-12 w-12 ${config.color}`} aria-hidden="true" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                {/* display the probability that the email is spam as a percentage */}
                <h1 className="text-3xl font-bold text-center">Result: {result.label? "Spam" : "Not Spam"}</h1>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-1xl font-regular">Risk Percentage: {result.probability * 100}%</h2>
                <Badge className={`${config.color} ${config.bg} border ${config.border}`}>
                  {result.riskLevel.toUpperCase()}
                </Badge>
              </div>
              {/* <p className="text-muted-foreground">
                Analyzed {result.metrics.textLength.words} words • {result.metrics.textLength.readTime} read time
              </p> */}
            </div>
          </div>

          <div className="flex gap-2 no-print">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Download Report
                  <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleDownload("csv")}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload("json")}>Export as JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>Print Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild variant="outline">
              <Link href="/check">Run Another Check</Link>
            </Button>
          </div>
        </div>
      </Card>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-3xl font-bold text-center">Likelihood of Spam</h2>
            <SpamDonutChart spamProbability={result.probability} colours={["rgba(218, 81, 81, 1)","rgba(110, 230, 158, 1)"]} radius="90%"></SpamDonutChart>
        </div>
        <div className="lg:col-span-2 space-y-4">
            <h2 className="text-3xl font-bold text-center">Spam Features</h2>
            <SpamBarChart 
              labels={["No. Digits", "No. Capital Letters", "No. Special Characters", "No. URLs", "No. Misspelled Words", "No. Suspicious Words"]}
              spamFeatureData={[result.features.numDigits, result.features.numCapitalLetters, result.features.numSpecialCharacters, result.features.numURLs, result.features.numMisspelledWords, result.features.numSuspiciousWords]}
              colour={config.rgbColor}
            ></SpamBarChart>
        </div>
      </div>
      {/* <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Analysis Metrics</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-(--color-primary)" aria-hidden="true" />
                Text Length
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters:</span>
                  <span className="font-medium">{result.metrics.textLength.characters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words:</span>
                  <span className="font-medium">{result.metrics.textLength.words}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Read time:</span>
                  <span className="font-medium">{result.metrics.textLength.readTime}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Capital Letters</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Percentage:</span>
                  <span className="font-medium">{result.metrics.capitalLetters.percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longest run:</span>
                  <span className="font-medium">{result.metrics.capitalLetters.longestRun} chars</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Special Characters</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{result.metrics.specialCharacters.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Density:</span>
                  <span className="font-medium">{result.metrics.specialCharacters.density} per 100 chars</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Digits & Numbers</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total digits:</span>
                  <span className="font-medium">{result.metrics.digitsNumbers.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Money patterns:</span>
                  <span className="font-medium">{result.metrics.digitsNumbers.moneyPatterns.length}</span>
                </div>
              </div>
              {result.metrics.digitsNumbers.moneyPatterns.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {result.metrics.digitsNumbers.moneyPatterns.slice(0, 5).map((pattern, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">URLs Found</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total URLs:</span>
                  <span className="font-medium">{result.metrics.urls.count}</span>
                </div>
              </div>
              {result.metrics.urls.domains.length > 0 && (
                <div className="mt-3 space-y-1">
                  {result.metrics.urls.domains.slice(0, 3).map((domain, i) => (
                    <p key={i} className="text-xs text-muted-foreground truncate">
                      {domain}
                    </p>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Misspelled Words</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Count:</span>
                  <span className="font-medium">{result.metrics.misspelledWords.count}</span>
                </div>
              </div>
              {result.metrics.misspelledWords.examples.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {result.metrics.misspelledWords.examples.map((word, i) => (
                    <Badge key={i} variant="destructive" className="text-xs">
                      {word}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Risk Categories</h2>

            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="urgency" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive">Urgency</Badge>
                    <span className="text-sm text-muted-foreground">
                      {result.riskCategories.urgency.count}{" "}
                      {result.riskCategories.urgency.count === 1 ? "match" : "matches"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Pressure tactics designed to make you act quickly without thinking.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.riskCategories.urgency.matches.map((match, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {match}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shady" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive">Shady</Badge>
                    <span className="text-sm text-muted-foreground">
                      {result.riskCategories.shady.count}{" "}
                      {result.riskCategories.shady.count === 1 ? "match" : "matches"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Vague or suspicious language often used in scams and phishing attempts.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.riskCategories.shady.matches.map((match, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {match}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="overpromise" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-orange-500">Overpromise</Badge>
                    <span className="text-sm text-muted-foreground">
                      {result.riskCategories.overpromise.count}{" "}
                      {result.riskCategories.overpromise.count === 1 ? "match" : "matches"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Unrealistic guarantees and promises that are too good to be true.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.riskCategories.overpromise.matches.map((match, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {match}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="unnatural" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-(--color-warning)">Unnatural</Badge>
                    <span className="text-sm text-muted-foreground">
                      {result.riskCategories.unnatural.count}{" "}
                      {result.riskCategories.unnatural.count === 1 ? "match" : "matches"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Odd phrasing and unnatural language patterns common in automated scams.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.riskCategories.unnatural.matches.map((match, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {match}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Original Content</h2>
            <div className="bg-muted/50 rounded-lg p-4 max-h-[600px] overflow-y-auto text-sm leading-relaxed">
              {result.highlightedText.map((segment, i) =>
                segment.isHighlighted ? (
                  <mark key={i} className="bg-yellow-200 px-1 rounded">
                    {segment.text}
                  </mark>
                ) : (
                  <span key={i}>{segment.text}</span>
                ),
              )}
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
              <p className="font-medium mb-1">Highlighted words indicate suspicious patterns</p>
              <p className="text-blue-600">Yellow highlights show flagged terms</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="hidden print-only">
        <h1 className="text-2xl font-bold mb-2">Spam & Malware Analysis Report</h1>
        <p className="text-sm text-muted-foreground mb-4">Generated on {new Date(result.timestamp).toLocaleString()}</p>
      </div> */}
    </div>
  )
}
