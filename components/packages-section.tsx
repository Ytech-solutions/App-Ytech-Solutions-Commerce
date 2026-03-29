"use client"

import { useEffect, useRef, useState } from 'react'
import { Check, Sparkles, ArrowRight, Star, X, Clock, Users, Zap, Shield, Headphones, Code, Palette, Database, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import PackOrderModal from './pack-order-modal'

interface Package {
  id: string
  name: string
  subtitle: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  badge: string | null
  detailedFeatures: {
    category: string
    icon: React.ElementType
    items: string[]
  }[]
  deliveryTime: string
  revisions: string
  support: string
}

const packages: Package[] = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "Ideal pour debuter",
    price: "9 900",
    period: "unique",
    description: "Parfait pour les entrepreneurs et petites entreprises qui demarrent leur presence en ligne.",
    features: [
      "Site vitrine jusqu'a 5 pages",
      "Design responsive",
      "Formulaire de contact",
      "Optimisation SEO de base",
      "Hebergement 1 an inclus",
      "Support email",
    ],
    highlighted: false,
    badge: null,
    detailedFeatures: [
      { category: "Design", icon: Palette, items: ["Template personnalise", "Responsive mobile/tablet", "Integration logo et charte graphique"] },
      { category: "Fonctionnalites", icon: Code, items: ["5 pages maximum", "Formulaire de contact", "Galerie photos", "Google Maps"] },
      { category: "SEO & Performance", icon: Zap, items: ["Optimisation SEO de base", "Vitesse de chargement optimisee", "SSL inclus"] },
    ],
    deliveryTime: "2-3 semaines",
    revisions: "2 revisions incluses",
    support: "Support email"
  },
  {
    id: "business",
    name: "Business",
    subtitle: "Le plus populaire",
    price: "24 900",
    period: "unique",
    description: "La solution complete pour les PME qui veulent se demarquer et developper leur activite.",
    features: [
      "Site jusqu'a 15 pages",
      "Design premium sur mesure",
      "Blog integre",
      "Integration reseaux sociaux",
      "SEO avance",
      "Analytics dashboard",
      "Hebergement 1 an inclus",
      "Support email",
    ],
    highlighted: true,
    badge: "Plus populaire",
    detailedFeatures: [
      { category: "Design", icon: Palette, items: ["Design sur mesure", "Animations avancees", "Responsive parfait", "Maquettes Figma fournies"] },
      { category: "Fonctionnalites", icon: Code, items: ["15 pages", "Blog integre", "Newsletter", "Espace admin CMS", "Multilingue (2 langues)"] },
      { category: "SEO & Marketing", icon: Zap, items: ["SEO avance", "Google Analytics", "Search Console", "Schema markup"] },
      { category: "Support", icon: Headphones, items: ["Formation 2h incluse", "Support email"] },
    ],
    deliveryTime: "4-6 semaines",
    revisions: "5 revisions incluses",
    support: "Support email"
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    subtitle: "Vendez en ligne",
    price: "49 900",
    period: "unique",
    description: "Boutique en ligne cle en main avec toutes les fonctionnalites pour vendre efficacement.",
    features: [
      "Boutique complete illimitee",
      "Gestion des stocks",
      "Paiements securises",
      "Multi-devises",
      "Integration transporteurs",
      "Dashboard vendeur",
      "Formation incluse",
      "Support dedie 24/7",
    ],
    highlighted: false,
    badge: null,
    detailedFeatures: [
      { category: "Boutique", icon: Globe, items: ["Produits illimites", "Categories et filtres", "Variantes produits", "Wishlist", "Comparateur"] },
      { category: "Paiements", icon: Shield, items: ["CMI / Visa / Mastercard", "Paiement a la livraison", "Virement bancaire", "Paiements securises SSL"] },
      { category: "Gestion", icon: Database, items: ["Gestion stocks", "Suivi commandes", "Factures auto", "Rapports ventes", "Export comptable"] },
      { category: "Livraison", icon: Zap, items: ["Multi-transporteurs", "Calcul frais auto", "Suivi colis", "Zones de livraison"] },
    ],
    deliveryTime: "6-8 semaines",
    revisions: "Revisions illimitees",
    support: "Support dedie 24/7"
  },
  {
    id: "enterprise",
    name: "Devis",
    subtitle: "Solutions sur mesure",
    price: "69 900",
    period: "DHS unique",
    description: "Pour les projets complexes necessitant une approche personnalisee et des fonctionnalites avancees.",
    features: [
      "Application web sur mesure",
      "API & integrations",
      "Architecture scalable",
      "Securite renforcee",
      "SLA garanti",
      "Equipe dediee",
      "Formation & documentation",
      "Support premium illimite",
    ],
    highlighted: false,
    badge: "Premium",
    detailedFeatures: [
      { category: "Developpement", icon: Code, items: ["Application sur mesure", "API REST/GraphQL", "Integrations tierces", "Microservices"] },
      { category: "Infrastructure", icon: Database, items: ["Architecture cloud", "Haute disponibilite", "Backup automatise", "CDN mondial"] },
      { category: "Securite", icon: Shield, items: ["Audit securite", "Tests penetration", "Conformite RGPD", "Chiffrement donnees"] },
      { category: "Accompagnement", icon: Users, items: ["Chef de projet dedie", "Documentation technique", "Formation equipes", "SLA 99.9%"] },
    ],
    deliveryTime: "A definir",
    revisions: "Illimitees",
    support: "Support premium 24/7"
  },
]

interface PackageModalProps {
  pkg: Package | null
  isOpen: boolean
  onClose: () => void
}

function PackageModal({ pkg, isOpen, onClose }: PackageModalProps) {
  if (!isOpen || !pkg) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              {pkg.badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-3">
                  {pkg.highlighted ? <Star className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                  {pkg.badge}
                </span>
              )}
              <h3 className="text-3xl font-bold">{pkg.name}</h3>
              <p className="text-muted-foreground">{pkg.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold gradient-text">{pkg.price}</div>
              {pkg.period && <div className="text-sm text-muted-foreground">DHS - Paiement {pkg.period}</div>}
            </div>
          </div>

          <p className="text-muted-foreground mb-8">{pkg.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">{pkg.deliveryTime}</div>
              <div className="text-xs text-muted-foreground">Delai</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">{pkg.revisions}</div>
              <div className="text-xs text-muted-foreground">Revisions</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Headphones className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">{pkg.support}</div>
              <div className="text-xs text-muted-foreground">Support</div>
            </div>
          </div>

          {/* Detailed Features */}
          <div className="space-y-6 mb-8">
            {pkg.detailedFeatures.map((category, idx) => (
              <div key={idx} className="glass rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg">{category.category}</h4>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="w-full glow" size="lg">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PackagesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleOrderPack = (pkg: Package) => {
    setSelectedPackage(pkg)
    setIsOrderModalOpen(true)
  }

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false)
    setSelectedPackage(null)
  }

  const handleOrderComplete = (pkg: Package) => {
    console.log('Commande terminée pour le pack:', pkg.name)
  }

  return (
    <section id="packs" ref={sectionRef} className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Nos Packs
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 text-balance">
            Des offres{' '}
            <span className="gradient-text">transparentes</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Choisissez le pack qui correspond à vos besoins. Tous nos prix sont fixes et sans surprise.
          </p>
        </div>

        {/* Creation packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={cn(
                "relative glass rounded-2xl p-6 flex flex-col transition-all duration-500 hover:scale-[1.02]",
                pkg.highlighted && "ring-2 ring-primary glow",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center gap-1">
                  {pkg.highlighted ? <Star className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                  {pkg.badge}
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6 pt-2">
                <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">{pkg.subtitle}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold gradient-text">{pkg.price}</span>
                  {pkg.period && <span className="text-muted-foreground">DHS</span>}
                </div>
                {pkg.period && (
                  <span className="text-sm text-muted-foreground">Paiement {pkg.period}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
                {pkg.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {pkg.features.length > 5 && (
                  <li className="text-sm text-primary font-medium">
                    + {pkg.features.length - 5} autres avantages
                  </li>
                )}
              </ul>

              {/* CTA */}
              <div className="space-y-2">
                <Button 
                  className={cn(
                    "w-full group",
                    pkg.highlighted && "glow"
                  )}
                  onClick={() => pkg.id === "enterprise" && pkg.name === "Devis" ? window.location.href = '/devis' : handleOrderPack(pkg)}
                  variant={pkg.highlighted ? "default" : "outline"}
                >
                  {pkg.id === "enterprise" && pkg.name === "Devis" ? "Demander un devis" : "Commander ce pack"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  className={cn(
                    "w-full group",
                    pkg.highlighted && "glow"
                  )}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  Voir les détails
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom quote CTA */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-muted-foreground mb-4">
            Besoin d&apos;une solution personnalisee ?
          </p>
          <Link href="/devis">
            <Button size="lg" variant="outline" className="group">
              Demander un devis sur mesure
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <PackageModal 
        pkg={selectedPackage} 
        isOpen={!!selectedPackage} 
        onClose={() => setSelectedPackage(null)} 
      />
      <PackOrderModal 
        pkg={selectedPackage} 
        isOpen={isOrderModalOpen} 
        onClose={handleCloseOrderModal}
        onOrder={handleOrderComplete}
      />
    </section>
  )
}
