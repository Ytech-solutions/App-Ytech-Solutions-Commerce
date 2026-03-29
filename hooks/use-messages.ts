import { useState, useEffect } from 'react'

interface Message {
  id: number
  name: string
  email: string
  phone: string
  company?: string
  pack?: string
  budget?: string
  message: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
  date?: string
  subject?: string
  client?: string
}

interface ApiResponse {
  success: boolean
  data?: Message | Message[]
  error?: string
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async (status?: string | null, priority?: string | null) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (priority) params.append('priority', priority)
      
      const response = await fetch(`/api/messages?${params.toString()}`)
      const data: ApiResponse = await response.json()
      
      if (data.success && data.data) {
        setMessages(Array.isArray(data.data) ? data.data : [data.data])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch messages')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      const data: ApiResponse = await response.json()
      
      if (data.success && data.data) {
        const updatedMessage = Array.isArray(data.data) ? data.data[0] : data.data
        
        setMessages(prev => 
          prev.map(m => m.id === id ? updatedMessage : m)
        )
        setError(null)
        return updatedMessage
      } else {
        throw new Error(data.error || 'Failed to update message')
      }
    } catch (err) {
      setError('Network error')
      throw new Error('Network error')
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  return {
    messages,
    loading,
    error,
    fetchMessages,
    updateMessageStatus,
  }
}
