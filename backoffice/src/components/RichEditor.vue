<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Image,
    Placeholder.configure({ placeholder: 'Full case study content, technical details, challenges, solutions, results...' })
  ],
  editorProps: {
    attributes: { class: 'prose-editor' }
  },
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val)
  }
})

function setLink() {
  const url = window.prompt('URL', editor.value?.getAttributes('link').href ?? '')
  if (url === null) return
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function addImage() {
  const url = window.prompt('Image URL')
  if (url) editor.value?.chain().focus().setImage({ src: url }).run()
}
</script>

<template>
  <div class="rich-editor border border-surface-variant rounded-xl overflow-hidden bg-surface-container-low focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary transition-all">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-0.5 p-2 border-b border-surface-variant bg-surface-container">
      <!-- History -->
      <button type="button" title="Undo" class="toolbar-btn" @click="editor?.chain().focus().undo().run()">
        <span class="material-symbols-outlined">undo</span>
      </button>
      <button type="button" title="Redo" class="toolbar-btn" @click="editor?.chain().focus().redo().run()">
        <span class="material-symbols-outlined">redo</span>
      </button>

      <div class="w-px h-5 bg-surface-variant mx-1" />

      <!-- Headings -->
      <button
        v-for="level in [1, 2, 3]"
        :key="level"
        type="button"
        :title="`Heading ${level}`"
        class="toolbar-btn font-bold text-xs"
        :class="{ 'toolbar-btn-active': editor?.isActive('heading', { level }) }"
        @click="editor?.chain().focus().toggleHeading({ level: level as 1|2|3 }).run()"
      >H{{ level }}</button>

      <div class="w-px h-5 bg-surface-variant mx-1" />

      <!-- Inline -->
      <button type="button" title="Bold" class="toolbar-btn" :class="{ 'toolbar-btn-active': editor?.isActive('bold') }" @click="editor?.chain().focus().toggleBold().run()">
        <span class="material-symbols-outlined">format_bold</span>
      </button>
      <button type="button" title="Italic" class="toolbar-btn" :class="{ 'toolbar-btn-active': editor?.isActive('italic') }" @click="editor?.chain().focus().toggleItalic().run()">
        <span class="material-symbols-outlined">format_italic</span>
      </button>
      <button type="button" title="Strikethrough" class="toolbar-btn" :class="{ 'toolbar-btn-active': editor?.isActive('strike') }" @click="editor?.chain().focus().toggleStrike().run()">
        <span class="material-symbols-outlined">strikethrough_s</span>
      </button>
      <button type="button" title="Code" class="toolbar-btn" :class="{ 'toolbar-btn-active': editor?.isActive('code') }" @click="editor?.chain().focus().toggleCode().run()">
        <span class="material-symbols-outlined">code</span>
      </button>

      <div class="w-px h-5 bg-surface-variant mx-1" />

      <!-- Lists -->
      <button type="button" title="Bullet list" class="toolbar-btn" :class="{ 'toolbar-btn-active': editor?.isActive('bulletList') }" @click="editor?.chain().focus().toggleBulletList().run()">
        <span class="material-symbols-outlined">format_list_bulleted</span>
      </button>
      <button type="button" title="Ordered list" class="toolbar-btn" :class="{ 'toolbar-btn-active': editor?.isActive('orderedList') }" @click="editor?.chain().focus().toggleOrderedList().run()">
        <span class="material-symbols-outlined">format_list_numbered</span>
      </button>

      <div class="w-px h-5 bg-surface-variant mx-1" />

      <!-- Blocks -->
      <button type="button" title="Blockquote" class="toolbar-btn" :class="{ 'toolbar-btn-active': editor?.isActive('blockquote') }" @click="editor?.chain().focus().toggleBlockquote().run()">
        <span class="material-symbols-outlined">format_quote</span>
      </button>
      <button type="button" title="Code block" class="toolbar-btn" :class="{ 'toolbar-btn-active': editor?.isActive('codeBlock') }" @click="editor?.chain().focus().toggleCodeBlock().run()">
        <span class="material-symbols-outlined">integration_instructions</span>
      </button>
      <button type="button" title="Horizontal rule" class="toolbar-btn" @click="editor?.chain().focus().setHorizontalRule().run()">
        <span class="material-symbols-outlined">horizontal_rule</span>
      </button>

      <div class="w-px h-5 bg-surface-variant mx-1" />

      <!-- Link & Image -->
      <button type="button" title="Link" class="toolbar-btn" :class="{ 'toolbar-btn-active': editor?.isActive('link') }" @click="setLink">
        <span class="material-symbols-outlined">link</span>
      </button>
      <button type="button" title="Image" class="toolbar-btn" @click="addImage">
        <span class="material-symbols-outlined">image</span>
      </button>
    </div>

    <!-- Editor area -->
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<style lang="postcss">
.toolbar-btn {
  @apply flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors;
}
.toolbar-btn .material-symbols-outlined {
  font-size: 18px;
}
.toolbar-btn-active {
  @apply bg-primary/10 text-primary;
}

.editor-content .tiptap {
  @apply min-h-[280px] p-4 text-sm text-on-surface outline-none;
}

/* Placeholder */
.editor-content .tiptap p.is-editor-empty:first-child::before {
  @apply text-on-surface-variant/50;
  content: attr(data-placeholder);
  float: left;
  pointer-events: none;
  height: 0;
}

/* Prose styles inside editor */
.editor-content .tiptap h1 { @apply text-2xl font-bold mt-6 mb-3; }
.editor-content .tiptap h2 { @apply text-xl font-bold mt-5 mb-2; }
.editor-content .tiptap h3 { @apply text-lg font-semibold mt-4 mb-2; }
.editor-content .tiptap p  { @apply mb-3 leading-relaxed; }
.editor-content .tiptap ul { @apply list-disc pl-6 mb-3 space-y-1; }
.editor-content .tiptap ol { @apply list-decimal pl-6 mb-3 space-y-1; }
.editor-content .tiptap blockquote { @apply border-l-4 border-primary/30 pl-4 italic text-on-surface-variant my-4; }
.editor-content .tiptap code { @apply bg-surface-container-high px-1.5 py-0.5 rounded text-xs font-mono text-primary; }
.editor-content .tiptap pre  { @apply bg-surface-container-high rounded-lg p-4 my-4 overflow-x-auto; }
.editor-content .tiptap pre code { @apply bg-transparent p-0 text-on-surface; }
.editor-content .tiptap a { @apply text-primary underline; }
.editor-content .tiptap hr { @apply border-surface-variant my-6; }
.editor-content .tiptap img { @apply max-w-full rounded-lg my-4; }
.editor-content .tiptap strong { @apply font-bold; }
.editor-content .tiptap em { @apply italic; }
.editor-content .tiptap s { @apply line-through; }
</style>
