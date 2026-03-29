"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  MessageSquare,
  Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearch } from "@/hooks/use-search"

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Devis", href: "/dashboard/devis", icon: FileText },
  { name: "Packs commandes", href: "/dashboard/pack-orders", icon: Package },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Paramètres", href: "/dashboard/change-password", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const { results, search, loading, clearResults } = useSearch()

  // Gérer la recherche en temps réel
  useEffect(() => {
    if (searchQuery.trim()) {
      search(searchQuery)
      setShowSearchResults(true)
    } else {
      clearResults()
      setShowSearchResults(false)
    }
  }, [searchQuery])

  // Gérer la soumission du formulaire
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Rediriger vers la page de recherche avec tous les résultats
      window.location.href = `/dashboard/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  // Fermer les résultats de recherche quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.search-container')) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">Y</span>
              </div>
              <div>
                <span className="font-bold">Ytech</span>
                <span className="text-xs text-muted-foreground block">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Section - Bottom */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">Administrateur</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-2 justify-start text-muted-foreground hover:text-destructive"
              onClick={() => signOut({ callbackUrl: '/connexion' })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Deconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Search */}
              <div className="hidden md:flex relative w-64 search-container">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <form onSubmit={handleSearch} className="w-full">
                  <Input
                    placeholder="Rechercher..."
                    className="pl-9 bg-secondary/50 border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  />
                </form>
                
                {/* Search Results Dropdown */}
                {showSearchResults && (results.devis.length > 0 || results.packOrders.length > 0 || results.messages.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {loading && (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
                        <p className="text-sm text-muted-foreground mt-2">Recherche...</p>
                      </div>
                    )}
                    
                    {results.devis.length > 0 && (
                      <div className="border-b border-border">
                        <div className="px-4 py-2 bg-secondary/50">
                          <p className="text-xs font-semibold text-muted-foreground">DEVIS</p>
                        </div>
                        {results.devis.map((result) => (
                          <a
                            key={`devis-${result.id}`}
                            href={`/dashboard/devis`}
                            className="block px-4 py-3 hover:bg-secondary/50 transition-colors"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{result.client_name}</p>
                                <p className="text-xs text-muted-foreground">{result.service}</p>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                                {result.reference}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                    
                    {results.packOrders.length > 0 && (
                      <div className="border-b border-border">
                        <div className="px-4 py-2 bg-secondary/50">
                          <p className="text-xs font-semibold text-muted-foreground">PACKS COMMANDÉS</p>
                        </div>
                        {results.packOrders.map((result) => (
                          <a
                            key={`pack-${result.id}`}
                            href={`/dashboard/pack-orders`}
                            className="block px-4 py-3 hover:bg-secondary/50 transition-colors"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{result.client_name}</p>
                                <p className="text-xs text-muted-foreground">{result.pack_name}</p>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                                {parseFloat(result.pack_price).toLocaleString('fr-FR')} DHS
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                    
                    {results.messages.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-secondary/50">
                          <p className="text-xs font-semibold text-muted-foreground">MESSAGES</p>
                        </div>
                        {results.messages.map((result) => (
                          <a
                            key={`message-${result.id}`}
                            href={`/dashboard/messages`}
                            className="block px-4 py-3 hover:bg-secondary/50 transition-colors"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{result.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{result.subject || result.message.substring(0, 50)}...</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                result.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                                result.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-green-500/20 text-green-500'
                              }`}>
                                {result.priority === 'high' ? 'Urgent' :
                                 result.priority === 'medium' ? 'Normal' : 'Faible'}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                    
                    <div className="p-3 border-t border-border">
                      <a
                        href={`/dashboard/search?q=${encodeURIComponent(searchQuery)}`}
                        className="text-xs text-primary hover:underline"
                        onClick={() => setShowSearchResults(false)}
                      >
                        Voir tous les résultats →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">A</span>
                  </div>
                  <span className="hidden sm:inline">Admin</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2"
                    >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-secondary"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Tableau de bord
                      </Link>
                      <Link
                        href="/dashboard/change-password"
                        className="block px-4 py-2 text-sm hover:bg-secondary"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Paramètres
                      </Link>
                      <button
                        className="block px-4 py-2 text-sm text-destructive hover:bg-secondary text-left w-full"
                        onClick={() => {
                          setUserMenuOpen(false)
                          signOut({ callbackUrl: '/connexion' })
                        }}
                      >
                        Deconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Close Button */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed top-4 right-4 z-50 lg:hidden p-2 bg-card rounded-full"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
