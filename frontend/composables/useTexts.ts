export async function useTexts() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'https://api-portfolio.federicoverdi.it'

  const { data } = await useFetch<Record<string, string>>(
    `${apiBase}/api/public/texts`,
    { server: true, default: () => ({}) }
  )

  function t(key: string, fallback = ''): string {
    return data.value?.[key] ?? fallback
  }

  return { t, texts: data }
}
