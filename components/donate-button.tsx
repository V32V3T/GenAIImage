'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { createDonationCheckoutSession } from '@/app/actions/stripe'

export function DonateButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDonate = async () => {
    setIsLoading(true)
    try {
      console.log('Initiating donation process...');
      const { url } = await createDonationCheckoutSession()
      if (url) {
        console.log('Redirecting to Stripe checkout:', url);
        // Use window.open for the redirect
        window.open(url, '_blank');
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Donation error:', error)
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to process donation: ${error.message}. Please try again or contact support.`
          : "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDonate}
      disabled={isLoading}
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      <Heart className="w-4 h-4 mr-2" />
      {isLoading ? 'Processing...' : 'Donate $1'}
    </Button>
  )
}

