<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useData, inBrowser, withBase, useRouter } from 'vitepress'
import VideoPlayer from './VideoPlayer.vue'
import VideoList from './VideoList.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { lang } = useData()
const router = useRouter()
const isEnglish = computed(() => (lang.value || '').toLowerCase().startsWith('en'))

const videosData = ref<any>(null)
const currentVideo = ref<any>(null)
const currentStepId = ref<string>('')
const isLoading = ref(true)

// Get videos for the currently selected step only
const allVideos = computed(() => {
  if (!videosData.value || !currentStepId.value) return []
  
  // Find the current step
  const currentStep = videosData.value.steps.find((step: any) => step.id === currentStepId.value)
  if (!currentStep) return []
  
  const videos: any[] = []
  
  // Check if step has sub-steps
  if (currentStep.subSteps && currentStep.subSteps.length > 0) {
    // If there are sub-steps, check if main step video URL matches any sub-step
    const mainStepVideoUrl = currentStep.videoUrl
    const hasDuplicateUrl = currentStep.subSteps.some((subStep: any) => subStep.videoUrl === mainStepVideoUrl)
    
    // Only add main step video if it doesn't duplicate a sub-step video
    // AND if the main step has a different video URL (not empty)
    if (!hasDuplicateUrl && mainStepVideoUrl) {
      videos.push(currentStep)
    }
    // Add all sub-step videos
    videos.push(...currentStep.subSteps)
  } else {
    // No sub-steps, only add main step video
    videos.push(currentStep)
  }
  
  return videos
})

// Get main steps for the step tabs
const mainSteps = computed(() => {
  return videosData.value?.steps || []
})

const currentVideoId = computed(() => {
  return currentVideo.value?.id || ''
})

const selectStep = (step: any) => {
  // Select the step's first available video
  currentStepId.value = step.id
  
  // If step has sub-steps, prefer the first sub-step
  // Otherwise use the main step video
  if (step.subSteps && step.subSteps.length > 0) {
    // Check if main step video URL matches any sub-step
    const mainStepVideoUrl = step.videoUrl
    const hasDuplicateUrl = step.subSteps.some((subStep: any) => subStep.videoUrl === mainStepVideoUrl)
    
    // If main step video doesn't duplicate, use it; otherwise use first sub-step
    if (!hasDuplicateUrl && mainStepVideoUrl) {
      currentVideo.value = step
    } else {
      currentVideo.value = step.subSteps[0]
    }
  } else {
    currentVideo.value = step
  }
  
  // Update URL with video ID
  if (inBrowser) {
    const url = new URL(window.location.href)
    url.searchParams.set('video', currentVideo.value.id)
    window.history.pushState({}, '', url.toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const selectVideo = (video: any) => {
  currentVideo.value = video
  // Update current step ID based on video
  if (video.id.startsWith('step-') && !video.id.includes('-')) {
    // This is a main step
    currentStepId.value = video.id
  } else {
    // This is a sub-step, find parent step
    for (const step of videosData.value.steps) {
      if (step.id === video.id || (step.subSteps && step.subSteps.some((s: any) => s.id === video.id))) {
        currentStepId.value = step.id
        break
      }
    }
  }
  // Update URL with video ID
  if (inBrowser) {
    const url = new URL(window.location.href)
    url.searchParams.set('video', video.id)
    window.history.pushState({}, '', url.toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Find video by ID
const findVideoById = (videoId: string): any => {
  if (!videosData.value) return null
  
  for (const step of videosData.value.steps) {
    if (step.id === videoId) {
      return step
    }
    if (step.subSteps) {
      for (const subStep of step.subSteps) {
        if (subStep.id === videoId) {
          return subStep
        }
      }
    }
  }
  return null
}

const loadVideosData = async () => {
  try {
    const response = await fetch(withBase('/video-library/data/videos.json'))
    const data = await response.json()
    videosData.value = data
    
    // Check URL for video parameter
    if (inBrowser) {
      const urlParams = new URLSearchParams(window.location.search)
      const videoId = urlParams.get('video')
      
      if (videoId) {
        const video = findVideoById(videoId)
        if (video) {
          currentVideo.value = video
          // Set current step ID
          if (video.id.startsWith('step-') && !video.id.includes('-')) {
            currentStepId.value = video.id
          } else {
            // Find parent step
            for (const step of data.steps) {
              if (step.id === video.id || (step.subSteps && step.subSteps.some((s: any) => s.id === video.id))) {
                currentStepId.value = step.id
                break
              }
            }
          }
        } else {
          // If video not found, use first available video
          if (data.steps && data.steps.length > 0) {
            const firstStep = data.steps[0]
            currentStepId.value = firstStep.id
            // If step has sub-steps, prefer first sub-step; otherwise use main step
            if (firstStep.subSteps && firstStep.subSteps.length > 0) {
              const mainStepVideoUrl = firstStep.videoUrl
              const hasDuplicateUrl = firstStep.subSteps.some((subStep: any) => subStep.videoUrl === mainStepVideoUrl)
              if (!hasDuplicateUrl && mainStepVideoUrl) {
                currentVideo.value = firstStep
              } else {
                currentVideo.value = firstStep.subSteps[0]
              }
            } else {
              currentVideo.value = firstStep
            }
          }
        }
      } else {
        // No video parameter, use first available video
        if (data.steps && data.steps.length > 0) {
          const firstStep = data.steps[0]
          currentStepId.value = firstStep.id
          // If step has sub-steps, prefer first sub-step; otherwise use main step
          if (firstStep.subSteps && firstStep.subSteps.length > 0) {
            const mainStepVideoUrl = firstStep.videoUrl
            const hasDuplicateUrl = firstStep.subSteps.some((subStep: any) => subStep.videoUrl === mainStepVideoUrl)
            if (!hasDuplicateUrl && mainStepVideoUrl) {
              currentVideo.value = firstStep
            } else {
              currentVideo.value = firstStep.subSteps[0]
            }
          } else {
            currentVideo.value = firstStep
          }
        }
      }
    } else {
      // SSR: use first available video
      if (data.steps && data.steps.length > 0) {
        const firstStep = data.steps[0]
        currentStepId.value = firstStep.id
        // If step has sub-steps, prefer first sub-step; otherwise use main step
        if (firstStep.subSteps && firstStep.subSteps.length > 0) {
          const mainStepVideoUrl = firstStep.videoUrl
          const hasDuplicateUrl = firstStep.subSteps.some((subStep: any) => subStep.videoUrl === mainStepVideoUrl)
          if (!hasDuplicateUrl && mainStepVideoUrl) {
            currentVideo.value = firstStep
          } else {
            currentVideo.value = firstStep.subSteps[0]
          }
        } else {
          currentVideo.value = firstStep
        }
      }
    }
  } catch (error) {
    console.error('Failed to load videos data:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch for URL changes (e.g., browser back/forward)
if (inBrowser) {
  window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search)
    const videoId = urlParams.get('video')
    if (videoId && videosData.value) {
      const video = findVideoById(videoId)
      if (video) {
        currentVideo.value = video
      }
    }
  })
}

onMounted(() => {
  loadVideosData()
})
</script>

<template>
  <div class="video-library">
    <!-- Header -->
    <header class="video-library-header">
      <div class="header-top">
        <div class="logo-section">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20" class="logo-icon">
            <path d="M13 3L4 14v7h6v-6h6v6h6v-7L13 3z" fill="#ff6900" />
          </svg>
          <span class="logo-name">Voltage MGS Video Library</span>
        </div>
        <LanguageSwitcher />
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ isEnglish ? 'Loading videos...' : '加载视频中...' }}</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="currentVideo" class="video-library-content">
      <VideoPlayer :video="currentVideo" />
      
      <!-- Step Navigation Tabs -->
      <div class="step-tabs">
        <div
          v-for="step in mainSteps"
          :key="step.id"
          class="step-tab"
          :class="{ 'is-active': currentStepId === step.id }"
          @click="selectStep(step)"
        >
          {{ step.title[isEnglish ? 'en' : 'zh'] }}
        </div>
      </div>

      <!-- Video List -->
      <div class="video-list-container">
        <VideoList :videos="allVideos" :current-video-id="currentVideoId" @select-video="selectVideo" />
      </div>

      <!-- Tip -->
      <!-- <div class="video-tip">
        {{ isEnglish 
          ? "Tip: If you can't play a video, try switching networks or opening in Safari/Chrome."
          : '提示：如果无法播放视频，请尝试切换网络或在 Safari/Chrome 中打开。' }}
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.video-library {
  min-height: 100vh;
  background: #ffffff;
  padding: 0;
  position: relative;
}

.video-library-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #15335f 0%, #15335f 50%, #ff6900 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  flex-shrink: 0;
}

.logo-name {
  font-size: 16px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: rgba(0, 0, 0, 0.6);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(21, 51, 95, 0.3);
  border-top-color: #15335f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.video-library-content {
  padding-top: 57px;
  padding-bottom: 20px;
}

.video-list-container {
  padding: 10px 20px; 
}

/* Step Tabs */
.step-tabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding: 0 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.step-tabs::-webkit-scrollbar {
  display: none;
}

.step-tab {
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.25s;
  flex-shrink: 0;
  position: relative;
}

.step-tab:hover {
  color: rgba(0, 0, 0, 0.8);
}

.step-tab.is-active {
  color: #15335f;
  font-weight: 600;
  border-bottom-color: #15335f;
}


.video-tip {
  margin: 20px;
  padding: 12px 16px;
  background: rgba(21, 51, 95, 0.08);
  border-left: 3px solid #ff6900;
  border-radius: 4px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.5;
}
</style>
