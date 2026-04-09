import { CodeWindow } from "./codeWindow";

export function HeroVisual() {
  return (
    <div className="relative flex justify-center items-center isolate w-full max-w-[646px] h-[400px] md:h-[600px] mx-auto bg-transparent">
      {/* Decorative Elements */}
      <div
        className="absolute w-32 h-32 right-10 top-10 bg-[#FACC15] mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-30 blur-md rounded-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Persian Pink */}
      <div
        className="absolute w-32 h-32 left-20 -bottom-8 bg-[#F472B6] mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-30 blur-md rounded-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Malibu */}
      <div
        className="absolute w-32 h-32 left-4 md:left-8 top-6 bg-[#60A5FA] mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-30 blur-md rounded-full pointer-events-none"
        style={{ zIndex: 3 }}
      />

      <CodeWindow filename="main.py" className="mx-4 sm:mx-0">
        {/* Code Area */}
        {/* # Welcome to Codaptive! */}
        <div className="w-full flex items-center">
          <span className="text-[#5C6370] italic font-mono text-xs sm:text-base">
            # Welcome to Codaptive!
          </span>
        </div>

        <div className="w-full flex items-center pt-2">
          <pre className="font-mono text-xs sm:text-base leading-6 sm:leading-7 m-0 bg-transparent p-0 overflow-visible text-[#ABB2BF] font-medium">
            <span className="text-[#C678DD]">def</span>{" "}
            <span className="text-[#61AFEF]">greet_learner</span>(name):{"\n"}
            {"    "}message = <span className="text-[#C678DD]">f</span>
            <span className="text-[#98C379]">"Hello, &#123;name&#125;!"</span>
            {"\n"}
            {"    "}
            <span className="text-[#C678DD]">return</span> message
          </pre>
        </div>

        <div className="w-full flex items-center pt-2">
          <pre className="font-mono text-xs sm:text-base leading-6 sm:leading-7 m-0 bg-transparent p-0 overflow-visible text-[#ABB2BF] font-medium">
            <span className="text-[#C678DD]">if</span>{" "}
            <span className="text-[#E5C07B]">__name__</span>{" "}
            <span className="text-[#56B6C2]">==</span>{" "}
            <span className="text-[#98C379]">"__main__"</span>:{"\n"}
            {"    "}user ={" "}
            <span className="text-[#98C379]">"Future Developer"</span>
            {"\n"}
            {"    "}
            <span className="text-[#56B6C2]">print</span>(greet_learner(user))
          </pre>
        </div>

        <div className="w-full border-t border-[#262626] pt-5 mt-4">
          <span className="text-[#D4D4D4] font-mono text-xs sm:text-base">
            Hello, Future Developer!
          </span>
        </div>
      </CodeWindow>
    </div>
  );
}
