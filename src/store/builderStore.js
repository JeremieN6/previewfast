import { computed, reactive } from 'vue'

const createId = () => Math.random().toString(36).slice(2, 10)

const defaultTextCards = [
  {
    id: createId(),
    title: 'Boost your KPIs',
    text: 'Screens that convert in under 5 minutes'
  },
  {
    id: createId(),
    title: 'Tell a better story',
    text: 'Mix copy + mockups for social-ready assets'
  }
]

const state = reactive({
  screenshots: [],
  textCards: defaultTextCards,
  selectedCategory: 'all',
  selectedTemplateId: null,
  overrides: {},
  logos: {},
  mockups: {},
  backgrounds: {}
})

const isValidImage = (file) => /image\/(png|jpe?g|webp|gif)$/i.test(file.type)

const makeScreenshot = (file) => ({
  id: createId(),
  file,
  name: file.name,
  url: URL.createObjectURL(file)
})

export function useBuilderStore() {
  const screenshotCount = computed(() => state.screenshots.length)

  const addScreenshots = (files) => {
    const incoming = Array.from(files).filter(isValidImage)
    if (!incoming.length) {
  return { ok: false, message: 'Formats acceptés: WEBP, PNG, JPG ou GIF.' }
    }

    const total = state.screenshots.length + incoming.length
    if (total > 12) {
      return { ok: false, message: 'Limite atteinte: 12 captures maximum.' }
    }

    incoming.forEach((file) => state.screenshots.push(makeScreenshot(file)))
    return { ok: true }
  }

  const removeScreenshot = (id) => {
    const index = state.screenshots.findIndex((shot) => shot.id === id)
    if (index !== -1) {
      URL.revokeObjectURL(state.screenshots[index].url)
      state.screenshots.splice(index, 1)
    }
  }

  const clearScreenshots = () => {
    state.screenshots.forEach((shot) => URL.revokeObjectURL(shot.url))
    state.screenshots.splice(0, state.screenshots.length)
  }

  const addTextCard = () => {
    state.textCards.push({ id: createId(), title: 'Nouveau titre', text: 'Texte à personnaliser' })
  }

  const updateTextCard = (id, payload) => {
    const card = state.textCards.find((item) => item.id === id)
    if (!card) return
    Object.assign(card, payload)
  }

  const duplicateTextCard = (id) => {
    const card = state.textCards.find((item) => item.id === id)
    if (!card) return
    state.textCards.push({ id: createId(), title: `${card.title} (copie)`, text: card.text })
  }

  const deleteTextCard = (id) => {
    if (state.textCards.length <= 1) return
    const index = state.textCards.findIndex((item) => item.id === id)
    if (index !== -1) {
      state.textCards.splice(index, 1)
    }
  }

  const setSelectedCategory = (category) => {
    state.selectedCategory = category
  }

  const setSelectedTemplateId = (templateId) => {
    state.selectedTemplateId = templateId
  }

  const closeModal = () => {
    state.selectedTemplateId = null
  }

  const setSlideOverride = (slideId, override) => {
    state.overrides[slideId] = {
      ...state.overrides[slideId],
      ...override
    }
  }

  const getSlideOverride = (slideId) => state.overrides[slideId] || null

  const setLogoAsset = (slideId, file) => {
    if (!file || !isValidImage(file)) {
      return { ok: false, message: 'Formats acceptés: WEBP, PNG, JPG ou GIF.' }
    }
    const current = state.logos[slideId]
    if (current) {
      URL.revokeObjectURL(current.url)
    }
    const asset = {
      id: createId(),
      file,
      name: file.name,
      url: URL.createObjectURL(file)
    }
    state.logos[slideId] = asset
    return { ok: true, asset }
  }

  const removeLogoAsset = (slideId) => {
    const current = state.logos[slideId]
    if (!current) return
    URL.revokeObjectURL(current.url)
    delete state.logos[slideId]
  }

  const getLogoAsset = (slideId) => state.logos[slideId] || null

  const setMockupAsset = (slideId, file) => {
    if (!file || !isValidImage(file)) {
      return { ok: false, message: 'Formats acceptés: WEBP, PNG, JPG ou GIF.' }
    }
    const current = state.mockups[slideId]
    if (current) {
      URL.revokeObjectURL(current.url)
    }
    const asset = {
      id: createId(),
      file,
      name: file.name,
      url: URL.createObjectURL(file)
    }
    state.mockups[slideId] = asset
    return { ok: true, asset }
  }

  const removeMockupAsset = (slideId) => {
    const current = state.mockups[slideId]
    if (!current) return
    URL.revokeObjectURL(current.url)
    delete state.mockups[slideId]
  }

  const getMockupAsset = (slideId) => state.mockups[slideId] || null

  const setBackgroundAsset = (slideId, file) => {
    if (!file || !isValidImage(file)) {
      return { ok: false, message: 'Formats acceptés: WEBP, PNG, JPG ou GIF.' }
    }
    const current = state.backgrounds[slideId]
    if (current) {
      URL.revokeObjectURL(current.url)
    }
    const asset = {
      id: createId(),
      file,
      name: file.name,
      url: URL.createObjectURL(file)
    }
    state.backgrounds[slideId] = asset
    return { ok: true, asset }
  }

  const removeBackgroundAsset = (slideId) => {
    const current = state.backgrounds[slideId]
    if (!current) return
    URL.revokeObjectURL(current.url)
    delete state.backgrounds[slideId]
  }

  const getBackgroundAsset = (slideId) => state.backgrounds[slideId] || null

  return {
    state,
    screenshotCount,
    addScreenshots,
    removeScreenshot,
    clearScreenshots,
    addTextCard,
    updateTextCard,
    duplicateTextCard,
    deleteTextCard,
    setSelectedCategory,
    setSelectedTemplateId,
    closeModal,
    setSlideOverride,
    getSlideOverride,
    setLogoAsset,
    removeLogoAsset,
    getLogoAsset,
    setMockupAsset,
    removeMockupAsset,
    getMockupAsset,
    setBackgroundAsset,
    removeBackgroundAsset,
    getBackgroundAsset
  }
}
