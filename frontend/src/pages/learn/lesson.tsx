"use client";

import { Link, useParams } from "@tanstack/react-router";
import { Button } from "@/src/components/ui/button";
import { CodeWindow } from "@/src/components/ui/codeWindow";
import { X, Heart } from "lucide-react";

export default function Lesson() {
  const params = useParams({ strict: false });
  const levelId = params.levelId as string | undefined;
  const lessonId = params.lessonId as string | undefined;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link
          to="/learn/$levelId"
          params={{ levelId: levelId ?? "" }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </Link>

        <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full w-[15%]" />
        </div>

        <div className="flex items-center gap-1.5 text-red-500 font-bold">
          <Heart fill="currentColor" className="w-6 h-6" />
          <span>5</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12 pb-32">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Variable
        </h1>

        <CodeWindow filename="main.py" className="mb-8">
          <div className="w-full flex items-center pt-2">
            <pre className="font-mono text-xs sm:text-base leading-6 sm:leading-7 m-0 bg-transparent p-0 overflow-visible text-[#ABB2BF] font-medium">
              <span className="text-[#C678DD]">x</span> ={" "}
              <span className="text-[#D19A66]">10</span>
              {"\n"}
              <span className="text-[#C678DD]">y</span> ={" "}
              <span className="text-[#D19A66]">5</span>
              {"\n"}
              print(x * y)
            </pre>
          </div>
          <div className="w-full border-t border-[#262626] pt-5 mt-4">
            <span className="text-[#D4D4D4] font-mono text-xs sm:text-base">
              50
            </span>
          </div>
        </CodeWindow>

        <div className="prose prose-gray max-w-none text-base text-gray-800 space-y-4 font-medium leading-relaxed">
          <p>
            Variable di Python sama halnya seperti kamu menyimpan sebuah buku di
            dalam kotak di rak kamarmu. Bayangkan setiap rak ini merupkan memori
            dan setiap memori menyimpan nilainya sendiri-sendiri
          </p>
          <p>
            Sebagai contoh:
            <br />
            <code>x = 10 -&gt; x </code>adalah rak kotak
            <br />
            <code>10 -&gt; 10 </code>adalah buku yang disimpan
            <br />
            Jadi, program 1 akan menyimpam angka 12 pada memori{" "}
            <code className="text-gray-900 bg-gray-100 px-1 py-0.5 rounded">
              a
            </code>
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white z-40">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="hidden sm:block">
            <span className="text-xs font-black text-gray-400 tracking-widest uppercase">
              SO YOU GET IT?
            </span>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              variant="ghost"
              className="hidden sm:flex text-gray-400 hover:text-gray-600 font-bold px-6"
              asChild
            >
              <Link to="/learn/$levelId" params={{ levelId: levelId ?? "" }}>
                TUTUP
              </Link>
            </Button>
            <Button
              className="flex-1 sm:flex-none rounded-xl px-12 py-6 text-lg font-black bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              asChild
            >
              <Link
                to="/learn/$levelId/questions/$lessonId"
                params={{ levelId: levelId ?? "", lessonId: lessonId ?? "" }}
              >
                CONTINUE
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
