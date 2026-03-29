"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SessionExpiryAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const reason = searchParams.get('reason')
    
    if (reason === 'expired') {
      setMessage('Votre session a expiré. Veuillez vous reconnecter.')
      setShowAlert(true)
    } else if (reason === 'error') {
      setMessage('Une erreur est survenue. Veuillez vous reconnecter.')
      setShowAlert(true)
    }

    // Clean up URL parameters
    if (reason) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('reason')
      params.delete('redirect')
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams])

  if (!showAlert) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-lg rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">{message}</p>
            <div className="mt-2">
              <button
                onClick={() => {
                  setShowAlert(false)
                  router.push('/connexion')
                }}
                className="text-sm text-yellow-700 underline hover:text-yellow-800"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
