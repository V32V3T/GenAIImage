'use client'

import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { DonateButton } from '@/components/donate-button'
import { DownloadButton } from '@/components/download-button'

export default function AnimeGenerator() {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate image')
      }

      setGeneratedImage(data.image)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Anime Art Generator</h1>
          <p className="text-gray-300">
            Transform your ideas into beautiful anime-style artwork using AI
          </p>
          <DonateButton />
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter your prompt (e.g., 'a magical anime forest with cherry blossoms')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !prompt}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Creating your anime artwork...</p>
          </div>
        )}

        {generatedImage && !isLoading && (
          <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <img
                src={generatedImage}
                alt="Generated anime artwork"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="flex justify-end">
                <DownloadButton imageUrl={generatedImage} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

