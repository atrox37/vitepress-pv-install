<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRouter, inBrowser } from 'vitepress'

const { lang } = useData()
const router = useRouter()

const isEnglish = computed(() => (lang.value || '').toLowerCase().startsWith('en'))

const switchLanguage = () => {
  if (!inBrowser) return
  
  const currentPath = window.location.pathname
  const currentSearch = window.location.search
  let targetPath = ''
  
  if (isEnglish.value) {
    // Switch to Chinese
    if (currentPath.startsWith('/video-library') || currentPath.startsWith('/cn/video-library')) {
      targetPath = '/cn/video-library/'
    } else {
      targetPath = '/cn/'
    }
  } else {
    // Switch to English
    if (currentPath.startsWith('/cn/video-library') || currentPath.startsWith('/video-library')) {
      targetPath = '/video-library/'
    } else {
      targetPath = '/'
    }
  }
  
  // Preserve video parameter if exists
  const urlParams = new URLSearchParams(currentSearch)
  const videoId = urlParams.get('video')
  if (videoId) {
    targetPath += `?video=${videoId}`
  }
  
  router.go(targetPath)
}

const currentLang = computed(() => isEnglish.value ? 'EN' : '中文')
const targetLang = computed(() => isEnglish.value ? '中文' : 'EN')
</script>

<template>
  <button class="language-switcher" @click="switchLanguage" :aria-label="`Switch to ${targetLang}`">
    <span class="current-lang">{{ currentLang }}</span>
    <span class="separator">/</span>
    <span class="target-lang">{{ targetLang }}</span>
  </button>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  color: white;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  backdrop-filter: blur(10px);
  line-height: 1.2;
}

.language-switcher:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

.current-lang {
  color: white;
  font-weight: 600;
}

.separator {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 1px;
}

.target-lang {
  color: rgba(255, 255, 255, 0.9);
}

.language-switcher:hover .target-lang {
  color: white;
}
</style>

