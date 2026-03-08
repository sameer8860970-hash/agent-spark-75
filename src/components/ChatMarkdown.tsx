import { useEffect, useRef, useState, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  fontFamily: "inherit",
  securityLevel: "loose",
});

let mermaidCounter = 0;

const MermaidBlock = memo(({ code }: { code: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const idRef = useRef(`mermaid-${++mermaidCounter}`);

  useEffect(() => {
    mermaid
      .render(idRef.current, code)
      .then(({ svg }) => setSvg(svg))
      .catch(() => setSvg(`<pre class="text-xs text-destructive">Invalid diagram</pre>`));
  }, [code]);

  return (
    <div
      ref={ref}
      className="my-3 flex justify-center [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
});
MermaidBlock.displayName = "MermaidBlock";

const ChatMarkdown = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-sm max-w-none text-foreground [&_p]:text-[13px] [&_p]:leading-relaxed [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_th]:border [&_th]:border-border [&_th]:bg-accent [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-medium [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5 [&_code]:text-xs [&_code]:bg-accent [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-accent [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:text-[13px] [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:text-[13px] [&_h3]:font-semibold [&_hr]:border-border">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeStr = String(children).replace(/\n$/, "");

            if (match?.[1] === "mermaid") {
              return <MermaidBlock code={codeStr} />;
            }

            // Block code
            if (className) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            // Inline code
            return (
              <code className="text-xs bg-accent px-1 py-0.5 rounded" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMarkdown;
