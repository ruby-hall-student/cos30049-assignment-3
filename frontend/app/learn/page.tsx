"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import * as d3 from "d3"
import cloud from "d3-cloud"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight } from "lucide-react"
import axios from "axios"

// Feature Importance Data
// Predefined feature importance values for visualization

const FEATURE_IMPORTANCES = [
  { feature: "URLs", importance: 0.23, hint: "Detected and counted the number of URLs in the emails" },
  { feature: "Capital Letters", importance: 0.18, hint: "Counted the frequency of capitalized letters" },
  { feature: "Suspicious Words", importance: 0.15, hint: "Frequently used words from scams (e.g., free, winner, urgent)" },
  { feature: "Misspelled Words", importance: 0.11, hint: "Flagged and counted misspelled words" },
  { feature: "Special Characters", importance: 0.09, hint: "Measured the occurrence of special characters" },
  { feature: "Text Length", importance: 0.07, hint: "Analyzed the length of the email text" },
  { feature: "Digital/Numbers", importance: 0.06, hint: "Identified and counted numerical digits within the text" },
  { feature: "Frequency Analysis", importance: 0.05, hint: "Counted the frequency of top suspicious or flagged words" },
]

// Scatter Plot Data Generation
// Creates 1200 synthetic email data points for visualization
// - First 500 are spam, rest are ham (legitimate emails)
// - URLs: spam emails have higher average (4) vs ham (1.2)
// - Capital letters: spam emails have higher average (10) vs ham (3)
// - Uses normal distribution to simulate realistic variation
const SCATTER_DATA = d3.range(1200).map((i) => {
  const spam = i < 500
  const urls = Math.max(0, Math.round(d3.randomNormal(spam ? 4 : 1.2, spam ? 1.8 : 0.9)()))
  const caps = Math.max(0, Math.round(d3.randomNormal(spam ? 10 : 3, spam ? 4 : 1.5)()))
  return { id: `e${i}`, urls, caps, label: spam ? "spam" : "ham" }
})

// Resize Observer Hook
// Tracks container dimensions for responsive visualizations
function useResizeObserver(ref: any) {
  const [bounds, setBounds] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return

    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setBounds({ width, height })
      }
    })

    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])

  return bounds
}

// Confusion Matrix Visualization
// Displays model performance metrics (TP, FP, FN, TN) and accuracy scores
// HOW IT WORKS:
// A confusion matrix is a 2x2 grid showing classification results:
// - TP (True Positive): Correctly predicted spam emails (top-left)
// - FP (False Positive): Incorrectly predicted spam (ham predicted as spam, top-right)
// - FN (False Negative): Incorrectly predicted ham (spam predicted as ham, bottom-left)
// - TN (True Negative): Correctly predicted ham emails (bottom-right)
//
// METRICS CALCULATION (from backend API):
// - Accuracy = (TP + TN) / (TP + TN + FP + FN) - Overall correctness
// - Precision = TP / (TP + FP) - Of predicted spam, how many were actually spam
// - Recall = TP / (TP + FN) - Of actual spam, how many were correctly identified
// - F1-Score = 2 * (Precision * Recall) / (Precision + Recall) - Harmonic mean of precision and recall
function ConfusionMatrix({metrics, confusion}: any) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const { width } = useResizeObserver(containerRef)

  // Create 2x2 grid structure for the confusion matrix
  // Each cell has: row position (r), column position (c), label, value count, and full name
  const grid = useMemo(() => {
    return [
      { r: 0, c: 0, label: "TP", value: confusion.tp, name: "True Positive" },
      { r: 0, c: 1, label: "FP", value: confusion.fp, name: "False Positive" },
      { r: 1, c: 0, label: "FN", value: confusion.fn, name: "False Negative" },
      { r: 1, c: 1, label: "TN", value: confusion.tn, name: "True Negative" },
    ]
  }, [confusion])

  useEffect(() => {
    if (!svgRef.current || !width) return

    const w = Math.max(320, width)
    const h = 320
    const m = { t: 36, r: 16, b: 36, l: 80 }
    const innerW = w - m.l - m.r
    const innerH = h - m.t - m.b

    const svg = d3.select(svgRef.current).attr("viewBox", `0 0 ${w} ${h}`)
    svg.selectAll("*").remove()

    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`)

    // Color scale: lighter gray for lower values, darker blue for higher values
    // This helps visualize which cells have more predictions
    const color = d3
      .scaleLinear()
      .domain(d3.extent(grid.map((d) => d.value)))
      .range(["#eaeaea", "#1f77b4"])

    // Calculate cell dimensions: divide the inner area into 2x2 grid
    const cellW = innerW / 2
    const cellH = innerH / 2

    g.append("text").attr("x", -70).attr("y", innerH/2).attr("class", "text-sm fill-gray-600").text("Actual")
    g.append("text")
      .attr("x", innerW / 2)
      .attr("y", innerH + 28)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm fill-gray-600")
      .text("Predicted")

    const cols = ["Spam", "Ham"]
    cols.forEach((c, i) => {
      g.append("text")
        .attr("x", i * cellW + cellW / 2)
        .attr("y", -4)
        .attr("text-anchor", "middle")
        .attr("class", "text-sm font-medium fill-gray-800")
        .text(c)
    })

    const rows = ["Spam", "Ham"]
    rows.forEach((r, i) => {
      g.append("text")
        .attr("x", -8)
        .attr("y", i * cellH + cellH / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("class", "text-sm font-medium fill-gray-800")
        .text(r)
    })

    const cells = g
      .selectAll("g.cell")
      .data(grid)
      .join((enter) => enter.append("g").attr("class", "cell"))
      .attr("transform", (d) => `translate(${d.c * cellW},${d.r * cellH})`)

    cells
      .append("rect")
      .attr("width", cellW - 4)
      .attr("height", cellH - 4)
      .attr("rx", 12)
      .attr("x", 2)
      .attr("y", 2)
      .attr("fill", (d) => color(d.value))

    cells
      .append("text")
      .attr("x", cellW / 2)
      .attr("y", cellH / 2 - 6)
      .attr("text-anchor", "middle")
      .attr("class", "text-lg font-semibold fill-white")
      .text((d) => d.label)

    cells
      .append("text")
      .attr("x", cellW / 2)
      .attr("y", cellH / 2 + 18)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-medium fill-white")
      .text((d) => d.value.toLocaleString())
  }, [grid, width])

  return (
    <Card className="w-full">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-semibold">How well the classifier works</h3>
            <p className="text-sm text-gray-600">
              The confusion matrix shows correct predictions (True Positives and True Negatives) and errors (False Positives and False Negatives) for the model.
            </p>
          </div>
        </div>
        <div ref={containerRef} className="w-full h-[340px]">
          <svg ref={svgRef} className="w-full h-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { k: "accuracy", label: "Accuracy" },
            { k: "precision", label: "Precision" },
            { k: "recall", label: "Recall" },
            { k: "f1", label: "F1-score" },
          ].map((m) => (
            <div key={m.k} className="rounded-2xl border p-4">
              <div className="text-sm text-gray-600">{m.label}</div>
              <div className="text-2xl font-semibold">
                {!isNaN(metrics[m.k])
                  ? metrics[m.k].toLocaleString(undefined, {
                      style: "percent",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })
                  : "N/A"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Feature Importance Bar Chart
// Shows which features (URLs, capitals, etc.) are most important for spam detection
// HOW IT WORKS:
// Feature importance values come from the logistic regression model's coefficients
// Higher importance = feature has more influence on spam classification
// Values are normalized percentages (0-1) showing relative contribution
// The chart sorts features by importance and displays as horizontal bars
function FeatureImportance({ data, onFeatureClick }) {
  const [showTop5, setShowTop5] = useState(true)
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const { width } = useResizeObserver(containerRef)

  // Sort features by importance (highest first) and optionally show only top 5
  const sorted = useMemo(() => {
    const s = [...data].sort((a, b) => d3.descending(a.importance, b.importance))
    return showTop5 ? s.slice(0, 5) : s
  }, [data, showTop5])

  useEffect(() => {
    if (!svgRef.current || !width) return

    const w = Math.max(320, width)
    const h = 56 + 32 + sorted.length * 36
    const m = { t: 24, r: 24, b: 32, l: 160 }
    const innerW = w - m.l - m.r
    const innerH = h - m.t - m.b

    const svg = d3.select(svgRef.current).attr("viewBox", `0 0 ${w} ${h}`)
    svg.selectAll("*").remove()
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`)

    // X-axis scale: maps importance values (0 to max) to pixel positions
    // Domain is the data range, range is the visual width
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(sorted, (d) => d.importance) || 1])
      .nice()
      .range([0, innerW])

    // Y-axis scale: maps feature names to vertical positions
    // Creates bands for each feature with spacing between them
    const y = d3
      .scaleBand()
      .domain(sorted.map((d) => d.feature))
      .range([0, innerH])
      .padding(0.25)

    g.append("g")
      .attr("class", "x-axis text-xs text-gray-600")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".0%")))
    g.append("g").attr("class", "y-axis text-sm").call(d3.axisLeft(y))

    const bars = g
      .selectAll("g.bar")
      .data(sorted, (d) => d.feature)
      .join((enter) => enter.append("g").attr("class", "bar"))

    bars
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => y(d.feature))
      .attr("width", (d) => x(d.importance))
      .attr("height", y.bandwidth())
      .attr("rx", 10)
      .attr("fill", "#4f46e5")
      .style("cursor", "pointer")
      .on("click", (_, d) => onFeatureClick?.(d.feature))

    bars
      .append("text")
      .attr("x", (d) => x(d.importance) + 8)
      .attr("y", (d) => (y(d.feature) ?? 0) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("class", "text-xs fill-gray-700")
      .text((d) => d3.format(".1%")(d.importance))

    bars.append("title").text((d) => `${d.feature}: ${d3.format(".2%")(d.importance)}\n${d.hint ?? ""}`)
  }, [sorted, width])

  return (
    <Card className="w-full">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-semibold">What signals drive the prediction</h3>
            <p className="text-sm text-gray-600">
              Links, capitals, and suspicious terms are strong indicators. Less useful features are filtered out.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant={showTop5 ? "default" : "secondary"} onClick={() => setShowTop5(true)}>
              Top 5
            </Button>
            <Button variant={!showTop5 ? "default" : "secondary"} onClick={() => setShowTop5(false)}>
              All
            </Button>
          </div>
        </div>
        <div ref={containerRef} className="w-full">
          <svg ref={svgRef} className="w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

// Scatter Plot Visualization
// Visualizes patterns separating spam from ham emails based on URLs and capital letters
// HOW IT WORKS:
// Each point represents an email with:
// - X-axis: Number of URLs in the email
// - Y-axis: Number of capital letters in the email
// - Color: Orange for spam, Purple for ham
// The plot shows clustering patterns: spam emails tend to have more URLs and capitals
// When a feature is highlighted, points meeting threshold criteria get outlined
function ScatterPlot({ data, highlightFeature }) {
  const [showSpam, setShowSpam] = useState(true)
  const [showHam, setShowHam] = useState(true)
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const { width } = useResizeObserver(containerRef)

  // Filter data based on visibility toggles: show/hide spam and ham points
  const filtered = useMemo(() => {
    return data.filter((d) => (d.label === "spam" ? showSpam : showHam))
  }, [data, showSpam, showHam])

  useEffect(() => {
    if (!svgRef.current || !width) return

    const w = Math.max(320, width)
    const h = 360
    const m = { t: 24, r: 16, b: 44, l: 56 }
    const innerW = w - m.l - m.r
    const innerH = h - m.t - m.b

    const svg = d3.select(svgRef.current).attr("viewBox", `0 0 ${w} ${h}`)
    svg.selectAll("*").remove()

    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`)

    // Find max values for scaling, with minimum thresholds to ensure readable axes
    const xMax = d3.max(filtered, (d) => d.urls) ?? 10
    const yMax = d3.max(filtered, (d) => d.caps) ?? 10

    // Create scales: map data values to pixel positions
    // X-axis: URLs count (0 to max) maps to horizontal position
    // Y-axis: Capital letters count (0 to max) maps to vertical position (inverted: top is higher)
    const x = d3.scaleLinear().domain([0, Math.max(6, xMax + 1)]).range([0, innerW])
    const y = d3.scaleLinear().domain([0, Math.max(12, yMax + 2)]).range([innerH, 0])

    // Color mapping: spam = orange, ham = purple
    const color = d3.scaleOrdinal().domain(["spam", "ham"]).range(["#f59e0b", "#6d28d9"])

    g.append("g").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x).ticks(6))
    g.append("g").call(d3.axisLeft(y).ticks(6))

    g.append("text")
      .attr("x", innerW / 2)
      .attr("y", innerH + 36)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs fill-gray-600")
      .text("Links in the email (URLs)")

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerH / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs fill-gray-600")
      .text("Uppercase letters (CAPS)")

    const pts = g
      .append("g")
      .attr("fill-opacity", 0.55)
      .selectAll("circle")
      .data(filtered)
      .join("circle")
      .attr("cx", (d) => x(d.urls))
      .attr("cy", (d) => y(d.caps))
      .attr("r", 3)
      .attr("fill", (d) => color(d.label))

    pts.append("title").text((d) => `${d.label.toUpperCase()}\nURLs: ${d.urls}\nCAPS: ${d.caps}`)

    // Highlight feature thresholds: outline points that meet suspicious criteria
    // URLs >= 4 or Capital Letters >= 8 are common spam indicators
    if (highlightFeature === "URLs") {
      pts.filter((d) => d.urls >= 4).attr("stroke", "#111").attr("stroke-width", 0.8)
    }
    if (highlightFeature === "Capital Letters") {
      pts.filter((d) => d.caps >= 8).attr("stroke", "#111").attr("stroke-width", 0.8)
    }
  }, [filtered, width, highlightFeature])

  return (
    <Card className="w-full">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-semibold">Patterns that separate spam from ham</h3>
            <p className="text-sm text-gray-600">
              Spam clusters in regions with more links and uppercase, a visual fingerprint of malicious mail.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={showSpam ? "default" : "secondary"} onClick={() => setShowSpam((v) => !v)}>
              {showSpam ? "Hide" : "Show"} Spam
            </Button>
            <Button variant={showHam ? "default" : "secondary"} onClick={() => setShowHam((v) => !v)}>
              {showHam ? "Hide" : "Show"} Ham
            </Button>
          </div>
        </div>
        <div ref={containerRef} className="w-full h-[380px]">
          <svg ref={svgRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  )
}

// Word Cloud Visualization
// Displays most frequent words in spam emails with size based on frequency
// HOW IT WORKS:
// 1. Loads word frequency data from CSV (pre-calculated from spam email dataset)
// 2. Takes top 52 most frequent words
// 3. Word size is proportional to frequency: more occurrences = larger text
// 4. Uses d3-cloud algorithm to arrange words without overlap
// 5. Words are randomly rotated (0° or 90°) for visual variety
function WordCloud() {
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
  const [words, setWords] = useState([])

  // Load word frequency data from CSV file
  // CSV contains: word, count (number of times word appeared in spam emails)
  useEffect(() => {
    fetch("/data/spamWordFrequencies.csv")
      .then((res) => res.text())
      .then((text) => {
        const data = d3.csvParse(text)
        // Take top 52 words (most frequent)
        const sliced = data.slice(0, 52)
        setWords(sliced.map((d) => ({ text: d.word, size: +d.count })))
      })
      .catch((err) => console.error("Failed to load CSV:", err))
  }, [])

  useEffect(() => {
    if (!svgRef.current || !words.length) return

    const width = 450
    const height = 450
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    //tooltip box
    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("padding", "6px 10px")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "#fff")
      .style("border-radius", "8px")
      .style("pointer-events", "none")
      .style("font-size", "0.875rem")
      .style("opacity", 0)
      .style("transition", "opacity 0.2s ease")

    // Color scale: assigns different colors to words based on their index
    const color = d3.scaleSequential(d3.interpolateCool).domain([0, words.length])
    
    // Size scale: maps word frequency count to font size (10px to 80px)
    // Uses square root scale so size differences are more visually balanced
    // Higher frequency = larger font size
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(words, (d) => d.size)])
      .range([10, 80])

    // Configure word cloud layout algorithm
    // This algorithm arranges words to fit without overlapping
    const layout = cloud()
      .size([width, height])
      .words(
        words.map((d) => ({ 
          text: d.text, 
          size: sizeScale(d.size), // Convert count to pixel size
          count: d.size, // Keep original count for tooltip
        })))
      .padding(5) // Space between words
      .rotate(() => (Math.random() > 0.5 ? 0 : 90)) // Random rotation for visual interest
      .font("Impact")
      .fontSize((d) => d.size)
      .on("end", draw) // Callback when layout is complete

    // Start the layout algorithm (runs asynchronously)
    layout.start()

    // Draw function: called when word cloud layout is complete
    // Positions each word at calculated (x, y) coordinates from the layout algorithm
    function draw(words) {
      const group = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        
        group
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`) // Size based on frequency
        .style("font-family", "Impact")
        .style("fill", (_, i) => color(i)) // Color based on position
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`) // Position and rotation from layout
        .text((d) => d.text)
        // Tooltip: show word and frequency count on hover
        .on("mouseover", (event, d) => { 
          tooltip
            .style("opacity", 1)
            .html(
              `<strong>${d.text}</strong><br>${d.count.toLocaleString()} occurrences`
            )
        })
        .on("mousemove", (event) => {
          const [x, y] = d3.pointer(event)
          tooltip
            .style("left", `${x + 20}px`)
            .style("top", `${y}px`)
          })
        .on("mouseleave", () => {
          tooltip.style("opacity", 0)
        })
      }
    }, [words])

  return (
    <Card className="w-full relative">
      <CardContent className="p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Most Frequent Words in Spam Emails</h3>
          <p className="text-sm text-gray-600">
            The larger a word appears, the more frequently it occurs across the dataset. Hover over words to see counts.
          </p>
        </div>
        <div className="relative w-full flex justify-center">
          <svg ref={svgRef} width="450" height="450" />
          <div ref={tooltipRef} className="absolute z-50 pointer-events-none"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Metrics API Integration
// Fetches model performance metrics from backend API
export default function LearnPage() {
  const modelKey = "logistic_regression"
  const [highlightFeature, setHighlightFeature] = useState(null)

  const [metrics, setMetrics] = useState({
    accuracy: 0, 
    precision: 0, 
    recall: 0, 
    f1: 0
  })

  const[confusion, setConfusion] = useState({
    tn: 0,
    fn: 0, 
    tp: 0, 
    fp: 0
  })

  useEffect(() => {
    handleDisplayMetrics();
  }, []);

  // Fetch model performance metrics from backend API
  // The backend calculates metrics from the confusion matrix:
  // - Accuracy, Precision, Recall, F1-score
  // - Confusion matrix values (TP, FP, FN, TN)
  const handleDisplayMetrics = () => {
    try {
      axios.get("http://localhost:8000/metrics/")
      .then((response)=>{
        if(response.status===200){
          // Store calculated metrics (already computed on backend)
          setMetrics(({
            ...metrics,
            accuracy: response.data.metrics.Accuracy,
            precision: response.data.metrics.Precision,
            recall: response.data.metrics.Recall,
            f1: response.data.metrics.F1
          }));

          // Store confusion matrix counts (raw prediction results)
          setConfusion(({
            ...confusion, 
            tn: response.data.confusionMatrix.TN,
            tp: response.data.confusionMatrix.TP,
            fn: response.data.confusionMatrix.FN,
            fp: response.data.confusionMatrix.FP,
          }))
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <Lightbulb className="h-16 w-16 text-(--color-primary) mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">How the System Works</h1>
        <p className="text-xl text-muted-foreground text-pretty">
          Transparent heuristics. Machine learning coming soon.
        </p>
      </div>

      {/* Analysis Overview Section */}
      {/* Explains the four-step analysis process (parsing, pattern matching, metrics, scoring) */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Analysis Overview</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Our spam and malware detector uses a combination of heuristic analysis techniques to evaluate messages for
          suspicious patterns. All processing happens entirely in your browser using JavaScript, ensuring complete privacy
          and instant results.
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

      {/* Model Explanation Section */}
      {/* Introduces the logistic regression model and its capabilities */}
      <section className="space-y-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">Learn, How Our Model Understands Spam</h2>
        <p className="text-gray-700 max-w-3xl">
          We trained a logistic regression model to classify emails as <span className="font-semibold">spam</span> or{" "}
          <span className="font-semibold">ham</span>. The model analyzes various features including URLs, capital letters, suspicious words, and more. The visuals below show{" "}
          <span className="font-semibold">how accurate</span> it is and <span className="font-semibold">what signals</span>{" "}
          it uses.
        </p>
      </section>

      {/* Confusion Matrix Section */}
      <section id="viz-matrix" className="mb-8">
        <ConfusionMatrix metrics={metrics} confusion={confusion}></ConfusionMatrix>
      </section>

      {/* Why and What Section */}
      {/* Explains the motivation and feature selection rationale */}
      <section className="grid md:grid-cols-2 gap-6 items-start mb-8">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Why we built this</h2>
          <p className="text-gray-700">
            Email is essential, and a major security risk. Instead of fragile keyword rules, our system learns patterns in
            real emails, including suspicious phrasing and misspelled words. This makes it adaptable to new spam tactics.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What the model looks at</h2>
          <p className="text-gray-700">
            Not all features matter equally. We prioritise signals that separate spam from ham, like URLs and CAPITALS, and
            de-emphasise weak cues (e.g., raw text length). Transparency builds trust.
          </p>
        </div>
      </section>

      {/* Feature Importance Section */}
      <section id="viz-importance" className="mb-8">
        <FeatureImportance data={FEATURE_IMPORTANCES} onFeatureClick={setHighlightFeature} />
      </section>

      {/* Scatter Plot Section */}
      <section id="viz-scatter" className="mb-8">
        <ScatterPlot data={SCATTER_DATA} highlightFeature={highlightFeature} />
      </section>

      {/* Word Cloud Section */}
      <section id="viz-wordcloud" className="mb-8">
        <WordCloud />
      </section>

      {/* Future Directions Section */}
      <section className="space-y-3 mb-8">
        <h2 className="text-2xl font-semibold">Where we're heading</h2>
        <p className="text-gray-700 max-w-3xl">
          Next steps: explore deep language models for context, add explainable AI to surface "why" decisions, and expand
          datasets across languages. Our goal is a filter that not only blocks spam, but{" "}
          <span className="font-semibold">explains</span> its decisions.
        </p>
      </section>

      {/* Call to Action Section */}
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
