import { useState, useEffect } from 'react'

interface Devis {
  id: number
  reference: string
  client_name: string
  client_email: string
  service: string
  features: string[]
  amount: number
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  deadline: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  data?: Devis | Devis[]
  error?: string
}

export function useDevis() {
  const [devis, setDevis] = useState<Devis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDevis = async (status?: string | null, search?: string | null) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (search) params.append('search', search)
      
      const response = await fetch(`/api/devis?${params.toString()}`)
      const data: ApiResponse = await response.json()
      
      if (data.success && data.data) {
        setDevis(Array.isArray(data.data) ? data.data : [data.data])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch devis')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const createDevis = async (devisData: Omit<Devis, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devisData),
      })
      
      const data: ApiResponse = await response.json()
      
      if (data.success && data.data) {
        const newDevis = Array.isArray(data.data) ? data.data[0] : data.data
        setDevis(prev => [newDevis, ...prev])
        setError(null)
        return newDevis
      } else {
        throw new Error(data.error || 'Failed to create devis')
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const updateDevisStatus = async (id: number, status: 'pending' | 'accepted' | 'rejected' | 'completed') => {
    try {
      const response = await fetch(`/api/devis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      const data: ApiResponse = await response.json()
      
      if (data.success && data.data) {
        // Gérer le cas où data.data est un tableau ou un objet
        const updatedDevis = Array.isArray(data.data) ? data.data[0] : data.data
        
        setDevis(prev => 
          prev.map(d => d.id === id ? updatedDevis : d)
        )
        setError(null)
        return updatedDevis
      } else {
        throw new Error(data.error || 'Failed to update devis')
      }
    } catch (err) {
      setError('Network error')
      throw new Error('Network error')
    }
  }

  const deleteDevis = async (id: number) => {
    try {
      const response = await fetch(`/api/devis/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDevis(prev => prev.filter(d => d.id !== id))
        return true
      } else {
        throw new Error(data.error || 'Failed to delete devis')
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  useEffect(() => {
    fetchDevis()
  }, [])

  return {
    devis,
    loading,
    error,
    fetchDevis,
    createDevis,
    updateDevisStatus,
    deleteDevis,
  }
}
