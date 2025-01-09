'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DownloadButtonProps {
  imageUrl: string
}

export function DownloadButton({ imageUrl }: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = imageUrl.split(',')[1]
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `anime-art-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
    >
      <Download className="w-4 h-4 mr-2" />
      Download
    </Button>
  )
}

