<template>
<section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <nav class="mb-6" aria-label="Fil d'ariane">
                <ol class="inline-flex flex-wrap items-center text-sm text-gray-600 gap-1 md:gap-2 dark:text-gray-300">
                    <li class="inline-flex items-center">
                        <RouterLink
                            to="/"
                            class="inline-flex items-center font-medium text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <svg class="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Accueil
                        </RouterLink>
                    </li>
                    <li class="flex items-center" aria-current="page">
                        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span class="ml-1 font-medium text-gray-500 dark:text-gray-400">Blog</span>
                    </li>
                </ol>
            </nav>
      <div class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
          <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Le Blog</h2>
          <p class="font-light text-gray-500 sm:text-xl dark:text-gray-400">Retrouvez les meilleurs conseils pour dans ces articles de blog.</p>
      </div> 
      <div class="grid gap-8 lg:grid-cols-2">
          <article v-for="article in articles" :key="article.slug" class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div class="flex justify-between items-center mb-5 text-gray-500">
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                    <svg class="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"></path><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path></svg>
                      Article
                  </span>
                  <span class="text-sm">Le {{ article.date }}</span>
              </div>
              <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">{{article.title}}</a></h2>
              <p class="mb-5 font-light text-gray-500 dark:text-gray-400">{{article.intro}}</p>
              <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-4">
                      <img class="w-7 h-7 rounded-full object-cover mr-0" src="../../assets/images/moi.webp" alt="Jeremie N. avatar" />
                      <span class="font-medium dark:text-white">
                          Jeremie N.
                      </span>
                  </div>
                  <RouterLink :to="{ name: 'BlogContent', params: { slug: article.slug } }">
                    <div class="inline-flex items-center font-medium bg-blue-600 text-white dark:text-white px-2 py-2 w-26 rounded-lg hover:underline">
                      Lire plus
                      <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  </div>
                  </RouterLink>
              </div>
          </article>                
      </div>  
  </div>
</section>

</template>

<script setup>
import { RouterLink } from 'vue-router';
import articles from '../../data/articles.json';
</script>