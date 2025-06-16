import React, { useState ,useEffect} from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import { getOutline } from './geminiService.js';

// LockedHeading extension to make headings non-editable
const LockedHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      contentEditable: {
        default: false,
        renderHTML: () => ({
          contenteditable: 'false',
        }),
      },
    };
  },
});

function App() {
  const [input, setInput] = useState('');
  const [editorContent, setEditorContent] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      LockedHeading,
    ],
    content: editorContent,
    editable: true,
  });
  useEffect(() => {
    if (editor && editorContent) {
      editor.commands.setContent(editorContent);
    }
  }, [editorContent, editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Use input as heading, get outline from AI
    const outlineText = await getOutline(input);
    // Parse outlineText for blocks (you may need to parse markdown to JSON here)
    // For demo, just add as a paragraph under heading
    setEditorContent({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: input }], // locked heading
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: outlineText }],
        },
      ],
    });
    setInput('');
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h1>AI-Assisted Document Outline Editor</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Document title..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ padding: 10, borderRadius: 8, background: '#1976d2', color: 'white', border: 'none' }}
        >
          Generate Outline
        </button>
      </form>
      <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default App;

