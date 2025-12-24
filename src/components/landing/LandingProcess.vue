<template>
  <!-- Default layout (visible) -->
  <section v-if="!useAltLayout" id="process" class="bg-gray-50 dark:bg-gray-800">
    <div class="mx-auto max-w-screen-xl px-4 py-16 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-200">
          Processus
        </p>
        <h2 class="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Comment obtenir des visuels dignes d'une agence en moins de 5 minutes
        </h2>
        <p class="mt-3 text-base text-gray-500 dark:text-gray-400">
            Suivez ces 3 étapes simples et téléchargez vos assets prêts pour l'App Store, Product Hunt ou vos campagnes Meta.
        </p>
      </div>

      <ol class="mt-12 items-center space-y-12 sm:flex sm:space-y-0 sm:space-x-0 sm:divide-x sm:divide-gray-200 dark:sm:divide-gray-700">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          class="relative flex-1 text-center sm:px-6"
        >
          <div class="flex items-center justify-center">
            <div class="z-10 flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-2xl font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-200">
              {{ step.id }}
            </div>
          </div>
          <div class="mt-6 space-y-2">
            <p class="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
              {{ step.label }}
            </p>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ step.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ step.description }}
            </p>
          </div>
          <div
            aria-hidden="true"
            :class="[
              'hidden sm:absolute sm:inset-y-8 sm:-right-3 sm:flex sm:w-px sm:bg-gray-200 dark:sm:bg-gray-700',
              index === steps.length - 1 ? 'sm:hidden' : ''
            ]"
          ></div>
        </li>
      </ol>
    </div>
  </section>

  <!-- Alternative layout (toggle useAltLayout to true to display) -->
  <section v-else id="process" class="bg-gradient-to-b from-white via-blue-50/60 to-white dark:from-gray-900 dark:via-gray-900/40 dark:to-gray-900">
    <div class="mx-auto max-w-screen-xl px-4 py-16 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-300">Processus</p>
        <h2 class="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Un parcours fluide pour transformer vos données en slides</h2>
        <p class="mt-4 text-base text-gray-600 dark:text-gray-400">Importer, paramétrer, livrer&nbsp;: tout est pensé pour gagner du temps et garder la maîtrise sur chaque étape.</p>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        <article
          v-for="(step, index) in steps"
          :key="step.id"
          class="rounded-2xl border border-gray-200 bg-white/80 p-6 text-left shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-800/70"
        >
          <div class="mb-4 flex items-center gap-4">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
              {{ index + 1 }}
            </span>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">{{ step.label }}</p>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ step.title }}</h3>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-300">{{ step.description }}</p>
          <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-900/60">
            <div class="flex items-center gap-3 text-gray-700 dark:text-gray-200">
              <span class="rounded-md bg-blue-600/10 p-2 text-blue-600 dark:text-blue-300">
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path :d="step.iconPath" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
              </span>
              <p class="text-sm font-medium">{{ step.caption }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const useAltLayout = false

const steps = [
  {
    id: '01',
    label: 'Étape 1',
    title: 'Upload',
    description: 'Glissez vos screenshots, nous détectons automatiquement l’appareil et le ratio.',
    caption: 'Drag & drop + détection intelligente',
    iconPath: 'M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z'
  },
  {
    id: '02',
    label: 'Étape 2',
    title: 'Choisir un template',
    description: 'Parcourez la collection iOS/Android, ajoutez du texte marketing et ajustez les couleurs en live.',
    caption: 'Templates ultra moderne inspirés des grandes marques',
    iconPath: 'M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z'
  },
  {
    id: '03',
    label: 'Étape 3',
    title: 'Export HD',
    description: 'Générez des PNG x2, partagez un lien ou envoyez un ZIP à vos clients.',
    caption: 'PNG, ZIP ou copié-collé',
    iconPath: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
  },
]
</script>
