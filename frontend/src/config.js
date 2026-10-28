const configuredRootApi = import.meta.env.VITE_ROOT_API || ''

export const rootApi = configuredRootApi.replace(/\/+$/, '')
