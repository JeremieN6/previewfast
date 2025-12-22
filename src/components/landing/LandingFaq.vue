<template>
  <section id="faq" class="bg-gray-100 dark:bg-gray-900">
    <div class="mx-auto max-w-screen-xl px-4 py-16 sm:py-20 lg:px-6">
      <h2 class="mb-8 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Questions fréquentes</h2>
      <div class="grid border-t border-gray-200 pt-8 text-left dark:border-gray-700 md:grid-cols-2 md:gap-16">
        <div>
          <article v-for="faq in leftColumn" :key="faq.question" class="mb-10 last:mb-0">
            <h3 class="mb-3 flex items-center text-lg font-medium text-gray-900 dark:text-white">
              <svg class="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              {{ faq.question }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">{{ faq.answer }}</p>
          </article>
        </div>
        <div>
          <article v-for="faq in rightColumn" :key="faq.question" class="mb-10 last:mb-0">
            <h3 class="mb-3 flex items-center text-lg font-medium text-gray-900 dark:text-white">
              <svg class="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              {{ faq.question }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">{{ faq.answer }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const faqs = [
  {
    question: 'PreviewFast remplace-t-il Figma ?',
    answer: 'Non. PreviewFast intervient après vos maquettes : importez vos screens exportés et nous gérons la mise en scène et l’export.'
  },
  {
    question: 'Puis-je utiliser mes propres templates ?',
    answer: 'Oui, ajoutez vos assets PNG dans la bibliothèque locale puis réutilisez-les dans tous vos projets.'
  },
  {
    question: 'Les exports sont-ils vraiment en haute résolution ?',
    answer: 'Nous utilisons dom-to-image-more avec un facteur 2x/3x selon l’appareil pour un rendu net sur les landing pages.'
  },
  {
    question: 'Le builder fonctionne-t-il hors ligne ?',
    answer: 'Le caching PWA arrive bientôt. Pour l’instant une connexion est nécessaire lors du chargement initial.'
  },
  {
    question: 'Puis-je collaborer avec mon équipe ?',
    answer: 'Oui, le plan Pro inclut le partage de variations et l’export ZIP prêt à envoyer à vos clients.'
  },
  {
    question: 'Que deviennent mes données ?',
    answer: 'Vos visuels restent sur votre machine, seules les préférences (thème, historique) sont stockées en localStorage.'
  }
]

const midpoint = Math.ceil(faqs.length / 2)
const leftColumn = faqs.slice(0, midpoint)
const rightColumn = faqs.slice(midpoint)
</script>
