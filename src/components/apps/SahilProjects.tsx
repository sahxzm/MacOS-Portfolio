import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import sahil from "~/configs/sahil";
import type { SahilMdData } from "~/types";

interface ContentProps {
  contentID: string;
  contentURL: string;
}

const Highlighter = (dark: boolean = false): any => {
  interface codeProps {
    node: any;
    inline: boolean;
    className: string;
    children: any;
  }

  return {
    code({ node, inline, className, children, ...props }: codeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    }
  };
};

const fixImageURL = (text: string, contentURL: string): string => {
  text = text.replace(/&nbsp;/g, "");
  if (contentURL.indexOf("raw.githubusercontent.com") !== -1) {
    const repoURL = contentURL.slice(0, -10) + "/";
    const imgReg = /!\[(.*?)\]\((.*?)\)/;
    const imgRegGlobal = /!\[(.*?)\]\((.*?)\)/g;
    const imgList = text.match(imgRegGlobal);

    if (imgList) {
      for (const img of imgList) {
        const imgURL = (img.match(imgReg) as Array<string>)[2];
        if (imgURL.indexOf("http") !== -1) continue;
        const newImgURL = repoURL + imgURL;
        text = text.replace(imgURL, newImgURL);
      }
    }
  }
  return text;
};

const Content = ({ contentID, contentURL }: ContentProps) => {
  const [storeMd, setStoreMd] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: string | null }>({});
  const dark = false; // You can connect this to your theme context if needed

  const fetchMarkdown = useCallback(
    async (id: string, url: string) => {
      if (!storeMd[id] && !loading[id]) {
        setLoading(prev => ({ ...prev, [id]: true }));

        try {
          const response = await fetch(`/markdown/${url.split('/').pop()}`);
          if (!response.ok) {
            throw new Error(`Failed to load: ${response.statusText}`);
          }
          const text = await response.text();
          setStoreMd(prev => ({ ...prev, [id]: fixImageURL(text, url) }));
          setError(prev => ({ ...prev, [id]: null }));
        } catch (err) {
          console.error('Error loading markdown:', err);
          setError(prev => ({ ...prev, [id]: `Failed to load content: ${err instanceof Error ? err.message : 'Unknown error'}` }));
        } finally {
          setLoading(prev => ({ ...prev, [id]: false }));
        }
      }
    },
    [storeMd, loading]
  );

  useEffect(() => {
    if (contentID && contentURL) {
      fetchMarkdown(contentID, contentURL);
    }
  }, [contentID, contentURL, fetchMarkdown]);

  if (error[contentID]) {
    return (
      <div className="p-4 text-red-500">
        {error[contentID]}
      </div>
    );
  }

  if (loading[contentID] || !storeMd[contentID]) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="sahil markdown w-full px-2 py-6 text-c-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
        ]}
        components={Highlighter(dark)}
      >
        {storeMd[contentID]}
      </ReactMarkdown>
    </div>
  );
};

const SahilProjects = () => {
  const projectsSection = sahil.find(section => section.id === 'project');
  const [selectedItem, setSelectedItem] = useState(0);

  if (!projectsSection) {
    return <div>Projects section not found</div>;
  }

  const currentItem = projectsSection.md[selectedItem];

  return (
    <div className="sahil-projects flex h-full">
      {/* Sidebar */}
      <div className="w-72 overflow-auto bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Projects</h2>
        </div>
        <ul>
          {projectsSection.md.map((item, index) => (
            <li
              key={`project-${item.id}`}
              className={`p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                selectedItem === index ? 'bg-blue-100 dark:bg-blue-900' : ''
              }`}
              onClick={() => setSelectedItem(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`${item.icon} mr-2`} />
                  <span className="font-medium">{item.title}</span>
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="i-octicon-link-external" />
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {item.excerpt}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
        {currentItem && (
          <div className="h-full">
            <Content contentID={currentItem.id} contentURL={currentItem.file} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SahilProjects;
