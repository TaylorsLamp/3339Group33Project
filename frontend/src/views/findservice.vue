<!-- This view shows a list of services. Users can search for services and click on a service to be redirected to another component that displays the service's details -->
<template>
  <main>
    <div>
      <!--Header-->
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Find Services
      </h1>
    </div>
    <div class="px-10 pt-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Search Service By</h2>
        <!-- Displays Service Name and Description selection -->
        <div class="flex flex-col">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="searchBy">
            <option value="Service Name">Service Name</option>
            <option value="Service Description">Service Description</option>
          </select>
        </div>
        <!--Display service name search field-->
        <div class="flex flex-col" v-if="searchBy === 'Service Name'">
          <label class="block">
            <input type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="name" v-on:keyup.enter="handleSubmitForm" placeholder="Enter service name" />
          </label>
        </div>
        <!--Display service description search field-->
        <div class="flex flex-col" v-if="searchBy === 'Service Description'">
          <label class="block">
            <input type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="description" v-on:keyup.enter="handleSubmitForm" placeholder="Enter service description" />
          </label>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div></div>
        <div></div>
        <div class="mt-5 grid-cols-2">
          <!--Clear Search button-->
          <button class="mr-10 border border-red-700 bg-white text-red-700 rounded" @click="loadData" type="submit">
            Clear Search
          </button>
          <!--Search Service button-->
          <button class="bg-red-700 text-white rounded" @click="handleSubmitForm" type="submit">
            Search Service
          </button>
        </div>
      </div>
    </div>

    <hr class="mt-10 mb-10" />
    <!-- Display Found Data -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <!--List of Services table-->
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Services</h2>
        <h3 class="italic">Click table row to view service details</h3>
      </div>
      <div class="flex flex-col col-span-2">
        <div v-if="loading" class="rounded bg-teal-50 p-6 text-center font-bold text-teal-700 animate-pulse">Loading service directory…</div>
        <div v-else-if="error" class="rounded border border-red-700 bg-white p-6 text-red-800 shadow-sm">
          <p class="text-lg font-bold">Service list error</p>
          <p>{{ error }}</p>
          <button class="mt-4 rounded bg-red-700 px-4 py-2 text-white" @click="execute">Retry</button>
        </div>
        <DataTable
          v-else
          :columns="serviceColumns"
          :rows="serviceRows"
          @row-click="openService"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
// Composition API: search state and service results use refs with mount-time API loading.
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getServices, searchServices } from '../api/api'
import { useApi } from '../composables/useApi'
import DataTable from '../components/DataTable.vue'

const serviceApi = useApi(async (query) => query ? searchServices(query) : getServices())
const { data: services, loading, error, execute } = serviceApi
const searchBy = ref(null)
const name = ref(null)
const description = ref(null)
const router = useRouter()
const serviceColumns = [
  { label: 'Service Name', field: 'name' },
  { label: 'Service Description', field: 'description' }
]
const serviceRows = computed(() => services.value || [])

function openService(service) {
  router.push({ name: 'servicedetails', params: { id: service._id } })
}

async function loadData() {
  searchBy.value = ''
  name.value = ''
  description.value = ''
  await execute()
}

async function handleSubmitForm() {
  if (searchBy.value === 'Service Name' && name.value) {
    await execute({ searchBy: 'name', name: name.value })
  } else if (searchBy.value === 'Service Description' && description.value) {
    await execute({ searchBy: 'description', description: description.value })
  }
}

onMounted(loadData)
</script>
