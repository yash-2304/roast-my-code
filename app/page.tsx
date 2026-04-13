"use client";

import { useState, useEffect, useRef } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Prism from "prismjs";

interface RoastResult {
  roast: string;
  feedback: string | Record<string, string>;
  improvedCode: string;
  detected?: {
    language: string;
    tech: string;
  };
}

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<RoastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayedRoast, setDisplayedRoast] = useState("");
  const [flash, setFlash] = useState(false);
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    setLoading(true);
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      // 🛡️ Guard against invalid AI response
      if (
        !data ||
        typeof data.roast !== "string" ||
        !data.feedback ||
        typeof data.improvedCode !== "string"
      ) {
        throw new Error("Invalid AI response");
      }

      setResult(data);
    } catch (err: any) {
      setResult({
        roast: "Something broke while analyzing your code.",
        feedback: {
          Bugs: "Invalid or malformed AI response",
          Optimization: "",
          Readability: "",
        },
        improvedCode: "// No improved code generated",
        detected: {
          language: "Unknown",
          tech: "Unknown",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result?.roast) return;

    let i = 0;
    setDisplayedRoast("");

    const interval = setInterval(() => {
      if (i < result.roast.length) {
        setDisplayedRoast((prev) => prev + result.roast.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [result]);

  useEffect(() => {
    if (result?.improvedCode) {
      Prism.highlightAll();
    }
  }, [result]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <main className={`min-h-screen bg-black text-white p-8 relative overflow-hidden transition-all duration-300 ${flash ? "brightness-150" : ""}`}>
      {/* 🔥 Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-red-600 opacity-20 blur-3xl rounded-full animate-[pulse_6s_infinite]"></div>
        <div className="absolute bottom-[-120px] right-[-100px] w-[500px] h-[500px] bg-orange-500 opacity-20 blur-3xl rounded-full animate-[pulse_6s_infinite]"></div>
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-yellow-500 opacity-10 blur-2xl rounded-full animate-[pulse_6s_infinite]"></div>
        <div className="absolute inset-0 -z-10 animate-[pulse_4s_ease-in-out_infinite] opacity-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500"></div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text tracking-wide animate-pulse">
          Roast My Code
        </h1>

        <div className="mt-6 space-y-6">

          {/* Input */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/20 shadow-lg shadow-red-500/10 rounded-xl p-4 flex flex-col backdrop-blur hover:shadow-red-500/30 transition-all duration-300">
            <h2 className="text-lg text-red-400 mb-2">Input Code</h2>

            <textarea
              ref={textareaRef}
              className="w-full min-h-[200px] max-h-[70vh] p-4 bg-black border border-gray-700 rounded font-mono text-sm resize-none overflow-auto focus:outline-none"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onInput={() => {
                const el = textareaRef.current;
                if (!el) return;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.7) + "px";
              }}
            />

            <button
              onClick={handleSubmit}
              className="mt-4 bg-gradient-to-r from-red-600 to-orange-500 px-6 py-2 rounded hover:scale-105 hover:shadow-xl hover:shadow-red-500/40 active:scale-95 transition-all duration-200 self-start"
            >
              {loading ? "Roasting..." : "Roast My Code"}
            </button>
          </div>

          {/* Output */}
          <div className="space-y-6">

            {loading ? (
              <>
                {/* Skeleton Roast */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/20 rounded-xl p-4 animate-pulse">
                  <div className="h-4 w-24 bg-red-500/30 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>

                {/* Skeleton Feedback */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/20 rounded-xl p-4 animate-pulse">
                  <div className="h-4 w-28 bg-green-500/30 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>

                {/* Skeleton Code */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/20 rounded-xl p-4 animate-pulse">
                  <div className="h-4 w-32 bg-blue-500/30 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-700 rounded w-4/6"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/6"></div>
                  </div>
                </div>
              </>
            ) : (
              result && (
                <>
                  {/* Roast */}
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/20 shadow-lg shadow-red-500/10 rounded-xl p-4 backdrop-blur hover:shadow-red-500/30 transition-all duration-300">
                    <h2 className="text-lg text-red-400 mb-2">Roast</h2>
                    <p className="text-sm">
                      {displayedRoast || result?.roast || ""}
                    </p>
                  </div>

                  {/* Detected */}
                  {result?.detected && (
                    <div className="text-xs text-gray-400">
                      Detected: {result.detected.language} ({result.detected.tech})
                    </div>
                  )}

                  {/* Feedback */}
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/20 shadow-lg shadow-red-500/10 rounded-xl p-4 backdrop-blur hover:shadow-red-500/30 transition-all duration-300">
                    <h2 className="text-lg text-green-400 mb-2">Feedback</h2>
                    {typeof result.feedback === "string" ? (
                      <p className="text-sm">{result.feedback}</p>
                    ) : (
                      <ul className="list-disc ml-6 text-sm space-y-1">
                        {Object.entries(result.feedback).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {value as string}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Improved Code */}
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/20 shadow-lg shadow-red-500/10 rounded-xl p-4 backdrop-blur hover:shadow-red-500/30 transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg text-blue-400">Improved Code</h2>
                      <button
                        onClick={() => copyToClipboard(result.improvedCode)}
                        className="text-xs bg-gray-800 px-3 py-1 rounded hover:bg-gray-700"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>

                    {result.improvedCode.startsWith("// AI suggestion rejected") && (
                      <div className="mb-3 flex items-center justify-between gap-2 text-xs bg-yellow-900/20 border border-yellow-500/30 px-3 py-2 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 text-yellow-300">
                          <span className="text-lg">⚠️</span>
                          <span>
                            {result.improvedCode
                              .split("\n")[0]
                              .replace("// ", "")
                              .replace("AI suggestion rejected", "AI suggestion rejected for safety")}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-1 bg-yellow-500/20 text-yellow-200 rounded">
                          Guarded AI Output
                        </span>
                      </div>
                    )}

                    <pre className="bg-black/80 p-4 rounded overflow-auto text-sm font-mono max-h-[400px] border border-red-500/10 shadow-inner shadow-red-500/10 hover:shadow-red-500/30 transition-all duration-300">
                      <code className="language-javascript">
                        {result.improvedCode && result.improvedCode !== code
                          ? result.improvedCode.replace(/^\/\/ AI suggestion.*\n\n/, "")
                          : "// No meaningful improvement generated"}
                      </code>
                    </pre>
                  </div>
                </>
              )
            )}

          </div>
        </div>
      </div>
    </main>
  );
}