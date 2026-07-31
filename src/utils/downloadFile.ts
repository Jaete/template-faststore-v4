export async function downloadFile(fileUrl?: string) {
  if (!fileUrl) {
    return
  }

  try {
    const response = await fetch(fileUrl)

    if (!response.ok) {
      return
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = ''
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    // Falha silenciosa: sem download, sem estado de erro pra reportar aqui
  }
}
