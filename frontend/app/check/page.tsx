"use client"

import React, {useState} from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Loader2 } from "lucide-react"
import { analyseText} from "@/lib/analyzer"
import { useAnalysis } from "@/lib/analysis-context"

export default function CheckPage() {
  const router = useRouter()
  const {setResult} = useAnalysis()
  const {result} = useAnalysis()
  const [activeTab, setActiveTab] = useState("paste")
  const [bodyInput, setBodyInput] = useState("")
  const [subjectInput, setSubjectInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")

  const hasInput = (bodyInput.trim().length > 0 && subjectInput.trim().length > 0)|| file !== null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = [".eml", ".msg", ".txt", "text/plain", "message/rfc822"]
      const isValid = validTypes.some((type) => selectedFile.name.endsWith(type) || selectedFile.type === type)

      if (!isValid) {
        setError("Please upload a .eml, .msg, or .txt file")
        setFile(null)
        return
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size must be less than 5MB")
        setFile(null)
        return
      }

      setError("")
      setFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const input = document.createElement("input")
      input.type = "file"
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(droppedFile)
      input.files = dataTransfer.files
      handleFileChange({ target: input } as any)
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setProgress(0)
    setError("")

    let subjectToAnalyse = ""
    let bodyToAnalyse = ""

    if(activeTab == "paste"){
      subjectToAnalyse = subjectInput
      bodyToAnalyse = bodyInput
    }
    else if (activeTab == "upload") {
      subjectToAnalyse = ""
      bodyToAnalyse = ""
      //^ set to empty strings - but should be replaced with actual code to read in file 
    }
    else {
      //error - wrong active tab
      setIsAnalyzing(false)
      setProgress(0)
      setError("User is on incorrect tab to submit input.")
      return
    }

    //double check that something has actually been inputted
    if(subjectToAnalyse.trim() == "" || bodyToAnalyse.trim() == ""){
      setIsAnalyzing(false)
      setProgress(0)
      setError("Please provide text for both the subject and body of the email.")
      return
    }
    
    //start a timeout so that the page can load whilst awaiting results
    await new Promise((resolve) => setTimeout(resolve, 1500))

    //Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 150)
    
    try {
      //retrieve prediction from API endpoint - output is of form PredictionOutput (defined in main.py)
      const prediction = await axios({
          method: "post", 
          url: "http://localhost:8000/predict/", 
          data: {
            subject: subjectToAnalyse, 
            body: bodyToAnalyse
          }
      })

      clearInterval(progressInterval)
      setProgress(100)

      const result = analyseText(prediction.data)

      // Store result and navigate
      setResult(result)

      //used for testing
      //console.log(result.body)
    }
    catch (err){
      setError(err instanceof Error ? err.message : "Analysis failed")
      setIsAnalyzing(false)
      setProgress(0)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 300))
    router.push("/results")
  }


  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Check Your Message</h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Upload a file or paste your email content to analyze for spam and malware indicators
        </p>
      </div>

      <Card className="p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-(--color-primary) transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
              <p className="text-lg font-medium mb-2">Drop your file here or click to browse</p>
              <p className="text-sm text-muted-foreground">Accepts .eml, .msg, and .txt files (max 5MB)</p>
              <input
                id="file-input"
                type="file"
                accept=".eml,.msg,.txt,text/plain,message/rfc822"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload file"
              />
            </div>

            {file && (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <FileText className="h-5 w-5 text-(--color-primary)" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div>
              <label htmlFor="text-input" className="sr-only">
                Paste your email or message content
              </label>
              <div id="text-input">
                <textarea
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Paste subject line here..."
                  className="w-full min-h-[50px] p-4 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                />
                <textarea
                  value={bodyInput}
                  onChange={(e) => setBodyInput(e.target.value)}
                  placeholder="Paste the body of your email or message here..."
                  className="w-full min-h-[300px] p-4 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                  aria-describedby="text-input-help"
                />
                <p id="text-input-help" className="text-sm text-muted-foreground mt-2">
                  {bodyInput.length + subjectInput.length} characters • {bodyInput.split(/\s+/).filter(Boolean).length + subjectInput.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        <Button onClick={handleAnalyze} disabled={!hasInput || isAnalyzing} size="lg" className="w-full mt-6">
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Analyzing...
            </>
          ) : (
            "Analyze Message"
          )}
        </Button>
      </Card>

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="mt-8 p-8 text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-(--color-primary)" aria-hidden="true" />
          <h2 className="text-2xl font-bold mb-2">Analyzing your message…</h2>
          <p className="text-muted-foreground mb-6">This runs locally in your browser. No data leaves your device.</p>

          <div className="max-w-md mx-auto">
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className="bg-(--color-primary) h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-sm text-muted-foreground">{progress}% complete</p>
          </div>

          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            <p>✓ Parsing message structure</p>
            <p>✓ Analyzing text patterns</p>
            <p>✓ Detecting suspicious indicators</p>
            <p>✓ Calculating risk score</p>
          </div>
        </Card>
      )}
    </div>
  )
}





// "use client"

// import type React from "react"

// const axios = require('axios').default;

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Upload, FileText, Loader2 } from "lucide-react"
// import { analyseText } from "@/lib/analyzer"
// import { useAnalysis } from "@/lib/analysis-context"

// export default function CheckPage() {
//   const router = useRouter()
//   const { setResult } = useAnalysis()
//   const [activeTab, setActiveTab] = useState("paste")
//   const [bodyInput, setBodyInput] = useState("")
//   const [subjectInput, setSubjectInput] = useState("")
//   const [file, setFile] = useState<File | null>(null)
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [error, setError] = useState("")

//   const hasInput = (bodyInput.trim().length > 0 && subjectInput.trim().length > 0)|| file !== null

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0]
//     if (selectedFile) {
//       const validTypes = [".eml", ".msg", ".txt", "text/plain", "message/rfc822"]
//       const isValid = validTypes.some((type) => selectedFile.name.endsWith(type) || selectedFile.type === type)

//       if (!isValid) {
//         setError("Please upload a .eml, .msg, or .txt file")
//         setFile(null)
//         return
//       }

//       if (selectedFile.size > 5 * 1024 * 1024) {
//         // 5MB limit
//         setError("File size must be less than 5MB")
//         setFile(null)
//         return
//       }

//       setError("")
//       setFile(selectedFile)
//     }
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     const droppedFile = e.dataTransfer.files[0]
//     if (droppedFile) {
//       const input = document.createElement("input")
//       input.type = "file"
//       const dataTransfer = new DataTransfer()
//       dataTransfer.items.add(droppedFile)
//       input.files = dataTransfer.files
//       handleFileChange({ target: input } as any)
//     }
//   }

//   const handleAnalyze = async () => {
//     setIsAnalyzing(true)
//     setProgress(0)
//     setError("")

//     try {
//       let subjectToAnalyse = ""
//       let bodyToAnalyse = ""

//       if (activeTab === "paste") {
//         subjectToAnalyse = subjectInput
//         bodyToAnalyse = bodyInput
//       } 
//       // else if (file) {
//       //   // Read file content
//       //   const reader = new FileReader()
//       //   textToAnalyze = await new Promise<string>((resolve, reject) => {
//       //     reader.onload = (e) => resolve(e.target?.result as string)
//       //     reader.onerror = () => reject(new Error("Failed to read file"))
//       //     reader.readAsText(file)
//       //   })
//       // }

//       if (!(subjectToAnalyse.trim() && bodyToAnalyse.trim())) {
//         setError("Please provide text for subject and body of email to analyse.")
//         setIsAnalyzing(false)
//         return
//       }

//       // Simulate progress
//       const progressInterval = setInterval(() => {
//         setProgress((prev) => Math.min(prev + 10, 90))
//       }, 150)

//       // Perform analysis
//       await new Promise((resolve) => setTimeout(resolve, 1500))
//       //const result = analyzeText(textToAnalyze)

//       const prediction = axios({
//         method: "post", 
//         url: "http://localhost:8000/predict/", 
//         data: {
//           subject: subjectToAnalyse, 
//           body: bodyToAnalyse
//         }
//       })

//       clearInterval(progressInterval)
//       setProgress(100)

//       // Store result and navigate
//       setResult(prediction)
      
//       await new Promise((resolve) => setTimeout(resolve, 300))
//       router.push("/results")

//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Analysis failed")
//       setIsAnalyzing(false)
//       setProgress(0)
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-12 max-w-4xl">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl font-bold mb-4">Check Your Message</h1>
//         <p className="text-lg text-muted-foreground text-pretty">
//           Upload a file or paste your email content to analyze for spam and malware indicators
//         </p>
//       </div>

//       <Card className="p-8">
//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="grid w-full grid-cols-2 mb-6">
//             <TabsTrigger value="upload">Upload File</TabsTrigger>
//             <TabsTrigger value="paste">Paste Text</TabsTrigger>
//           </TabsList>

//           <TabsContent value="upload" className="space-y-4">
//             <div
//               onDrop={handleDrop}
//               onDragOver={(e) => e.preventDefault()}
//               className="border-2 border-dashed rounded-lg p-12 text-center hover:border-(--color-primary) transition-colors cursor-pointer"
//               onClick={() => document.getElementById("file-input")?.click()}
//             >
//               <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
//               <p className="text-lg font-medium mb-2">Drop your file here or click to browse</p>
//               <p className="text-sm text-muted-foreground">Accepts .eml, .msg, and .txt files (max 5MB)</p>
//               <input
//                 id="file-input"
//                 type="file"
//                 accept=".eml,.msg,.txt,text/plain,message/rfc822"
//                 onChange={handleFileChange}
//                 className="hidden"
//                 aria-label="Upload file"
//               />
//             </div>

//             {file && (
//               <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
//                 <FileText className="h-5 w-5 text-(--color-primary)" aria-hidden="true" />
//                 <div className="flex-1">
//                   <p className="font-medium text-sm">{file.name}</p>
//                   <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     setFile(null)
//                   }}
//                 >
//                   Remove
//                 </Button>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="paste" className="space-y-4">
//             <div>
//               <label htmlFor="text-input" className="sr-only">
//                 Paste your email or message content
//               </label>
//               <div id="text-input">
//                 <textarea
//                   value={subjectInput}
//                   onChange={(e) => setSubjectInput(e.target.value)}
//                   placeholder="Paste subject line here..."
//                   className="w-full min-h-[50px] p-4 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
//                 />
//                 <textarea
//                   value={bodyInput}
//                   onChange={(e) => setBodyInput(e.target.value)}
//                   placeholder="Paste the body of your email or message here..."
//                   className="w-full min-h-[300px] p-4 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
//                   aria-describedby="text-input-help"
//                 />
//                 <p id="text-input-help" className="text-sm text-muted-foreground mt-2">
//                   {bodyInput.length + subjectInput.length} characters • {bodyInput.split(/\s+/).filter(Boolean).length + subjectInput.split(/\s+/).filter(Boolean).length} words
//                 </p>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>

//         {error && (
//           <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800" role="alert">
//             {error}
//           </div>
//         )}

//         <Button onClick={handleAnalyze} disabled={!hasInput || isAnalyzing} size="lg" className="w-full mt-6">
//           {isAnalyzing ? (
//             <>
//               <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
//               Analyzing...
//             </>
//           ) : (
//             "Analyze Message"
//           )}
//         </Button>
//       </Card>

//       {/* Loading State */}
//       {isAnalyzing && (
//         <Card className="mt-8 p-8 text-center">
//           <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-(--color-primary)" aria-hidden="true" />
//           <h2 className="text-2xl font-bold mb-2">Analyzing your message…</h2>
//           <p className="text-muted-foreground mb-6">This runs locally in your browser. No data leaves your device.</p>

//           <div className="max-w-md mx-auto">
//             <div className="w-full bg-muted rounded-full h-2 mb-2">
//               <div
//                 className="bg-(--color-primary) h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//                 role="progressbar"
//                 aria-valuenow={progress}
//                 aria-valuemin={0}
//                 aria-valuemax={100}
//               />
//             </div>
//             <p className="text-sm text-muted-foreground">{progress}% complete</p>
//           </div>

//           <div className="mt-8 space-y-2 text-sm text-muted-foreground">
//             <p>✓ Parsing message structure</p>
//             <p>✓ Analyzing text patterns</p>
//             <p>✓ Detecting suspicious indicators</p>
//             <p>✓ Calculating risk score</p>
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }
