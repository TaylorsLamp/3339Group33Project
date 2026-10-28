<!-- This is the home view - which shows a dashboard -->
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Dashboard
      </h1>
      <br />
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div class="ml-10"></div>
        <div class="flex flex-col col-span-2">
          <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
              Events Attendance
          </h1>
      
          <div v-if="attendanceLoading" class="mt-10 text-center text-lg font-semibold text-gray-500 animate-pulse">Loading event attendance…</div>
          <div v-else-if="attendanceError" class="mt-10 rounded border border-red-300 bg-red-50 p-4 text-red-900">
            <p class="font-bold">Dashboard event data unavailable</p>
            <p>{{ attendanceError }}</p>
            <button class="mt-3 rounded bg-red-700 px-4 py-2 text-white" @click="executeAttendance">Retry</button>
          </div>
          <div v-else-if="!recentEvents.length" class="flex justify-center mt-10">No recent events found.</div>
          <table v-if="!attendanceLoading && !attendanceError && recentEvents.length" class="min-w-full shadow-md rounded">
            <thead class="bg-gray-50 text-xl">
              <tr class="p-4 text-left">
                <th class="p-4 text-left">Event Name</th>
                <th class="p-4 text-left">Event Date</th>
                <th class="p-4 text-left">Number of Attendees</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300"> 
              <tr
                @click="editEvent(event._id)"
                v-for="event in recentEvents"
                :key="event._id"
              >
                <td class="p-2 text-left">{{ event.name }}</td>
                <td class="p-2 text-left">{{ formatDate(event.date) }}</td>
                <td class="p-2 text-left">{{ event.attendees.length }}</td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="!attendanceLoading && !attendanceError && recentEvents.length" class="mt-10">
            <AttendanceChart :label="labels" :chart-data="chartData"></AttendanceChart>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div class="ml-10"></div>
        <div class="flex flex-col col-span-2">
          <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
              Clients by Zip Code
          </h1>
          
          <div v-if="zipLoading" class="mt-10 text-center text-lg font-semibold text-blue-500 animate-pulse">Loading client zip totals…</div>
          <div v-else-if="zipError" class="mt-10 rounded border border-orange-300 bg-orange-50 p-4 text-orange-900">
            <p class="font-bold">Client zip summary unavailable</p>
            <p>{{ zipError }}</p>
            <button class="mt-3 rounded bg-orange-700 px-4 py-2 text-white" @click="executeZips">Retry</button>
          </div>
          <div v-else-if="!zips.length" class="flex justify-center mt-10">No client zip data found.</div>
          <table v-if="!zipLoading && !zipError && zips.length" class="min-w-full shadow-md rounded">
            <thead class="bg-gray-50 text-xl">
              <tr class="p-4 text-left">
                <th class="p-4 text-left">Zip Number</th>
                <th class="p-4 text-left">Client Count</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr
                v-for="zip in zips"
                :key="zip._id"
              >
                <td class="p-2 text-left">{{ zip._id }}</td>
                <td class="p-2 text-left">{{ zip.count }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="!zipLoading && !zipError && zips.length" class="flex justify-center mt-10">
            <ZipChart :label="zipLabels" :chart-data="zipChartData"></ZipChart>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AttendanceChart from '../components/barChart.vue'
import ZipChart from '../components/donutZipChart.vue'
import { getAttendance, getClientsByZipCode } from '../api/api'
import { useApi } from '../composables/useApi'

const recentEvents = ref([])
const zips = ref([])
const labels = ref([])
const chartData = ref([])
const zipLabels = ref([])
const zipChartData = ref([])

const attendanceApi = useApi(getAttendance)
const attendanceLoading = attendanceApi.loading
const attendanceError = attendanceApi.error
const executeAttendance = async () => {
  const attendance = await attendanceApi.execute()
  if (attendance) {
    recentEvents.value = attendance
    labels.value = attendance.map((item) => `${item.name} (${formatDate(item.date)})`)
    chartData.value = attendance.map((item) => item.attendees.length)
  }
}

const zipApi = useApi(getClientsByZipCode)
const zipLoading = zipApi.loading
const zipError = zipApi.error
const executeZips = async () => {
  const zipdata = await zipApi.execute()
  if (zipdata) {
    zips.value = zipdata
    zipLabels.value = zipdata.map((item) => item._id)
    zipChartData.value = zipdata.map((item) => item.count)
  }
}

function formatDate(date) {
  const isoDate = new Date(date)
  const year = isoDate.getUTCFullYear()
  const month = String(isoDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(isoDate.getUTCDate()).padStart(2, '0')
  return `${month}/${day}/${year}`
}

onMounted(() => {
  executeAttendance()
  executeZips()
})
</script>
