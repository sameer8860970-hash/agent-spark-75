import { useEffect, useRef, useState, memo, forwardRef, useCallback } from "react";
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

const MermaidBlock = ({ code, isStreaming }: { code: string; isStreaming?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);
  const renderedCodeRef = useRef("");

  useEffect(() => {
    // Don't render while streaming — wait until done
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

  // While streaming, just show raw code
  if (isStreaming || (!svg && !error)) {
    return (
      <pre className="my-2 p-2.5 bg-muted rounded-md text-xs overflow-x-auto">
        <code>{code}</code>
      </pre>
    );
  }

  if (error) {
    return (
      <pre className="my-2 p-2.5 bg-muted rounded-md text-xs text-muted-foreground overflow-x-auto">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-3 flex justify-center [&_svg]:max-w-full overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// Wrap code component with forwardRef to avoid React warning
const createCodeBlock = (isStreaming?: boolean) =>
  forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { className?: string; children?: React.ReactNode }>(
    ({ className, children, ...props }, ref) => {
      const match = /language-(\w+)/.exec(className || "");
      const codeStr = String(children).replace(/\n$/, "");

      if (match?.[1] === "mermaid") {
        return <MermaidBlock code={codeStr} isStreaming={isStreaming} />;
      }

      if (className) {
        return (
          <code ref={ref} className={className} {...props}>
            {children}
          </code>
        );
      }

      return (
        <code ref={ref} className="text-xs bg-muted px-1 py-0.5 rounded" {...props}>
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
    <div className="max-w-none text-foreground text-[13px] leading-relaxed [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:font-medium [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_code]:text-xs [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-muted [&_pre]:p-2.5 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_blockquote]:border-l-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_h1]:text-sm [&_h1]:font-semibold [&_h1]:mt-3 [&_h1]:mb-1 [&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-[13px] [&_h3]:font-medium [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:my-1 [&_hr]:border-border [&_a]:text-primary [&_a]:underline">
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
