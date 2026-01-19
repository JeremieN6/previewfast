<template>
    <section id="faq" class="bg-white dark:bg-gray-900">
        <div class="mx-auto max-w-screen-xl px-4 py-12 sm:py-20 lg:px-6">
            <div class="max-w-3xl">
                <p class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-200">FAQ</p>
                <h2 class="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Questions fréquentes</h2>
                <p class="mt-4 text-base text-gray-600 dark:text-gray-400">Tout ce qu'il faut savoir pour créer vos visuels marketing sans designer.</p>
            </div>
            <div class="mt-12 grid gap-10 border-t border-gray-200 pt-10 text-left md:grid-cols-2 md:gap-16 dark:border-gray-800">
                <article
                    v-for="faq in visibleFaqItems"
                    :key="faq.question"
                    class="space-y-4"
                >
                    <h3 class="flex items-start gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                        <span class="text-2xl" aria-hidden="true">{{ faq.icon }}</span>
                        <span>{{ faq.question }}</span>
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">{{ faq.answer }}</p>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const faqItems = [
    {
        icon: '🎨',
        question: 'Ça remplace Figma ou Canva ?',
        answer:
            'Non. L\'outil intervient après vos maquettes : vous exportez vos screenshots depuis Figma/XD, puis nous gérons la mise en scène dans des mockups mobiles professionnels. C\'est complémentaire, pas concurrent.'
    },
    {
        icon: '💰',
        question: 'Combien ça coûte vraiment ?',
        answer:
            'Version gratuite : 1 projet, 5 écrans max, 5 exports/mois avec watermark. Plan Pro à 9,90€/mois : jusqu\'à 10 écrans, exports HD illimités sans watermark, duplication, presets avancés. Pas de frais cachés.'
    },
    {
        icon: '📱',
        question: 'Quels types d\'écrans je peux créer ?',
        answer:
            'Mockups iOS/Android dans différents contextes : fonds colorés, dégradés, images personnalisées. Parfait pour l\'App Store, Product Hunt, landing pages, réseaux sociaux ou présentations clients.'
    },
    {
        icon: '⏱️',
        question: 'Combien de temps ça prend vraiment ?',
        answer:
            'Upload de 5 screenshots → choix du template → personnalisation textes/couleurs → export HD : environ 2 minutes chrono. Contre 2-3 jours si vous attendez un designer freelance.'
    },
    {
        icon: '🖼️',
        question: 'Les exports sont-ils vraiment en haute résolution ?',
        answer:
            'Oui. Nous exportons en PNG x2 (Retina) pour un rendu parfaitement net sur tous les supports : sites web, stores d\'applications, publicités Meta/Google, présentations clients.'
    },
    {
        icon: '🔄',
        question: 'Je peux modifier mes visuels après export ?',
        answer:
            'Absolument. Vos projets restent éditables : changez un screenshot, modifiez un texte, testez un nouveau fond et ré-exportez instantanément. Parfait pour l\'A/B testing ou les pivots produit.'
    },
    {
        icon: '🎯',
        question: 'Puis-je utiliser mes propres templates ?',
        answer:
            'Pour l\'instant, vous choisissez parmi nos templates ultra-modernes. La personnalisation complète (vos propres mockups, layouts custom) arrive bientôt en plan Pro. Inscrivez vous à la newsletter et contactez-nous pour être early-access.'
    },
    {
        icon: '👥',
        question: 'Puis-je collaborer avec mon équipe ?',
        answer:
            'Le plan Pro inclut l\'export ZIP pour partager facilement avec vos clients ou collègues. Le partage de projets en temps réel arrive prochainement. En attendant, exportez et envoyez vos assets en un clic.'
    },
    {
        icon: '🔒',
        question: 'Que deviennent mes screenshots et données ?',
        answer:
            'Vos visuels et screenshots restent sur votre machine, seules vos préférences (thème, templates favoris) sont stockées localement dans votre navigateur. Aucun upload sur nos serveurs, zéro risque de fuite.'
    },
    {
        icon: '💼',
        question: 'C\'est adapté pour des projets clients ou des pitchs ?',
        answer:
            'Totalement. Les visuels générés sont dignes d\'une agence design : parfaits pour présenter votre app à un investisseur, pitcher sur Product Hunt ou illustrer votre portfolio. Qualité professionnelle garantie.'
    },
    {
        icon: '🖥️',
        question: 'Je dois installer quelque chose ?',
        answer:
            'Non, zéro installation. L\'outil fonctionne 100% en ligne depuis Chrome, Firefox, Safari ou Edge. Vous pouvez bosser depuis n\'importe quel ordinateur, n\'importe où.'
    },
    {
        icon: '📲',
        question: 'Ça marche sur mobile/tablette ?',
        answer:
            'L\'outil est optimisé pour desktop où vous avez le meilleur confort d\'édition. Vous pouvez consulter vos projets sur mobile, mais nous recommandons un écran d\'ordinateur pour créer et exporter.'
    },
    {
        icon: '🚀',
        question: 'Le builder fonctionne-t-il hors ligne ?',
        answer:
            'Pas encore. Le mode PWA avec cache hors ligne arrive bientôt. Pour l\'instant, une connexion internet est nécessaire au chargement initial, puis l\'édition est ultra-rapide.'
    },
    {
        icon: '❓',
        question: 'Une autre question ?',
        answer:
            'Notre équipe est dispo pour vous aider. Contactez-nous via le chat intégré ou par email à contact-previewfast@sassify.fr et nous vous répondons sous 24h (souvent bien plus vite).'
    }
]

const visibleFaqItems = computed(() => faqItems.slice(0, 8))
</script>