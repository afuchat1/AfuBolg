import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Image as ImageIcon,
  Link as LinkIcon, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Heading3, Undo, Redo, Minus,
  Youtube, Save, Type, Hash,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onAutoSave?: () => void;
  wordCount?: number;
}

const ToolbarButton = ({
  onClick, active, children, title,
}: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 transition-colors ${active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className="w-px bg-muted mx-0.5 self-stretch" />;

const RichTextEditor = ({ content, onChange, onAutoSave, wordCount }: RichTextEditorProps) => {
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your article..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      if (onAutoSave) {
        autoSaveTimer.current = setTimeout(onAutoSave, 3000);
      }
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[400px] p-4 sm:p-6 outline-none text-foreground leading-relaxed",
      },
    },
  });

  useEffect(() => {
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, []);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter link URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const addQuoteAnchor = () => {
    const id = window.prompt("Enter a quote anchor ID (e.g. 'key-insight'):");
    if (!id) return;
    // Insert a blockquote with an id attribute. Writers can link to it with #key-insight
    const slug = id.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    editor.chain().focus().toggleBlockquote().run();
    // We inject the id into the HTML after
    const html = editor.getHTML();
    // Find the last blockquote without an id and add the id
    const updated = html.replace(
      /(<blockquote)(?!.*id=)((?:(?!<\/blockquote>).)*<\/blockquote>)$/s,
      `$1 id="${slug}"$2`
    );
    if (updated !== html) {
      editor.commands.setContent(updated);
      onChange(updated);
    }
  };

  const addYouTube = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (!url) return;
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    if (videoId) {
      editor.chain().focus().setImage({
        src: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        alt: `YouTube Video`,
        title: url,
      }).run();
    }
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  const s = 15;

  return (
    <div className="bg-secondary overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-muted/50 sticky top-0 z-10">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><UnderlineIcon size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough size={s} /></ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1"><Heading1 size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 size={s} /></ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List"><ListOrdered size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><Quote size={s} /></ToolbarButton>
        <ToolbarButton onClick={addQuoteAnchor} title="Insert Linkable Quote (adds anchor ID)"><Hash size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block"><Code size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={s} /></ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left"><AlignLeft size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center"><AlignCenter size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right"><AlignRight size={s} /></ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton onClick={addImage} title="Insert Image"><ImageIcon size={s} /></ToolbarButton>
        <ToolbarButton onClick={addLink} title="Insert/Edit Link"><LinkIcon size={s} /></ToolbarButton>
        <ToolbarButton onClick={addYouTube} title="Embed YouTube"><Youtube size={s} /></ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton onClick={clearFormatting} title="Clear Formatting"><Type size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={s} /></ToolbarButton>
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
          {wordCount !== undefined && <span>{wordCount} words</span>}
          {onAutoSave && <span className="flex items-center gap-1"><Save size={12} /> Auto-save</span>}
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
