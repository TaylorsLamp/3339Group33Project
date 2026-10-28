import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import jwtDecode from 'jwt-decode'
import { loginUser, logoutUser, setAuthHeader, removeAuthHeader } from '../api/api'

export function safeJwtDecode(token) {
  if (typeof token !== 'string' || !token) return null

  try {
    const decoded = jwtDecode(token)
    if (!decoded || typeof decoded !== 'object') return null
    if (typeof decoded.exp !== 'number' || decoded.exp * 1000 <= Date.now()) return null

    const name = typeof decoded.name === 'string' ? decoded.name.trim() : ''
    const role = typeof decoded.role === 'string' ? decoded.role.toLowerCase().trim() : ''
    if (!name || !role) return null

    return { ...decoded, name, role }
  } catch (error) {
    return null
  }
}

export const decodeJwtToken = safeJwtDecode

export const useLoggedInUserStore = defineStore({
  id: 'loggedInUser',
  state: () => ({
    name: '',
    role: '',
    isLoggedIn: false
  }),
  actions: {
    clearSession() {
      try {
        if (typeof localStorage !== 'undefined') localStorage.removeItem('authToken')
      } catch (error) {}
      removeAuthHeader()
      this.$patch({ name: '', role: '', isLoggedIn: false })
    },
    restoreSession() {
      let token = null
      try {
        if (typeof localStorage !== 'undefined') token = localStorage.getItem('authToken')
      } catch (error) {
        this.clearSession()
        return false
      }

      if (!token) {
        removeAuthHeader()
        this.$patch({ name: '', role: '', isLoggedIn: false })
        return false
      }

      const decoded = safeJwtDecode(token)
      if (!decoded) {
        this.clearSession()
        return false
      }

      setAuthHeader(token)
      this.$patch({ isLoggedIn: true, role: decoded.role, name: decoded.name })
      return true
    },
    async login(username, password) {
      const toast = useToast()
      try {
        const token = await loginUser(username, password)
        const decoded = safeJwtDecode(token)
        if (!decoded) {
          this.clearSession()
          toast.error('Login failed: invalid session token')
          return
        }

        setAuthHeader(token)
        this.$patch({ isLoggedIn: true, role: decoded.role, name: decoded.name })
        if (this.$router) this.$router.push('/')
        toast.success('Login Successful!')
      } catch (error) {
        this.clearSession()
        toast.error(error?.message || 'Login failed')
      }
    },
    logout() {
      const toast = useToast()
      logoutUser()
      this.clearSession()
      if (this.$router) this.$router.push('/')
      toast.info('You have been logged out!')
    }
  }
})
