<template>
    <section id="pricing" class="bg-white dark:bg-gray-900">
        <div class="mx-auto max-w-screen-xl px-4 py-16 lg:px-6 lg:py-24">
            <div class="mx-auto max-w-3xl text-center">
                <p class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-200">
                    Tarifs
                </p>
                <h2 class="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Deux plans, un même objectif&nbsp;: produire des slides impeccables en un clic</h2>
                <p class="mt-3 text-base text-gray-600 dark:text-gray-400">Choisissez la formule qui correspond à votre rythme de production. Passez au Pro quand vous avez besoin d’automatiser vos reportings récurrents et d’activer les capacités avancées.</p>
            </div>

            <div class="mt-12 grid gap-8 lg:grid-cols-2">
                <!-- Plan Starter -->
                <article class="flex flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:border-blue-200 dark:border-gray-800 dark:bg-gray-900">
                    <div class="flex flex-col items-start justify-between">
                        <div>
                            <p class="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Plan Free</p>
                            <h3 class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">Starter</h3>
                        </div>
                        <p class="text-right text-sm text-gray-500 dark:text-gray-400">Parfait pour tester l'outil et créer vos premiers visuels.</p>
                    </div>
                    <div class="mt-8 flex items-baseline gap-2 text-gray-900 dark:text-white">
                        <span class="text-4xl font-extrabold">0€</span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">/ mois</span>
                    </div>
                    <ul class="mt-8 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>1 projet actif</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Jusqu'à 5 écrans</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>5 exports / mois (SD)</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Presets limités</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l8 8M6 14L14 6" />
                            </svg>
                            <span>Pas de duplication d'écran</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l8 8M6 14L14 6" />
                            </svg>
                            <span>Pas d'application globale des changements</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l8 8M6 14L14 6" />
                            </svg>
                            <span>Watermark sur les exports</span>
                        </li>
                    </ul>
                    <a href="/atelier">
                        <button class="mt-8 w-full rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-white dark:hover:border-blue-500">Commencer gratuitement</button>
                    </a>
                </article>

                <!-- Plan PRO -->
                <article class="relative flex flex-col rounded-3xl border border-blue-300 bg-gradient-to-b from-blue-50 to-white p-8 shadow-2xl transition hover:-translate-y-1 dark:border-blue-700/50 dark:from-blue-900/40 dark:to-gray-900">
                    <span class="absolute right-6 top-6 inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Le plus populaire</span>
                    <div class="flex flex-col items-start justify-between">
                        <div>
                            <p class="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-200">Plan Pro</p>
                            <h3 class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">Pro</h3>
                        </div>
                        <p class="text-right text-sm text-gray-600 dark:text-gray-300">Idéal pour les freelances et petites équipes qui souhaitent des visuels professionnels.</p>
                    </div>
                    <div class="mt-8 flex items-baseline gap-2 text-gray-900 dark:text-white">
                        <span class="text-4xl font-extrabold">9,90€</span>
                        <span class="text-sm text-gray-500 dark:text-gray-300">/ mois</span>
                    </div>
                    <ul class="mt-8 space-y-4 text-sm text-gray-800 dark:text-gray-200">
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Jusqu'à 10 écrans par projet</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Duplication d'écran</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Application globale des changements</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Presets écran + design</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Exports illimités sans watermark</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Export HD (PNG x2)</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>Support prioritaire</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>
                                Plusieurs projets actifs
                                <span class="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">Bientôt</span>
                            </span>
                        </li>
                    </ul>
                    <button
                        class="mt-8 w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                        :disabled="isCheckoutLoading"
                        @click="redirectToCheckout"
                    >
                        <span v-if="isCheckoutLoading" class="flex items-center justify-center gap-2">
                            <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 1v4a7 7 0 00-7 7H4z" />
                            </svg>
                            Redirection vers Stripe…
                        </span>
                        <span v-else>Passer au plan Pro</span>
                    </button>
                    <p v-if="billingError" class="mt-3 text-center text-sm text-red-600 dark:text-red-300">
                        {{ billingError }}
                    </p>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { getAuthToken } from '../../services/authService'
import { showToast, TOAST_TYPE } from '../../utils/toast.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin

const isCheckoutLoading = ref(false)
const billingError = ref('')

const redirectToCheckout = async () => {
    if (isCheckoutLoading.value) return
    billingError.value = ''

    try {
        const token = getAuthToken()
        if (!token) {
            window.dispatchEvent(new CustomEvent('open-auth-modal'))
            return
        }

        isCheckoutLoading.value = true

        const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plan: 'pro' }),
        })

        const payload = await response.json().catch(() => null)
        if (!response.ok) {
            const detail = payload?.error || payload?.detail || 'Impossible de démarrer le paiement.'
            throw new Error(detail)
        }

        const url = payload?.url
        if (!url) {
            throw new Error('URL Stripe introuvable dans la réponse.')
        }
        window.location.href = url
    } catch (error) {
        const message = error?.message || 'Erreur inattendue.'
        billingError.value = message
        showToast({ message: `Abonnement impossible : ${message}`, type: TOAST_TYPE.ERROR })
    } finally {
        isCheckoutLoading.value = false
    }
}
</script>