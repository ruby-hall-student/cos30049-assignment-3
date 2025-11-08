// // Client-side text analysis engine

export interface AnalysisResult {
  subject: string
  body: string

  features: {
    textLength: number
    numCapitalLetters: number
    numSpecialCharacters: number
    numDigits: number
    numURLs: number
    numMisspelledWords: number
    numSuspiciousWords: number
    numOfWordsettings: number
    numOfWordcnn: number
    numOfWordprivacy: number
    numOfWordvideo: number
    numOfWordcrime: number
  }

  label: boolean
  probability: number
  riskLevel: "low" | "medium" | "high" | "severe"

  //subjectHighlightedText: Array<{ text: string; isHighlighted: boolean;}>
  //bodyHighlightedText: Array<{ text: string; isHighlighted: boolean;}>
//   // originalText: string
//   // timestamp: string
//   // score: number
//   // riskLevel: "low" | "medium" | "high" | "severe"
//   // metrics: {
//   //   textLength: {
//   //     characters: number
//   //     words: number
//   //     readTime: string
//   //   }
//   //   capitalLetters: {
//   //     percentage: number
//   //     longestRun: number
//   //   }
//   //   specialCharacters: {
//   //     total: number
//   //     density: number
//   //   }
//   //   digitsNumbers: {
//   //     total: number
//   //     moneyPatterns: string[]
//   //   }
//   //   urls: {
//   //     count: number
//   //     domains: string[]
//   //   }
//   //   misspelledWords: {
//   //     count: number
//   //     examples: string[]
//   //   }
//   //   suspiciousWords: {
//   //     count: number
//   //     matches: Array<{ word: string; frequency: number; category: string }>
//   //   }
//   // }
//   // riskCategories: {
//   //   urgency: { count: number; matches: string[] }
//   //   shady: { count: number; matches: string[] }
//   //   overpromise: { count: number; matches: string[] }
//   //   unnatural: { count: number; matches: string[] }
//   // }
//   // highlightedText: Array<{ text: string; isHighlighted: boolean; category?: string }>
}

export function analyseText(text: any): AnalysisResult {
  //store the risk level according to the probability that the email is spam
  const riskLevel: "low" | "medium" | "high" | "severe" =
  text.probability < 0.25 ? "low" :  text.probability < 0.5 ? "medium" : text.probability < 0.75 ? "high" : "severe"
  return {
    subject: text.subject,
    body: text.body,
    features: text.features,
    label: text.label,
    probability: text.probability,
    riskLevel: riskLevel,
    //subjectHighlightedText: text.subjectHighlightedText,
    //bodyHighlightedText: text.bodyHighlightedText
  }
}

// // const SUSPICIOUS_WORDS = {
// //   urgency: ["asap", "urgent", "immediately", "act now", "limited time", "expires", "hurry", "quick", "fast"],
// //   shady: ["dear friend", "dear sir", "dear madam", "confidential", "private", "secret", "offshore", "untraceable"],
// //   overpromise: ["guaranteed", "promise", "risk-free", "no risk", "100%", "free money", "easy money", "roi", "profit"],
// //   unnatural: ["kindly", "needful", "revert back", "do the needful", "please answer"],
// // }

// // const COMMON_MISSPELLINGS = ["recieve", "occured", "seperate", "definately", "accomodate", "occassion"]

// // export function analyzeText(text: string): AnalysisResult {
// //   const timestamp = new Date().toISOString()
// //   const words = text.split(/\s+/).filter(Boolean)
// //   const wordCount = words.length
// //   const charCount = text.length

// //   // Text length metrics
// //   const readTime = wordCount < 50 ? "a few seconds" : `${Math.ceil(wordCount / 200)} min`

// //   // Capital letters analysis
// //   const capitalLetters = text.match(/[A-Z]/g) || []
// //   const capitalPercentage = (capitalLetters.length / charCount) * 100
// //   const allCapsWords = words.filter((w) => w === w.toUpperCase() && w.length > 1)
// //   const longestCapsRun = Math.max(...allCapsWords.map((w) => w.length), 0)

// //   // Special characters
// //   const specialChars = text.match(/[^a-zA-Z0-9\s]/g) || []
// //   const specialCharDensity = (specialChars.length / charCount) * 100

// //   // Digits and money patterns
// //   const digits = text.match(/\d/g) || []
// //   const moneyPatterns = text.match(/(\$|€|£|USD|AUD|EUR|\d+%)/gi) || []

// //   // URLs
// //   const urlMatches = text.match(/https?:\/\/[^\s]+/gi) || []
// //   const domains = urlMatches.map((url) => {
// //     try {
// //       return new URL(url).hostname
// //     } catch {
// //       return url
// //     }
// //   })

// //   // Misspelled words (simple check)
// //   const lowerText = text.toLowerCase()
// //   const foundMisspellings = COMMON_MISSPELLINGS.filter((word) => lowerText.includes(word))

// //   // Suspicious words analysis
// //   const suspiciousMatches: Array<{ word: string; frequency: number; category: string }> = []
// //   const riskCategories = {
// //     urgency: { count: 0, matches: [] as string[] },
// //     shady: { count: 0, matches: [] as string[] },
// //     overpromise: { count: 0, matches: [] as string[] },
// //     unnatural: { count: 0, matches: [] as string[] },
// //   }

// //   Object.entries(SUSPICIOUS_WORDS).forEach(([category, wordList]) => {
// //     wordList.forEach((suspiciousWord) => {
// //       const regex = new RegExp(`\\b${suspiciousWord}\\b`, "gi")
// //       const matches = text.match(regex)
// //       if (matches) {
// //         const frequency = matches.length
// //         suspiciousMatches.push({ word: suspiciousWord, frequency, category })
// //         riskCategories[category as keyof typeof riskCategories].count += frequency
// //         riskCategories[category as keyof typeof riskCategories].matches.push(...matches)
// //       }
// //     })
// //   })

// //   // Calculate risk score (0-100)
// //   let score = 0
// //   score += Math.min(capitalPercentage * 2, 30) // Max 30 points for caps
// //   score += Math.min(specialCharDensity * 1.5, 20) // Max 20 points for special chars
// //   score += Math.min(suspiciousMatches.length * 5, 30) // Max 30 points for suspicious words
// //   score += Math.min(urlMatches.length * 5, 10) // Max 10 points for URLs
// //   score += Math.min(foundMisspellings.length * 5, 10) // Max 10 points for misspellings

// //   const riskLevel: "low" | "medium" | "high" | "severe" =
// //     score < 25 ? "low" : score < 50 ? "medium" : score < 75 ? "high" : "severe"

// //   // Create highlighted text segments
// //   const highlightedText = createHighlightedSegments(
// //     text,
// //     suspiciousMatches.map((m) => m.word),
// //   )

// //   return {
// //     originalText: text,
// //     timestamp,
// //     score: Math.round(score),
// //     riskLevel,
// //     metrics: {
// //       textLength: {
// //         characters: charCount,
// //         words: wordCount,
// //         readTime,
// //       },
// //       capitalLetters: {
// //         percentage: Math.round(capitalPercentage * 10) / 10,
// //         longestRun: longestCapsRun,
// //       },
// //       specialCharacters: {
// //         total: specialChars.length,
// //         density: Math.round(specialCharDensity * 10) / 10,
// //       },
// //       digitsNumbers: {
// //         total: digits.length,
// //         moneyPatterns: [...new Set(moneyPatterns)],
// //       },
// //       urls: {
// //         count: urlMatches.length,
// //         domains: [...new Set(domains)],
// //       },
// //       misspelledWords: {
// //         count: foundMisspellings.length,
// //         examples: foundMisspellings.slice(0, 10),
// //       },
// //       suspiciousWords: {
// //         count: suspiciousMatches.reduce((sum, m) => sum + m.frequency, 0),
// //         matches: suspiciousMatches,
// //       },
// //     },
// //     riskCategories,
// //     highlightedText,
// //   }
// // }

// // function createHighlightedSegments(
// //   text: string,
// //   suspiciousWords: string[],
// // ): Array<{ text: string; isHighlighted: boolean; category?: string }> {
// //   const segments: Array<{ text: string; isHighlighted: boolean; category?: string }> = []
// //   let lastIndex = 0

// //   // Create a regex pattern for all suspicious words
// //   const pattern = suspiciousWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")
// //   if (!pattern) {
// //     return [{ text, isHighlighted: false }]
// //   }

// //   const regex = new RegExp(`\\b(${pattern})\\b`, "gi")
// //   let match

// //   while ((match = regex.exec(text)) !== null) {
// //     // Add non-highlighted text before match
// //     if (match.index > lastIndex) {
// //       segments.push({ text: text.slice(lastIndex, match.index), isHighlighted: false })
// //     }

// //     // Add highlighted match
// //     segments.push({ text: match[0], isHighlighted: true, category: "suspicious" })
// //     lastIndex = match.index + match[0].length
// //   }

// //   // Add remaining text
// //   if (lastIndex < text.length) {
// //     segments.push({ text: text.slice(lastIndex), isHighlighted: false })
// //   }

// //   return segments
// // }

export function exportToCSV(result: AnalysisResult): string {
  const rows = [
    ["Metric", "Value"],
    ["Text", result.subject + " " + result.body],
    ["IsSpam?", result.label.toString()],
    ["ConfidenceScore", result.probability.toString()],
    ["TextLength", result.features.textLength.toString()],
    ["Capital Letters", result.features.numCapitalLetters.toString()],
    ["Special Characters", result.features.numSpecialCharacters.toString()],
    ["URLs", result.features.numURLs.toString()],
    ["Misspelled Words", result.features.numMisspelledWords.toString()],
    ["Suspicious Words", result.features.numSuspiciousWords.toString()],
  ]

  return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

export function exportToJSON(result: AnalysisResult): string {
  return JSON.stringify(result, null, 2)
}
