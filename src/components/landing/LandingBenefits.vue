<template>
  <section id="benefits" class="bg-gray-100 dark:bg-gray-900">
    <div class="mx-auto max-w-screen-xl px-4 py-16 sm:py-24 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <p class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-200">
          Bénéfices clés
        </p>
        <h2 class="mt-4 text-3xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-4xl">
            Pourquoi les indie hackers et freelances créent leurs previews en 2 minutes au lieu de 3 jours
        </h2>
        <p class="mt-4 text-base text-gray-600 dark:text-gray-400">
            Chaque bénéfice ci-dessous répond à un problème concret : livrer vite, garder une qualité pro et arrêter de dépendre d'un designer pour chaque visuel.
        </p>
      </div>

      <div class="mt-12 grid gap-8 md:grid-cols-2">
        <article
          v-for="benefit in benefits"
          :key="benefit.id"
          class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-800/60"
        >
          <div class="flex items-center gap-3 text-blue-600 dark:text-blue-300">
            <span class="text-2xl">{{ benefit.emoji }}</span>
            <p class="text-sm font-semibold uppercase tracking-wide">{{ benefit.badge }}</p>
          </div>
          <h3 class="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
            {{ benefit.title }}
          </h3>
          <p class="mt-3 text-gray-600 dark:text-gray-300">
            {{ benefit.description }}
          </p>
          <p v-if="benefit.detail" class="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ benefit.detail }}
          </p>
          <ol v-if="benefit.steps" class="mt-5 space-y-3 text-gray-600 dark:text-gray-300">
            <li v-for="(step, index) in benefit.steps" :key="step" class="flex items-start gap-3">
              <span class="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {{ index + 1 }}
              </span>
              <span>{{ step }}</span>
            </li>
          </ol>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const benefits = [
  {
    id: 1,
    emoji: '⚡',
    badge: 'Livraison ultra-rapide',
    title: 'De 3 jours de design à 2 minutes',
    description:
      'Fini l\'attente d\'un designer, les allers-retours interminables et les délais qui s\'éternisent. Générez des previews professionnels en quelques clics, directement depuis vos templates.',
    detail:
      'Concrètement : livrez vos campagnes publicitaires, landing pages ou posts réseaux sociaux 10x plus vite. Plus besoin de bloquer votre roadmap en attendant les assets visuels.',
  },
  {
    id: 2,
    emoji: '🎨',
    badge: 'Qualité professionnelle',
    title: 'Des visuels qui claquent, sans designer',
    description:
      'Mockups parfaitement alignés, dégradés soignés, compositions harmonieuses : l\'outil génère automatiquement des visuels avec un rendu professionnel.',
    detail:
      'Le résultat : une image de marque premium pour vos projets, même avec un budget de 0€ en design. Vos clients ne verront jamais la différence avec du "fait main".',
  },
  {
    id: 3,
    emoji: '💰',
    badge: 'Budget maîtrisé',
    title: 'Divisez vos coûts de design par 10',
    description:
      'Un designer facture 500€-2000€ par set de visuels. Avec PreviewFast, produisez des dizaines de variantes pour le prix d\'un café par mois.',
    detail:
      'L\'économie : réinjectez votre budget design dans l\'acquisition, le développement ou votre trésorerie. Gardez le contrôle total sans dépendre d\'un freelance.',
  },
  {
    id: 4,
    emoji: '🔄',
    badge: 'Itération instantanée',
    title: 'Testez 10 variantes en 5 minutes',
    description:
      'Changez un fond, modifiez un texte, testez un nouveau screenshot : l\'outil régénère instantanément vos visuels. Parfait pour l\'A/B testing ou les pivots produit.',
    detail: 'En clair : vous gardez l\'agilité d\'une équipe tech sur votre production visuelle. Fini les semaines d\'attente pour tester une nouvelle baseline.',
    steps: [
      'Choisissez votre template (mockup mobile, landing, réseau social...)',
      'Uploadez vos screenshots et personnalisez les textes/couleurs',
      'Téléchargez vos visuels en HD, prêts à publier',
    ],
  },
]
</script>
