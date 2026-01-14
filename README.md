# Mockups for your app – Previewfast

Ce dossier contient une maquette HTML/CSS qui reproduit les captures de présentation style App Store visibles dans l'exemple fourni. Le but est d'offrir un canevas très simple à partir duquel vous pourrez remplacer les images et ajuster les textes tout en conservant la typographie, les couleurs et la structure.

## Structure

- `index.html` : markup principal (5 cartes mockup, titre et sous-titre).
- `styles.css` : styles globaux, gradients et frame iPhone.
- `placeholder-screenshot.svg` : fichier temporaire qui permet de visualiser l'espace dédié à vos captures d'écran.
- `mockup7.png` : ressource de référence issue du dossier d'origine.

## Comment visualiser

1. Ouvrez le fichier `mockup/index.html` directement dans votre navigateur (double clic ou glisser-déposer sur une fenêtre de navigateur).
2. Vous devriez voir les cinq cartes alignées avec un fond noir et un dégradé rose/jaune derrière chaque iPhone.

## Remplacer les captures

1. Exportez vos captures d'écran au format PNG/SVG avec un ratio proche de 1179×2556 (ratio iPhone 15 Pro).
2. Placez-les dans ce dossier puis, dans `index.html`, remplacez la valeur `./placeholder-screenshot.svg` par le fichier de votre choix pour chaque `<img>`.
3. Gardez la classe `phone-frame` pour préserver les bords et ombres.

## Modifier les textes

- Les textes se trouvent dans les éléments `<p class="caption">`. Changez simplement le contenu entre les balises pour mettre votre accroche.
- La typographie et la taille sont définies dans `styles.css`; laissez ces classes en place pour conserver la charte.

## Aller plus loin

- Dupliquez un bloc `<article class="mockup-card">` pour ajouter d'autres captures.
- Ajustez ou créez de nouveaux dégradés en copiant les règles `[data-theme="*"]` dans `styles.css`.
- Intégrez un petit formulaire/drag & drop plus tard pour automatiser l'upload.
