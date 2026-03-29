"use client"

import React, { memo, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Package,
  Settings,
  Rocket,
  Briefcase,
  ShoppingCart,
  Building
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePackOrders } from "@/hooks/use-pack-orders"
import { useDevis } from "@/hooks/use-devis"
import { useMessages } from "@/hooks/use-messages"

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-500",
  accepted: "bg-primary/20 text-primary",
  rejected: "bg-destructive/20 text-destructive"
}

const statusLabels = {
  pending: "En attente",
  accepted: "Accepte",
  rejected: "Refuse"
}

const packStatusColors = {
  pending: "bg-yellow-500/20 text-yellow-500",
  processing: "bg-blue-500/20 text-blue-500",
  completed: "bg-green-500/20 text-green-500",
  cancelled: "bg-destructive/20 text-destructive"
}

const packStatusLabels = {
  pending: "En attente",
  processing: "En cours",
  completed: "Terminé",
  cancelled: "Annulé"
}

export default memo(function DashboardPage() {
  const { orders, loading: loadingOrders } = usePackOrders()
  const { devis, loading: loadingDevis } = useDevis()
  const { messages, loading: loadingMessages } = useMessages()

  // État de chargement global
  const isLoading = loadingOrders || loadingDevis || loadingMessages

  // Définir les 4 packs fixes
  const allPacks = useMemo(() => [
    { name: "Starter", icon: Rocket },
    { name: "Business", icon: Briefcase },
    { name: "E-Commerce", icon: ShoppingCart },
    { name: "Enterprise", icon: Building }
  ], [])

  // Calculer les statistiques par pack
  const packStats = useMemo(() => orders.reduce((acc, order) => {
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
  }, {}), [orders])

  // Combiner les packs fixes avec les statistiques
  const packStatsArray = useMemo(() => allPacks.map(pack => ({
    ...pack,
    count: packStats[pack.name]?.count || 0,
    totalRevenue: packStats[pack.name]?.totalRevenue || 0
  })), [allPacks, packStats])

  // Calculer les statistiques globales dynamiques
  const globalStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.pack_price), 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const processingOrders = orders.filter(o => o.status === 'processing').length
    const completedOrders = orders.filter(o => o.status === 'completed').length
    const pendingQuotes = devis.filter(d => d.status === 'pending').length
    const unreadMessages = messages.filter(m => m.status === 'pending').length
    
    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      processingOrders,
      completedOrders,
      pendingQuotes,
      unreadMessages,
      conversionRate: orders.length > 0 ? ((completedOrders / orders.length) * 100).toFixed(1) : '0'
    }
  }, [orders, devis, messages])

  // Stats dynamiques depuis la base de données
  const stats = useMemo(() => [
    {
      name: "Devis en attente",
      value: globalStats.pendingQuotes.toString(),
      change: `+${globalStats.pendingQuotes}`,
      trend: "up",
      icon: FileText,
      color: "from-primary to-accent"
    },
    {
      name: "Commandes totales",
      value: globalStats.totalOrders.toString(),
      change: `+${globalStats.pendingOrders}`,
      trend: "up",
      icon: Package,
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Messages non lus",
      value: globalStats.unreadMessages.toString(),
      change: `+${globalStats.unreadMessages}`,
      trend: "up",
      icon: MessageSquare,
      color: "from-accent to-primary"
    },
    {
      name: "Taux de conversion",
      value: `${globalStats.conversionRate}%`,
      change: globalStats.conversionRate > 0 ? '+2.1%' : '0%',
      trend: globalStats.conversionRate > 0 ? "up" : "stable",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500"
    }
  ], [globalStats])

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue, Admin ! Voici un apercu de votre activite en temps réel.
          </p>
        </div>
        {/* Real-time indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">En ligne</span>
        </div>
      </div>

      {/* Stats Grid - Full Width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {packStatsArray.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{stat.name}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.count} commande{stat.count !== 1 ? 's' : ''}
                </p>
                <p className="text-sm font-medium">
                  {stat.totalRevenue > 0 ? `${stat.totalRevenue.toLocaleString('fr-FR')} DHS` : '0 DHS'}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Financial Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 border border-border rounded-xl p-6 w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold">Résumé financier</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Revenu total</p>
            <p className="text-3xl font-bold text-primary">
              {globalStats.totalRevenue.toLocaleString('fr-FR')} DHS
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {orders.length > 0 ? `Moyenne: ${(globalStats.totalRevenue / orders.length).toFixed(0)} DHS` : '0 DHS'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Taux conversion</p>
            <p className="text-3xl font-bold text-green-600">
              {globalStats.conversionRate}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {globalStats.completedOrders} / {globalStats.totalOrders} commandes
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">En cours</p>
            <p className="text-3xl font-bold text-blue-600">
              {globalStats.processingOrders}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Commandes actives
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid - Full Width */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full">
        {/* Recent Quotes - Takes 3 columns on XL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl xl:col-span-3"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Devis recents</h2>
            <Link href="/dashboard/devis">
              <Button variant="ghost" size="sm" className="text-primary">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {devis.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucun devis pour le moment</p>
              </div>
            ) : (
              devis.slice(0, 4).map((quote) => (
                <div key={quote.id} className="p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{quote.client_name}</p>
                        <p className="text-xs text-muted-foreground">{quote.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{quote.amount.toLocaleString('fr-FR')} DHS</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[quote.status as keyof typeof statusColors]}`}>
                        {statusLabels[quote.status as keyof typeof statusLabels]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(quote.created_at).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Messages - Takes 1 column on XL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-xl"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages recents</h2>
            <Link href="/dashboard/messages">
              <Button variant="ghost" size="sm" className="text-primary">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucun message pour le moment</p>
              </div>
            ) : (
              messages.slice(0, 4).map((message) => (
                <div key={message.id} className="p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{message.name}</p>
                        <p className="text-xs text-muted-foreground">{message.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        message.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                        message.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {message.priority === 'high' ? 'Urgent' :
                         message.priority === 'medium' ? 'Normal' : 'Faible'}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{message.date}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>

      {/* Recent Pack Orders - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl w-full"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">Packs commandés recents</h2>
          <Link href="/dashboard/pack-orders">
            <Button variant="ghost" size="sm" className="text-primary">
              Voir tout
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucune commande de pack pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="p-4 hover:bg-secondary/50 transition-colors rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{order.pack_name}</p>
                        <p className="text-xs text-muted-foreground">{order.client_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-primary">{parseFloat(order.pack_price).toLocaleString('fr-FR')} DHS</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${packStatusColors[order.status as keyof typeof packStatusColors]}`}>
                        {packStatusLabels[order.status as keyof typeof packStatusLabels]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-xl p-6 w-full"
      >
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard/pack-orders">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <Package className="w-6 h-6 text-primary" />
              <span>Packs commandés</span>
            </Button>
          </Link>
          <Link href="/dashboard/messages">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              <span>Messages</span>
            </Button>
          </Link>
          <Link href="/dashboard/change-password">
            <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
              <Settings className="w-6 h-6 text-primary" />
              <span>Changer mot de passe</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}) 
