import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import Editor from '@monaco-editor/react';

export const CodeEditor = ({ code, setCode }) => {
  const [saveCodeButtonDisabled, setSaveCodeButtonDisabled] = useState(true);
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value, event) {
    setSaveCodeButtonDisabled(false);
  }

  // Function to handle save action
  const saveCode = () => {
    setCode(editorRef.current.getValue());
    setSaveCodeButtonDisabled(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl+S or Cmd+S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); // Prevent default save dialog
        saveCode(); // Call save function
      }
    };

    // Attach the event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <Editor
        height="50vh"

        defaultLanguage="python"
        defaultValue={code}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
        }}
      />
      <div style={{marginTop: '20px'}}>
        <Button disabled={saveCodeButtonDisabled} onClick={saveCode}>Save Code</Button>
      </div>
    </>
  );
};
