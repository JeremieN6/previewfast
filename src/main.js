import { createApp } from 'vue'
import App from './App.vue'

// Import Tailwind CSS
import './style.css'

// Import CSS existants (dans le même ordre que l'original)
import '/styles.css'
import '/styles/designer-shell.css'
import '/designs/design-1/design-1.layout.css'
import '/designs/design-2/design-2.layout.css'
import '/designs/design-3/design-3.layout.css'
import '/designs/design-4/design-4.layout.css'
import '/designs/design-5/design-5.layout.css'
import '/designs/design-6/design-6.layout.css'
import '/designs/design-7/design-7.layout.css'

const app = createApp(App)
app.mount('#app')
