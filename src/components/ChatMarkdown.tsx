import { useEffect, useRef, useState, forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import { Check, Copy, ChevronDown, ChevronRight } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  fontFamily: "inherit",
  securityLevel: "loose",
  flowchart: { useMaxWidth: true, htmlLabels: true, wrappingWidth: 200 },
});

let mermaidCounter = 0;

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1 rounded-md bg-background/80 border border-border text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
      title="Copy code"
    >
      {copied ? <Check size={12} className="text-status-done" /> : <Copy size={12} />}
    </button>
  );
};

const CollapsibleCode = ({ code, language }: { code: string; language: string }) => {
  const [collapsed, setCollapsed] = useState(code.split("\n").length > 20);
  const lines = code.split("\n");
  const displayCode = collapsed ? lines.slice(0, 15).join("\n") + "\n..." : code;

  return (
    <div className="group relative my-2">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted rounded-t-md border-b border-border/50">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="bg-muted p-3 rounded-b-md overflow-x-auto text-xs !mt-0 !rounded-t-none">
        <code>{displayCode}</code>
      </pre>
      {lines.length > 20 && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground mt-1 transition-colors"
        >
          {collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
          {collapsed ? `Show all ${lines.length} lines` : "Collapse"}
        </button>
      )}
    </div>
  );
};

const MermaidBlock = ({ code, isStreaming }: { code: string; isStreaming?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);
  const renderedCodeRef = useRef("");

  useEffect(() => {
    if (isStreaming) return;
    const trimmed = code.trim();
    if (trimmed.length < 10 || trimmed === renderedCodeRef.current) return;

    renderedCodeRef.current = trimmed;
    const id = `mermaid-render-${++mermaidCounter}-${Date.now()}`;

    mermaid
      .render(id, trimmed)
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg);
        setError(false);
      })
      .catch(() => {
        setSvg("");
        setError(true);
      });
  }, [code, isStreaming]);

  if (isStreaming || (!svg && !error)) {
    return (
      <div className="group relative my-2">
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted rounded-t-md border-b border-border/50">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">mermaid</span>
        </div>
        <pre className="bg-muted p-3 rounded-b-md overflow-x-auto text-xs !mt-0 !rounded-t-none">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  if (error) {
    return (
      <div className="group relative my-2">
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted rounded-t-md border-b border-border/50">
          <span className="text-[10px] font-medium text-destructive uppercase tracking-wider">diagram error</span>
          <CopyButton text={code} />
        </div>
        <pre className="bg-muted p-3 rounded-b-md overflow-x-auto text-xs text-muted-foreground !mt-0 !rounded-t-none">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="my-3 rounded-lg border border-border bg-muted/30 p-4 overflow-x-auto">
      <div
        ref={containerRef}
        className="flex justify-center [&_svg]:w-full [&_svg]:max-w-none [&_svg]:min-h-[180px]"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
};

const createCodeBlock = (isStreaming?: boolean) =>
  forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { className?: string; children?: React.ReactNode }>(
    ({ className, children, ...props }, ref) => {
      const match = /language-(\w+)/.exec(className || "");
      const codeStr = String(children).replace(/\n$/, "");

      if (match?.[1] === "mermaid") {
        return <MermaidBlock code={codeStr} isStreaming={isStreaming} />;
      }

      // Block code with language
      if (match) {
        return <CollapsibleCode code={codeStr} language={match[1]} />;
      }

      // Block code without language (inside <pre>)
      if (className) {
        return (
          <div className="group relative">
            <CopyButton text={codeStr} />
            <code ref={ref} className={className} {...props}>
              {children}
            </code>
          </div>
        );
      }

      // Inline code
      return (
        <code ref={ref} className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono" {...props}>
          {children}
        </code>
      );
    }
  );

const StreamingCodeBlock = createCodeBlock(true);
StreamingCodeBlock.displayName = "StreamingCodeBlock";

const StaticCodeBlock = createCodeBlock(false);
StaticCodeBlock.displayName = "StaticCodeBlock";

const ChatMarkdown = ({ content, isStreaming }: { content: string; isStreaming?: boolean }) => {
  return (
    <div className="max-w-none text-foreground text-[13px] leading-relaxed [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_table]:my-2 [&_table]:rounded-md [&_table]:overflow-hidden [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-medium [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5 [&_code]:text-xs [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:my-2 [&_blockquote]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-sm [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-1.5 [&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-[13px] [&_h3]:font-medium [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:my-1.5 [&_hr]:border-border [&_hr]:my-3 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_img]:rounded-md [&_img]:my-2">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: (isStreaming ? StreamingCodeBlock : StaticCodeBlock) as any,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMarkdown;
