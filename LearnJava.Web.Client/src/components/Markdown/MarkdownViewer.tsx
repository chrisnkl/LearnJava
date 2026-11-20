interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content) return null;

  // Split into lines to parse basic markdown structures
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = "";

  const renderFormattedText = (text: string) => {
    // Basic formatting for **bold** and `code`
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold text-sky-300">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={idx}
            className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-sky-400 border border-slate-700/60"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        const codeText = codeBuffer.join("\n");
        elements.push(
          <div key={`code-${i}`} className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 shadow-md">
            {codeLanguage && (
              <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-1.5 text-xs font-mono text-slate-400">
                <span>{codeLanguage}</span>
              </div>
            )}
            <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLanguage = line.trim().replace(/^```/, "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headers
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="mt-6 mb-3 text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-2">
          {renderFormattedText(line.substring(2))}
        </h1>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="mt-5 mb-2.5 text-xl font-bold text-slate-100">
          {renderFormattedText(line.substring(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="mt-4 mb-2 text-base font-semibold text-sky-400">
          {renderFormattedText(line.substring(4))}
        </h3>
      );
      continue;
    }

    // List items
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      elements.push(
        <li key={`li-${i}`} className="ml-5 list-disc text-sm text-slate-300 leading-relaxed mb-1">
          {renderFormattedText(line.trim().substring(2))}
        </li>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === "") {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-slate-300 mb-2">
        {renderFormattedText(line)}
      </p>
    );
  }

  return <div className="prose prose-invert max-w-none">{elements}</div>;
}

