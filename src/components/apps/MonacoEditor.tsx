import { useRef } from "react";
import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  onClose: () => void;
  initialCode?: string;
}

export default function MonacoEditor({
  initialCode = "// Start coding here...",
  onClose
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      <div className="bg-gray-800 h-10 flex items-center justify-between px-4">
        <span className="text-white font-medium">Code Editor</span>
        <button
          onClick={onClose}
          className="text-white hover:bg-gray-700 p-1 rounded"
        >
          ✕
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          defaultValue={initialCode}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
