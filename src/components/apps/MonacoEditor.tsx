import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  initialCode?: string;
}

export default function MonacoEditor({
  initialCode = "// Start coding here...\n// Welcome to the code editor!",
}: MonacoEditorProps) {
  const handleEditorDidMount = (editor: any) => {
    // Focus the editor when mounted
    editor.focus();
  };

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        value={initialCode}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          lineNumbers: 'on',
          tabSize: 2,
        }}
      />
    </div>
  );
}
