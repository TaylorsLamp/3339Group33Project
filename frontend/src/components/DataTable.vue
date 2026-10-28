<template>
  <div>
    <table class="min-w-full shadow-md rounded">
      <thead class="bg-gray-50 text-xl">
        <tr>
          <th
            v-for="column in columns"
            :key="column.field"
            class="p-4 text-left cursor-pointer select-none"
            @click="changeSort(column.field)"
          >
            {{ column.label }}
            <span aria-hidden="true">{{ sortIndicator(column.field) }}</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-300">
        <tr v-if="!sortedRows.length">
          <td class="p-4 text-center italic" :colspan="columns.length">No results</td>
        </tr>
        <template v-else>
          <tr
            v-for="row in paginatedRows"
            :key="row._id || row.id || getRowKey(row)"
            class="cursor-pointer hoverRow"
            @click="$emit('row-click', row)"
          >
            <td v-for="column in columns" :key="column.field" class="p-4 text-left">
              {{ getCellValue(column, row) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div class="mt-4 flex items-center justify-between text-sm">
      <span>Showing {{ firstResult }}-{{ lastResult }} of {{ sortedRows.length }}</span>
      <div class="space-x-2">
        <button type="button" class="rounded border px-3 py-1 disabled:opacity-50" :disabled="currentPage === 1" @click="previousPage">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button type="button" class="rounded border px-3 py-1 disabled:opacity-50" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true }
})

defineEmits(['row-click'])

const pageSize = 10
const currentPage = ref(1)
const sortField = ref(null)
const sortDirection = ref(null)

function getFieldValue(row, field) {
  return String(field).split('.').reduce((value, key) => value == null ? undefined : value[key], row)
}

function getCellValue(column, row) {
  if (typeof column.render === 'function') return column.render(row)
  const value = getFieldValue(row, column.field)
  return value == null ? '' : value
}

function getRowKey(row) {
  return JSON.stringify(row)
}

const sortedRows = computed(() => {
  if (!sortField.value || !sortDirection.value) return [...props.rows]

  return [...props.rows].sort((a, b) => {
    const aValue = getFieldValue(a, sortField.value)
    const bValue = getFieldValue(b, sortField.value)
    const aText = aValue == null ? '' : String(aValue).toLowerCase()
    const bText = bValue == null ? '' : String(bValue).toLowerCase()
    if (aText < bText) return sortDirection.value === 'asc' ? -1 : 1
    if (aText > bText) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize)))
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedRows.value.slice(start, start + pageSize)
})
const firstResult = computed(() => sortedRows.value.length ? (currentPage.value - 1) * pageSize + 1 : 0)
const lastResult = computed(() => sortedRows.value.length ? Math.min(currentPage.value * pageSize, sortedRows.value.length) : 0)

function changeSort(field) {
  if (sortField.value !== field) {
    sortField.value = field
    sortDirection.value = 'asc'
  } else if (sortDirection.value === 'asc') {
    sortDirection.value = 'desc'
  } else if (sortDirection.value === 'desc') {
    sortField.value = null
    sortDirection.value = null
  } else {
    sortDirection.value = 'asc'
  }
  currentPage.value = 1
}

function sortIndicator(field) {
  if (sortField.value !== field || !sortDirection.value) return ''
  return sortDirection.value === 'asc' ? ' ▲' : ' ▼'
}

function previousPage() {
  if (currentPage.value > 1) currentPage.value -= 1
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

watch(() => props.rows, () => {
  currentPage.value = 1
  sortField.value = null
  sortDirection.value = null
}, { deep: true })

watch(totalPages, (value) => {
  if (currentPage.value > value) currentPage.value = value
})
</script>
