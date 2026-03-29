<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useContactsStore } from '@/stores/contacts'

const store = useContactsStore()
const expanded = ref<string | null>(null)
const confirmDelete = ref<string | null>(null)

onMounted(() => store.fetchAll())

function toggle(id: string) {
  expanded.value = expanded.value === id ? null : id
}

async function handleMarkRead(id: string) {
  await store.markRead(id)
}

async function handleDelete(id: string) {
  await store.remove(id)
  confirmDelete.value = null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="p-4 md:p-8 lg:p-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 rounded-full bg-primary" />
          <span class="text-[0.6875rem] font-bold tracking-[0.1em] text-secondary uppercase">Inbox</span>
        </div>
        <div class="flex items-center gap-4">
          <h2 class="text-3xl md:text-[3.5rem] font-bold tracking-tighter leading-tight text-on-surface">Contacts</h2>
          <span
            v-if="store.unreadCount > 0"
            class="px-3 py-1 bg-primary text-on-primary rounded-full text-sm font-bold"
          >
            {{ store.unreadCount }} new
          </span>
        </div>
        <p class="text-on-surface-variant max-w-md mt-4 leading-relaxed text-sm">
          Contact requests submitted from the portfolio.
        </p>
      </div>
    </div>

    <!-- Error -->
    <div v-if="store.error" class="mb-6 px-4 py-3 bg-error/10 text-error text-sm rounded-xl border border-error/20">
      {{ store.error }}
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="py-24 text-center text-on-surface-variant text-sm">Loading...</div>

    <!-- Empty -->
    <div
      v-else-if="store.items.length === 0"
      class="py-24 text-center text-on-surface-variant text-sm"
    >
      No contact requests yet.
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div
        v-for="item in store.items"
        :key="item.id"
        class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(42,52,57,0.04)] transition-all"
        :class="!item.is_read ? 'border-l-4 border-primary' : 'border-l-4 border-transparent'"
      >
        <!-- Row -->
        <div
          class="px-8 py-5 flex items-start gap-5 cursor-pointer hover:bg-surface-container-low transition-colors"
          @click="toggle(item.id)"
        >
          <!-- Unread dot -->
          <div class="mt-1.5 flex-shrink-0">
            <div
              class="w-2 h-2 rounded-full transition-colors"
              :class="item.is_read ? 'bg-surface-variant' : 'bg-primary'"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <span class="font-semibold text-sm text-on-surface">{{ item.name }}</span>
              <span class="text-xs text-on-surface-variant">{{ item.email }}</span>
            </div>
            <p class="text-sm text-on-surface-variant truncate">{{ item.message }}</p>
          </div>

          <!-- Meta -->
          <div class="flex-shrink-0 text-right">
            <p class="text-[11px] text-on-surface-variant tabular-nums">{{ formatDate(item.created_at) }}</p>
            <span
              v-if="!item.is_read"
              class="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest text-primary"
            >Unread</span>
          </div>

          <!-- Chevron -->
          <span
            class="material-symbols-outlined text-on-surface-variant flex-shrink-0 transition-transform"
            :class="expanded === item.id ? 'rotate-180' : ''"
          >expand_more</span>
        </div>

        <!-- Expanded message -->
        <Transition name="expand">
          <div v-if="expanded === item.id" class="px-8 pb-6 border-t border-surface-variant/20">
            <p class="text-sm text-on-surface leading-relaxed whitespace-pre-wrap pt-5">{{ item.message }}</p>

            <!-- Actions -->
            <div class="flex items-center gap-3 mt-6">
              <a
                :href="`mailto:${item.email}?subject=Re: Contact request`"
                class="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
              >
                <span class="material-symbols-outlined text-sm">reply</span>
                Reply
              </a>

              <button
                v-if="!item.is_read"
                class="flex items-center gap-2 bg-surface-container-high text-on-surface px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-container-highest transition-colors"
                @click.stop="handleMarkRead(item.id)"
              >
                <span class="material-symbols-outlined text-sm">mark_email_read</span>
                Mark as read
              </button>

              <button
                v-if="confirmDelete !== item.id"
                class="ml-auto flex items-center gap-2 text-error px-4 py-2.5 rounded-xl text-sm hover:bg-error/10 transition-colors"
                @click.stop="confirmDelete = item.id"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
                Delete
              </button>
              <div v-else class="ml-auto flex items-center gap-2">
                <span class="text-sm text-on-surface-variant">Are you sure?</span>
                <button
                  class="bg-error text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
                  @click.stop="handleDelete(item.id)"
                >
                  Delete
                </button>
                <button
                  class="px-4 py-2 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  @click.stop="confirmDelete = null"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>
