# previewfast - Vue.js Migration

## 🎯 Module 1 : Initialisation Vue.js + Tailwind + Flowbite

Ce projet a été initialisé avec **Vue 3 + Vite + Tailwind CSS + Flowbite** tout en conservant **strictement identique** le rendu visuel du HTML/CSS existant.

## 📦 Installation des dépendances

```powershell
npm install
```

## 🚀 Lancement en développement

```powershell
npm run dev
```

Le projet sera accessible sur http://localhost:3000

## 🏗️ Build pour production

```powershell
npm run build
```

## 📁 Structure du projet

```
previewfast/
├── index-vue.html          # Point d'entrée HTML pour Vue.js
├── src/
│   ├── App.vue             # Composant racine (contient tout le HTML existant)
│   ├── main.js             # Point d'entrée JavaScript
│   └── style.css           # Tailwind CSS directives
├── styles/
│   └── designer-shell.css  # CSS global (layout du site)
├── designs/
│   ├── design-1/design-1.layout.css
│   ├── design-2/design-2.layout.css
│   ├── design-3/design-3.layout.css
│   ├── design-4/design-4.layout.css
│   ├── design-5/design-5.layout.css
│   ├── design-6/design-6.layout.css
│   └── design-7/design-7.layout.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## ✅ Ce qui a été fait

### 1. ✅ Initialisation Vue.js avec Vite
- Configuration moderne et performante
- Hot Module Replacement (HMR)
- Build optimisé

### 2. ✅ Intégration Tailwind CSS
- Configuration avec `darkMode: 'class'`
- Ne modifie PAS les styles existants (CSS existant reste prioritaire)
- Utilisé uniquement pour le dark mode toggle

### 3. ✅ Intégration Flowbite UI
- Installé et configuré
- Prêt pour les futures modales et composants UI
- N'affecte PAS le rendu actuel

### 4. ✅ HTML existant intégré dans App.vue
- **Copié à 100% sans modification**
- Aucun refactor
- Aucune logique Vue (pas de v-if, v-for, etc.)
- Tout reste statique

### 5. ✅ CSS existants importés dans le bon ordre
```javascript
// main.js
import '../styles.css'
import '../styles/designer-shell.css'
import '../designs/design-1/design-1.layout.css'
// ... tous les autres designs
```

### 6. ✅ Dark mode toggle ajouté
- Bouton en bas à droite (comme QuickEsti)
- Sauvegarde dans localStorage
- Respect des préférences système
- Implémentation inspirée de ton projet QuickEsti

## 🎨 Dark Mode

Le dark mode est géré par :
1. Script inline dans `index-vue.html` (évite le flash)
2. Classe `.dark` sur `<html>`
3. localStorage pour persister le choix utilisateur
4. Bouton toggle en bas à droite de l'écran

## ⚠️ Important

### Rendu visuel
Le rendu final doit être **STRICTEMENT IDENTIQUE** à la version HTML/CSS originale.

### CSS prioritaire
L'ordre d'import garantit que les CSS existants restent prioritaires sur Tailwind :
1. `styles.css` (CSS de base)
2. `designer-shell.css` (global)
3. Design-specific CSS (1-7)
4. Tailwind (dernier, donc priorité la plus basse)

### Pas de logique Vue
Le HTML est 100% statique pour ce module. Les futures fonctionnalités (édition, modales, etc.) seront ajoutées dans les modules suivants.

## 🔄 Prochaines étapes (modules suivants)

1. Création des fichiers JSON de configuration par design
2. Composants Vue pour chaque design
3. Système de modales d'édition avec Flowbite
4. Logique d'édition (textes, couleurs, images)
5. Upload d'images
6. Export des previews

## 🐛 Vérification

Pour vérifier que le rendu est identique :
1. Ouvre l'ancien `index.html` dans un navigateur
2. Ouvre le nouveau projet Vue (`npm run dev`)
3. Compare visuellement les deux versions
4. Elles doivent être **pixel-perfect identiques**

Si tu constates des différences, signale-les immédiatement.

## 📝 Notes techniques

- **Vue 3** avec Composition API disponible (mais pas utilisé pour l'instant)
- **Vite** pour des temps de build ultra-rapides
- **Tailwind 3.4** avec dark mode class strategy
- **Flowbite 2.2** prêt pour les composants UI
- Tous les assets (images, mockups) restent au même emplacement
