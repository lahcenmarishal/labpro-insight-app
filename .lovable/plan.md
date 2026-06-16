# Expérience mobile premium — plan par lots

Pour livrer proprement sans casser l'app, je propose de découper en 3 lots livrables indépendamment. Dites-moi par lequel commencer (ou « tout dans l'ordre »).

---

## Lot 1 — Quick wins UX (rapide, faible risque)

1. **Supprimer le texte** « Total HT estimé : X €. Vous pouvez télécharger votre devis PDF. » dans le toast/notification d'envoi de devis (admin devis).
2. **Skeleton loaders** sur la grille produits + page catégorie : carte avec image / titre / prix / bouton, animation shimmer (via `src/components/ui/skeleton.tsx` déjà présent). Suppression des « Chargement... ».
3. **Safe areas iOS** : padding `env(safe-area-inset-*)` sur header, bottom nav, drawers.
4. **Désactivation du zoom involontaire** sur les inputs (`font-size: 16px` minimum + meta viewport `maximum-scale=1` côté mobile).
5. **Zones tactiles 44px min** sur les boutons icône (audit `size="icon"` → `h-11 w-11`).
6. **Vibration haptique** (`navigator.vibrate(10)`) sur ajout au devis / boutons clés.

## Lot 2 — Navigation premium

1. **Fiche produit en Bottom Sheet** sur mobile : nouveau composant `ProductSheet` basé sur `src/components/ui/drawer.tsx` (Vaul, swipe-to-close natif, snap 90vh, bouton X, animation fluide). Le clic carte ouvre la sheet au lieu de naviguer vers `/produit/:id` (la route reste accessible en deep-link/desktop). Conservation du scroll de la grille.
2. **Pull-to-Refresh** sur la grille produits mobile : hook `usePullToRefresh` custom (touchstart/move/end, threshold 70px, spinner animé en haut). Recharge via `router.invalidate()` / refetch React Query.
3. **Transitions de page** : wrapper `<PageTransition>` dans `__root.tsx` avec Framer Motion `AnimatePresence` (fade + slide 8px, 220ms). Pas de flash blanc (background app sur `<html>`).

## Lot 3 — PWA + Splash + Icônes

1. **Génération des icônes** à partir du logo Innova fourni (déjà sur CDN comme `innova-logo.png.asset.json`) :
   - Tailles : 72, 96, 128, 144, 152, 192, 384, 512, 1024 px (PNG fond blanc, padding sécurité).
   - Apple touch icon 180×180 + favicons 32/16.
   - Génération via `nix run nixpkgs#imagemagick` à partir du logo téléchargé depuis le CDN, puis upload via `lovable-assets`.
2. **`manifest.webmanifest`** : nom complet, short_name, theme_color (bleu marine du logo `#0c2340`), background_color blanc, `display: standalone`, toutes les icônes, `start_url: "/"`.
3. **Splash screen** : composant React `SplashScreen` overlay plein écran avec le logo centré + fade-in/out 600ms, masqué après hydratation + 400ms. Couleurs marque.  
   (Pas de service worker — l'utilisateur n'a pas demandé l'offline, et le guide PWA Lovable l'interdit en preview sauf demande explicite. Installable « Ajouter à l'écran d'accueil » via manifest uniquement.)
4. **Meta tags Apple** : `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`.

---

## Détails techniques notables

- **Bottom sheet** : Vaul (`drawer.tsx`) gère déjà swipe-to-close. La fiche produit actuelle (`src/routes/produit.$productId.tsx`) sera factorisée en `<ProductDetails productId={id} />` réutilisé par la route ET la sheet.
- **Pull-to-refresh** : pas de lib (overkill) — hook touch events + transform CSS. Désactivé si `scrollTop > 0`.
- **Transitions** : Framer Motion déjà dans `package.json` ? À vérifier ; sinon `bun add framer-motion`.
- **Pas de PWA offline** : pas de `vite-plugin-pwa`, pas de service worker (cf. règles preview Lovable). Manifest + meta uniquement = installable.

---

**Question :** je commence par **Lot 1** seul (le plus rapide, livrable maintenant), ou j'enchaîne **Lot 1 + 2**, ou les **3 lots d'affilée** (plus long, plus de risque de régression) ?