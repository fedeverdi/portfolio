<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const API_BASE = import.meta.env.VITE_API_BASE ?? ''
const auth = useAuthStore()

const uploading = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)

async function uploadFile(file: File) {
  if (!file.type.startsWith('image/')) {
    error.value = 'Only image files are allowed'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Image must be smaller than 5MB'
    return
  }

  uploading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/api/images/upload`, {
      method: 'POST',
      headers: auth.authHeaders(),
      body: formData
    })

    if (!res.ok) {
      const err = await res.json() as { error: string }
      throw new Error(err.error ?? 'Upload failed')
    }

    const data = await res.json() as { url: string }
    emit('update:modelValue', data.url)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    uploading.value = false
  }
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadFile(file)
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) uploadFile(file)
}

async function removeImage() {
  const url = props.modelValue
  if (!url) return

  // Extract key from URL and base64url-encode it
  try {
    const key = url.split('.net/')[1] ?? url.split('.com/')[1]
    if (key) {
      const encoded = btoa(key).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      await fetch(`${API_BASE}/api/images/${encoded}`, {
        method: 'DELETE',
        headers: auth.authHeaders()
      })
    }
  } catch { /* ignore delete errors */ }

  emit('update:modelValue', '')
}
</script>

<template>
  <div class="space-y-3">
    <!-- Preview -->
    <div v-if="modelValue" class="relative group">
      <div class="aspect-video rounded-xl overflow-hidden bg-surface-container">
        <img :src="modelValue" alt="Cover" class="w-full h-full object-cover" />
      </div>
      <button
        type="button"
        class="absolute top-3 right-3 bg-error text-white rounded-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/90"
        title="Remove image"
        @click="removeImage"
      >
        <span class="material-symbols-outlined text-sm">delete</span>
      </button>
    </div>

    <!-- Upload area -->
    <div
      v-if="!modelValue"
      class="aspect-video rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer"
      :class="dragOver
        ? 'border-primary bg-primary/5'
        : 'border-surface-variant hover:border-primary/50 bg-surface-container'"
      @click="fileInput?.click()"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="onDrop"
    >
      <div v-if="uploading" class="flex flex-col items-center gap-2">
        <span class="material-symbols-outlined text-3xl text-on-surface-variant animate-pulse">cloud_upload</span>
        <p class="text-sm text-on-surface-variant">Uploading...</p>
      </div>
      <div v-else class="flex flex-col items-center gap-2 select-none">
        <span class="material-symbols-outlined text-3xl text-outline-variant">add_photo_alternate</span>
        <p class="text-sm text-on-surface-variant font-medium">Drop image here or click to upload</p>
        <p class="text-[11px] text-outline-variant">JPEG, PNG, WebP · max 5MB</p>
      </div>
    </div>

    <!-- URL input (fallback / manual override) -->
    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
        Or enter image URL
      </label>
      <input
        :value="modelValue"
        type="url"
        placeholder="https://..."
        class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <p v-if="error" class="text-xs text-error">{{ error }}</p>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      class="hidden"
      @change="onFileChange"
    />
  </div>
</template>
