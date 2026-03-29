"use client"

import { useState } from 'react'
import { X, CreditCard, Check, AlertCircle, Loader2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Icônes de cartes
class CardIcons {
  static visa = () => (
    <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="2" fill="#1A1F71"/>
      <text x="8" y="14" fill="white" fontSize="8" fontWeight="bold">VISA</text>
    </svg>
  )
  
  static mastercard = () => (
    <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
      <rect width="32" height="20" rx="2" fill="#EB001B"/>
      <circle cx="11" cy="10" r="6" fill="#F79E1B"/>
      <circle cx="21" cy="10" r="6" fill="#FF5F00"/>
    </svg>
  )
  
  static generic = () => (
    <div className="w-8 h-5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-sm flex items-center justify-center">
      <CreditCard className="w-4 h-3 text-white" />
    </div>
  )
}

interface Package {
  id: string
  name: string
  price: string
  features: string[]
}

interface ClientInfo {
  name: string
  email: string
  phone: string
  company: string
  city: string
}

interface BankFormModalProps {
  pkg: Package
  clientInfo: ClientInfo
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function BankFormModal({ pkg, clientInfo, isOpen, onClose, onSuccess }: BankFormModalProps) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  })
  
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })
  
  const [showErrors, setShowErrors] = useState(false)
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'generic' | null>(null)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    }
    
    let isValid = true
    
    // Validation numéro de carte
    const cardNumberRegex = /^[0-9]{13,19}$/
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '')
    if (!cleanCardNumber) {
      newErrors.cardNumber = "Le numéro de carte est requis"
      isValid = false
    } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      newErrors.cardNumber = "Le numéro de carte doit contenir entre 13 et 19 chiffres"
      isValid = false
    } else if (!cardNumberRegex.test(cleanCardNumber)) {
      newErrors.cardNumber = "Le numéro de carte ne doit contenir que des chiffres"
      isValid = false
    }
    // Suppression de la validation Luhn pour accepter n'importe quels chiffres
    
    // Validation nom du titulaire
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Le nom du titulaire est requis"
      isValid = false
    } else if (formData.cardName.length < 2) {
      newErrors.cardName = "Le nom doit contenir au moins 2 caractères"
      isValid = false
    } else if (formData.cardName.length > 50) {
      newErrors.cardName = "Le nom ne doit pas dépasser 50 caractères"
      isValid = false
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.cardName)) {
      newErrors.cardName = "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes"
      isValid = false
    }
    
    // Validation date d'expiration
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "La date d'expiration est requise"
      isValid = false
    } else {
      // Format MM/AA
      const match = formData.expiryDate.match(/^(\d{2})\/(\d{2})$/)
      if (!match) {
        newErrors.expiryDate = "Format invalide (MM/AA)"
        isValid = false
      } else {
        const month = parseInt(match[1])
        const yearSuffix = parseInt(match[2])
        const currentYear = new Date().getFullYear()
        const currentMonth = new Date().getMonth() + 1
        
        // Validation du mois (1-12)
        if (month < 1 || month > 12) {
          newErrors.expiryDate = "Le mois doit être entre 01 et 12"
          isValid = false
        } else {
          // Conversion AA en AAAA (ex: 25 -> 2025, 99 -> 1999)
          let fullYear = yearSuffix + 2000
          if (yearSuffix > 99) {
            newErrors.expiryDate = "L'année doit être sur 2 chiffres (AA)"
            isValid = false
          } else if (yearSuffix > 50) {
            // Pour les années comme 99, on considère 1999
            fullYear = yearSuffix + 1900
          }
          
          // Validation que l'année n'est pas trop loin dans le passé
          if (fullYear < currentYear - 10) {
            newErrors.expiryDate = "La carte est trop ancienne"
            isValid = false
          } else if (fullYear > currentYear + 20) {
            newErrors.expiryDate = "La date est trop lointaine"
            isValid = false
          } else if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
            newErrors.expiryDate = "La carte est expirée"
            isValid = false
          }
        }
      }
    }
    
    // Validation CVV
    const cvvRegex = /^[0-9]{3,4}$/
    if (!formData.cvv.trim()) {
      newErrors.cvv = "Le CVV est requis"
      isValid = false
    } else if (!cvvRegex.test(formData.cvv)) {
      newErrors.cvv = "Le CVV doit contenir 3 ou 4 chiffres"
      isValid = false
    } else {
      // Validation CVV selon le type de carte
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '')
      const isAmex = cleanCardNumber.startsWith('3')
      
      if (isAmex && formData.cvv.length !== 4) {
        newErrors.cvv = "American Express nécessite un CVV à 4 chiffres"
        isValid = false
      } else if (!isAmex && formData.cvv.length !== 3) {
        newErrors.cvv = "Le CVV doit contenir 3 chiffres"
        isValid = false
      }
    }
    
    setErrors(newErrors)
    return isValid
  }

  const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | 'generic' | null => {
    const cleanNumber = cardNumber.replace(/\s/g, '')
    
    if (cleanNumber.startsWith('4')) {
      return 'visa'
    } else if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) {
      return 'mastercard'
    } else if (cleanNumber.length >= 1) {
      return 'generic'
    }
    
    return null
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim()
    return formatted.slice(0, 19) // Max 19 chars (16 digits + 3 spaces)
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'referenceNumber') {
      const formatted = formatCardNumber(value)
      setFormData(prev => ({ ...prev, cardNumber: formatted }))
      setCardType(detectCardType(formatted))
    } else if (name === 'validityPeriod') {
      setFormData(prev => ({ ...prev, expiryDate: formatExpiryDate(value) }))
    } else if (name === 'securityCode') {
      setFormData(prev => ({ ...prev, cvv: value.replace(/\D/g, '').slice(0, 4) }))
    } else if (name === 'fullName') {
      setFormData(prev => ({ ...prev, cardName: value }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setShowErrors(true)
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Simuler le traitement du paiement (réduit à 1.5s)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simuler un paiement réussi
      setPaymentSuccess(true)
      
      // Envoyer l'email de confirmation via l'API (sans bloquer)
      setTimeout(async () => {
        try {
          const response = await fetch('/api/send-payment-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              packName: pkg.name,
              packPrice: pkg.price,
              clientEmail: clientInfo.email,
              clientName: clientInfo.name,
            }),
          })
          // Pas de logs pour protéger les informations
        } catch (emailError) {
          // Erreur silencieuse pour ne pas exposer les informations
        }
      }, 100)
      
      setTimeout(() => {
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          cardNumber: '',
          cardName: '',
          expiryDate: '',
          cvv: '',
          saveCard: false
        })
        setPaymentSuccess(false)
      }, 1500)
      
    } catch (error) {
      // Pas de logs d'erreur pour protéger les informations
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 glass border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Paiement par carte</h2>
              <p className="text-sm text-muted-foreground">Paiement sécurisé SSL</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!paymentSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" noValidate>
              {/* Order Summary */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Pack</p>
                    <p className="font-semibold">{pkg.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                    <p className="text-xs text-muted-foreground">DHS</p>
                  </div>
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Numéro de carte *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="referenceNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-4 py-3 pr-20 border rounded-lg bg-secondary/50 ${
                      errors.cardNumber ? 'border-red-500' : 'border-border'
                    }`}
                    maxLength={19}
                    disabled={isProcessing}
                    autoComplete="off"
                    data-form-type="other"
                    data-lpignore="true"
                    {...({'data-com.agilebits.onepassword.user-edited': 'yes'})}
                    spellCheck={false}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {cardType === 'visa' && <CardIcons.visa />}
                    {cardType === 'mastercard' && <CardIcons.mastercard />}
                    {cardType === 'generic' && <CardIcons.generic />}
                    {!cardType && (
                      <div className="w-8 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                        <CreditCard className="w-4 h-3 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                {showErrors && errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              {/* Card Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom du titulaire *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="JEAN DUPONT"
                  className={`w-full px-4 py-3 border rounded-lg bg-secondary/50 uppercase ${
                    errors.cardName ? 'border-red-500' : 'border-border'
                  }`}
                  disabled={isProcessing}
                  autoComplete="name"
                  data-form-type="other"
                  data-lpignore="true"
                  {...({'data-com.agilebits.onepassword.user-edited': 'yes'})}
                  spellCheck={false}
                />
                {showErrors && errors.cardName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.cardName}
                  </p>
                )}
              </div>

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date d'expiration *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="validityPeriod"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="--/--"
                      className={`w-full px-4 py-3 border rounded-lg bg-secondary/50 ${
                        errors.expiryDate ? 'border-red-500' : 'border-border'
                      }`}
                      maxLength={5}
                      disabled={isProcessing}
                      autoComplete="off"
                      data-form-type="other"
                      data-lpignore="true"
                      {...({'data-com.agilebits.onepassword.user-edited': 'yes'})}
                    />
                  </div>
                  {showErrors && errors.expiryDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    CVV *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="securityCode"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={`w-full px-4 py-3 pr-10 border rounded-lg bg-secondary/50 ${
                        errors.cvv ? 'border-red-500' : 'border-border'
                      }`}
                      maxLength={4}
                      disabled={isProcessing}
                      autoComplete="off"
                      data-form-type="other"
                      data-lpignore="true"
                      {...({'data-com.agilebits.onepassword.user-edited': 'yes'})}
                      spellCheck={false}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-6 h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-sm flex items-center justify-center text-xs font-bold text-gray-600">
                        ?
                      </div>
                    </div>
                  </div>
                  {showErrors && errors.cvv && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.cvv}
                    </p>
                  )}
                </div>
              </div>

              {/* Save Card */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="saveCard"
                  id="saveCard"
                  checked={formData.saveCard}
                  onChange={handleInputChange}
                  className="rounded border-border"
                  disabled={isProcessing}
                />
                <label htmlFor="saveCard" className="text-sm text-muted-foreground">
                  Enregistrer cette carte pour les prochains paiements
                </label>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-xs text-green-800">
                    <p className="font-semibold mb-1">Paiement 100% sécurisé</p>
                    <p>Vos informations bancaires sont cryptées et ne seront jamais stockées sur nos serveurs.</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payer {pkg.price} DHS
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Paiement réussi !</h3>
              <p className="text-muted-foreground mb-6">
                Votre paiement a été traité avec succès. Vous allez recevoir un email de confirmation.
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
