-- Création de la table des packs
CREATE TABLE IF NOT EXISTS packs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subtitle TEXT,
  price VARCHAR(50) NOT NULL,
  period VARCHAR(50),
  description TEXT,
  features TEXT[],
  highlighted BOOLEAN DEFAULT FALSE,
  badge VARCHAR(255),
  detailed_features JSONB,
  delivery_time VARCHAR(100),
  revisions VARCHAR(100),
  support VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création d'index
CREATE INDEX IF NOT EXISTS idx_packs_name ON packs(name);
CREATE INDEX IF NOT EXISTS idx_packs_highlighted ON packs(highlighted);

-- Insertion des packs par défaut
INSERT INTO packs (name, subtitle, price, period, description, features, highlighted, badge, detailed_features, delivery_time, revisions, support) VALUES
('Starter', 'Pack de démarrage', '1490', 'en une fois', 'Pack idéal pour les petites entreprises et les startups', 
 ARRAY['Site vitrine', 'Design responsive', 'Pages illimitées', 'Formulaire de contact'], 
 FALSE, NULL,
 '[{"category": "Design", "icon": "Palette", "items": ["Design moderne et professionnel", "Interface utilisateur intuitive", "Optimisation mobile"]}, {"category": "Développement", "icon": "Code", "items": ["Code HTML/CSS/JS propre", "Compatibilité navigateurs", "Performance optimisée"]}]',
 '2-3 semaines', '2 révisions incluses', 'Support email 6 mois'),
('Business', 'Pack professionnel', '2490', 'en une fois', 'Pack complet pour les entreprises qui souhaitent se développer en ligne',
 ARRAY['Site vitrine avancé', 'CMS intégré', 'SEO optimisé', 'Analytics', 'Multilingue'], 
 TRUE, 'POPULAIRE',
 '[{"category": "Design", "icon": "Palette", "items": ["Design sur mesure", "Charte graphique", "Animation et transitions"]}, {"category": "Développement", "icon": "Code", "items": ["CMS WordPress/Custom", "Base de données", "API REST"]}, {"category": "SEO", "icon": "Database", "items": ["SEO technique", "Méta-tags optimisés", "Google Analytics"]}]',
 '3-4 semaines', '3 révisions incluses', 'Support prioritaire 1 an'),
('E-commerce', 'Boutique en ligne', '4990', 'en une fois', 'Solution e-commerce complète pour vendre vos produits en ligne',
 ARRAY['Boutique complète', 'Paiement sécurisé', 'Gestion stocks', 'Dashboard admin', 'Mobile app'],
 TRUE, 'RECOMMANDÉ',
 '[{"category": "E-commerce", "icon": "Globe", "items": ["Catalogue produits", "Panier et commande", "Passerelle de paiement", "Gestion des stocks"]}, {"category": "Admin", "icon": "Database", "items": ["Tableau de bord", "Gestion commandes", "Analytics ventes", "CRM intégré"]}]',
 '4-6 semaines', 'Révisions illimitées', 'Support dédié 2 ans'),
('Enterprise', 'Solution sur mesure', '7990', 'en une fois', 'Solution enterprise personnalisée avec fonctionnalités avancées',
 ARRAY['Application web complète', 'API avancées', 'Intégrations ERP', 'Sécurité renforcée', 'Cloud hosting'],
 TRUE, 'PREMIUM',
 '[{"category": "Architecture", "icon": "Database", "items": ["Microservices", "Architecture scalable", "Load balancing", "CDN intégré"]}, {"category": "Sécurité", "icon": "Shield", "items": ["SSL/TLS", "Authentification 2FA", "Audit sécurité", "Backup automatique"]}, {"category": "Intégration", "icon": "Globe", "items": ["API REST/GraphQL", "Webhooks", "Intégrations ERP/CRM", "Services cloud"]}]',
 '6-8 semaines', 'Révisions illimitées', 'Support 24/7 3 ans') ON CONFLICT DO NOTHING;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_packs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_packs_updated_at 
    BEFORE UPDATE ON packs 
    FOR EACH ROW EXECUTE FUNCTION update_packs_updated_at();
