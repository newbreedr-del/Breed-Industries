'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: content || '<p>Start writing your blog post...</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const toolbarButton = (icon: React.ReactNode, action: () => void, isActive: boolean, title: string) => (
    <button
      type="button"
      onClick={action}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-accent text-color-bg-deep' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/10 bg-white/5">
        {/* Text Style */}
        <div className="flex items-center gap-1 pr-3 border-r border-white/10">
          {toolbarButton(
            <Heading1 className="w-4 h-4" />,
            () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            editor.isActive('heading', { level: 1 }),
            'Heading 1'
          )}
          {toolbarButton(
            <Heading2 className="w-4 h-4" />,
            () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            editor.isActive('heading', { level: 2 }),
            'Heading 2'
          )}
          {toolbarButton(
            <Heading3 className="w-4 h-4" />,
            () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            editor.isActive('heading', { level: 3 }),
            'Heading 3'
          )}
        </div>

        {/* Formatting */}
        <div className="flex items-center gap-1 px-3 border-r border-white/10">
          {toolbarButton(
            <Bold className="w-4 h-4" />,
            () => editor.chain().focus().toggleBold().run(),
            editor.isActive('bold'),
            'Bold'
          )}
          {toolbarButton(
            <Italic className="w-4 h-4" />,
            () => editor.chain().focus().toggleItalic().run(),
            editor.isActive('italic'),
            'Italic'
          )}
          {toolbarButton(
            <UnderlineIcon className="w-4 h-4" />,
            () => editor.chain().focus().toggleUnderline().run(),
            editor.isActive('underline'),
            'Underline'
          )}
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 px-3 border-r border-white/10">
          {toolbarButton(
            <List className="w-4 h-4" />,
            () => editor.chain().focus().toggleBulletList().run(),
            editor.isActive('bulletList'),
            'Bullet List'
          )}
          {toolbarButton(
            <ListOrdered className="w-4 h-4" />,
            () => editor.chain().focus().toggleOrderedList().run(),
            editor.isActive('orderedList'),
            'Numbered List'
          )}
        </div>

        {/* Special */}
        <div className="flex items-center gap-1 px-3 border-r border-white/10">
          {toolbarButton(
            <Quote className="w-4 h-4" />,
            () => editor.chain().focus().toggleBlockquote().run(),
            editor.isActive('blockquote'),
            'Quote'
          )}
          {toolbarButton(
            <Code className="w-4 h-4" />,
            () => editor.chain().focus().toggleCodeBlock().run(),
            editor.isActive('codeBlock'),
            'Code Block'
          )}
        </div>

        {/* History */}
        <div className="flex items-center gap-1 pl-3">
          {toolbarButton(
            <Undo className="w-4 h-4" />,
            () => editor.chain().focus().undo().run(),
            false,
            'Undo'
          )}
          {toolbarButton(
            <Redo className="w-4 h-4" />,
            () => editor.chain().focus().redo().run(),
            false,
            'Redo'
          )}
        </div>
      </div>

      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="prose prose-invert max-w-none p-4 min-h-[400px] focus:outline-none"
      />

      {/* Styles for Tiptap */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 400px;
        }
        .ProseMirror p {
          margin-bottom: 0.75em;
          line-height: 1.7;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          color: white;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25em;
          margin-bottom: 0.75em;
          color: white;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 0.5em;
          color: white;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 0.75em;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 0.75em;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #f59e0b;
          padding-left: 1em;
          font-style: italic;
          color: rgba(255,255,255,0.7);
          margin: 1em 0;
        }
        .ProseMirror pre {
          background: rgba(255,255,255,0.1);
          padding: 1em;
          border-radius: 0.5em;
          font-family: monospace;
          overflow-x: auto;
        }
        .ProseMirror code {
          background: rgba(255,255,255,0.1);
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
        }
        .ProseMirror strong {
          font-weight: 700;
          color: white;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror u {
          text-decoration: underline;
        }
        .ProseMirror p.is-empty::before {
          content: attr(data-placeholder);
          color: rgba(255,255,255,0.4);
          float: left;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
