"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Search,
  Package,
  CheckCircle,
  XCircle,
  BarChart3,
  Check,
  X,
  Clock,
  CreditCard,
  Rocket,
  Briefcase,
  ShoppingCart,
  Building
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePackOrders } from "@/hooks/use-pack-orders"

const statusConfig = {
  pending: { 
    label: "En attente", 
    color: "bg-yellow-500/20 text-yellow-500",
    icon: null
  },
  processing: { 
    label: "En cours", 
    color: "bg-blue-500/20 text-blue-500",
    icon: Package 
  },
  completed: { 
    label: "Terminé", 
    color: "bg-green-500/20 text-green-500",
    icon: CheckCircle 
  },
  cancelled: { 
    label: "Annulé", 
    color: "bg-red-500/20 text-red-500",
    icon: XCircle 
  }
}

const validationConfig = {
  true: { 
    label: "Confirmé", 
    color: "bg-green-500/20 text-green-500",
    icon: Check 
  },
  false: { 
    label: "En attente", 
    color: "bg-yellow-500/20 text-yellow-500",
    icon: Clock 
  }
}

const paymentConfig = {
  pending: { 
    label: "En attente", 
    color: "bg-yellow-500/20 text-yellow-500",
    icon: Clock 
  },
  paid: { 
    label: "Payé et confirmé", 
    color: "bg-green-500/20 text-green-500",
    icon: CreditCard 
  },
  failed: { 
    label: "Échec", 
    color: "bg-red-500/20 text-red-500",
    icon: XCircle 
  },
  refunded: { 
    label: "Remboursé", 
    color: "bg-orange-500/20 text-orange-500",
    icon: XCircle 
  }
}

export default function PackOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { orders, loading, error } = usePackOrders()

  // Fonction pour valider une commande
  const handleValidateOrder = async (orderId: number) => {
    try {
      const response = await fetch('/api/admin/pack-orders/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      })

      if (response.ok) {
        // Recharger les données
        window.location.reload()
      } else {
        alert('Erreur lors de la validation')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la validation')
    }
  }

  // Fonction pour marquer comme payé
  const handleMarkAsPaid = async (orderId: number) => {
    try {
      const response = await fetch('/api/admin/pack-orders/mark-paid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      })

      if (response.ok) {
        // Recharger les données
        window.location.reload()
      } else {
        alert('Erreur lors du marquage comme payé')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du marquage comme payé')
    }
  }

  // Définir les 4 packs fixes
  const allPacks = [
    { name: "Starter", icon: Rocket },
    { name: "Business", icon: Briefcase },
    { name: "E-Commerce", icon: ShoppingCart },
    { name: "Enterprise", icon: Building }
  ]

  // Calculer les statistiques par pack
  const packStats = orders.reduce((acc, order) => {
    const packName = order.pack_name
    if (!acc[packName]) {
      acc[packName] = {
        name: packName,
        count: 0,
        totalRevenue: 0
      }
    }
    acc[packName].count++
    acc[packName].totalRevenue += parseFloat(order.pack_price)
    return acc
  }, {})

  // Combiner les packs fixes avec les statistiques
  const packStatsArray = allPacks.map(pack => ({
    ...pack,
    count: packStats[pack.name]?.count || 0,
    totalRevenue: packStats[pack.name]?.totalRevenue || 0
  }))

  const filteredOrders = orders.filter(order => 
    order.pack_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.client_email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Commandes de Packs</h1>
          <p className="text-muted-foreground">{orders.length} commandes au total</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une commande..."
          className="pl-9 bg-secondary/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Pack Stats */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold">Statistiques par Pack</h2>
        </div>
        {packStatsArray.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packStatsArray.map((stat, index) => (
              <div key={stat.name} className={`bg-secondary/50 rounded-lg p-4 text-center ${stat.count > 0 ? 'ring-2 ring-primary/20' : ''}`}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{stat.name}</h3>
                <p className={`text-2xl font-bold mb-1 ${stat.count > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {stat.count}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.count === 1 ? 'demande' : 'demandes'}
                </p>
                <p className={`text-sm font-medium mt-2 ${stat.count > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {stat.totalRevenue > 0 ? `${stat.totalRevenue.toLocaleString('fr-FR')} DHS` : '-'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Grid - Full Width */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Section - Client Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{order.pack_name}</h3>
                        <p className="text-sm text-muted-foreground">{order.client_name}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p className="text-sm font-medium">{order.client_email}</p>
                      </div>
                      {order.client_phone && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                          <p className="text-sm font-medium">{order.client_phone}</p>
                        </div>
                      )}
                      {order.client_company && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Entreprise</p>
                          <p className="text-sm font-medium">{order.client_company}</p>
                        </div>
                      )}
                      {order.client_city && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Ville</p>
                          <p className="text-sm font-medium">{order.client_city}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date</p>
                        <p className="text-sm font-medium">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {order.project_description && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Description du projet</p>
                        <p className="text-sm bg-secondary p-3 rounded">{order.project_description}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Price, Validation and Payment Status */}
                  <div className="lg:w-80">
                    <div className="text-2xl font-bold text-primary mb-4">
                      {parseFloat(order.pack_price).toLocaleString('fr-FR')} DHS
                    </div>
                    
                    {/* Status */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Statut:</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                          {order.status === 'processing' && <Package className="w-3 h-3 mr-1" />}
                          {order.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {order.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                          {statusConfig[order.status].label}
                        </span>
                      </div>
                      
                      {/* Validation Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Validation:</span>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${order.is_validated ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                            {order.is_validated ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                            {order.is_validated ? 'Validé' : 'Non validé'}
                          </span>
                          {!order.is_validated && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleValidateOrder(order.id)}
                              className="h-6 px-2 text-xs"
                            >
                              Valider
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Payment Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Paiement:</span>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.payment_status === 'paid' ? 'bg-green-500/20 text-green-500' :
                            order.payment_status === 'failed' ? 'bg-red-500/20 text-red-500' :
                            order.payment_status === 'refunded' ? 'bg-orange-500/20 text-orange-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {order.payment_status === 'paid' && <CreditCard className="w-3 h-3 mr-1" />}
                            {order.payment_status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                            {order.payment_status === 'refunded' && <XCircle className="w-3 h-3 mr-1" />}
                            {order.payment_status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {order.payment_status === 'paid' ? 'Payé' : 
                             order.payment_status === 'failed' ? 'Échec' :
                             order.payment_status === 'refunded' ? 'Remboursé' : 'En attente'}
                          </span>
                          {order.payment_status === 'pending' && order.is_validated && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsPaid(order.id)}
                              className="h-6 px-2 text-xs"
                            >
                              Marquer payé
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Dates */}
                    <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                      <div>Créé: {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                      {order.validated_at && (
                        <div>Validé: {new Date(order.validated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                      )}
                      {order.paid_at && (
                        <div>Payé: {new Date(order.paid_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
