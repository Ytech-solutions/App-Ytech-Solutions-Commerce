import { useState, useEffect } from 'react'

interface PackOrder {
  id: number
  pack_id: number
  pack_name: string
  pack_price: string
  pack_features: string[]
  client_name: string
  client_email: string
  client_phone?: string
  client_company?: string
  client_city?: string
  project_description?: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  is_validated: boolean
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  validated_at?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  success: boolean
  data: PackOrder[] | PackOrder
  error?: string
}

export function usePackOrders() {
  const [orders, setOrders] = useState<PackOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pack-orders', { 
        cache: 'no-store',
        next: { revalidate: 30 } // Revalider toutes les 30 secondes
      })
      const data: ApiResponse = await response.json()
      
      if (data.success && data.data) {
        setOrders(Array.isArray(data.data) ? data.data : [data.data])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch pack orders')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const createPackOrder = async (orderData: Omit<PackOrder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/pack-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      
      const data: ApiResponse = await response.json()
      
      if (data.success && data.data) {
        const newOrder = Array.isArray(data.data) ? data.data[0] : data.data
        setOrders(prev => [...prev, newOrder])
        setError(null)
        return newOrder
      } else {
        throw new Error(data.error || 'Failed to create pack order')
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createPackOrder
  }
}
