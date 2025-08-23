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
  const dark = false;

  const fetchMarkdown = useCallback(
    (id: string, url: string) => {
      if (!storeMd[id] && !loading[id]) {
        setLoading(prev => ({ ...prev, [id]: true }));

        const isUrl = url.startsWith('http');
        const fetchUrl = isUrl ? url : `/markdown/${url.split('/').pop()}`;

        fetch(fetchUrl)
          .then((response) => {
            if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
            return response.text();
          })
          .then((text) => {
            const processedText = isUrl ? fixImageURL(text, url) : text;
            setStoreMd(prev => ({ ...prev, [id]: processedText }));
            setError(prev => ({ ...prev, [id]: null }));
          })
          .catch((err) => {
            console.error('Error loading markdown:', err);
            setError(prev => ({ ...prev, [id]: `Failed to load content: ${err.message}` }));
          })
          .finally(() => {
            setLoading(prev => ({ ...prev, [id]: false }));
          });
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
    <div className="markdown w-3/4 mx-auto px-2 py-6 text-c-700">
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

const SahilProfile = () => {
  const profileSection = sahil.find(section => section.id === 'profile');

  if (!profileSection) {
    return <div>Profile section not found</div>;
  }

  const currentItem = profileSection.md[0];

  return (
    <div className="sahil font-avenir h-full">
      //content section
      <div className="h-full overflow-auto bg-white dark:bg-gray-900">
        {currentItem && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {currentItem.title}
            </h1>
            <Content contentID={currentItem.id} contentURL={currentItem.file} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SahilProfile;
