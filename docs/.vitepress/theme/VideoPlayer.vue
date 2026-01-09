<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useData, withBase } from 'vitepress'

const props = defineProps<{
  video: {
    id: string
    title: { en: string; zh: string }
    description: { en: string; zh: string }
    videoUrl: string
    thumbnail?: string
    duration: string
    views: number
    downloads: number
    updated: string
    manualLink: string
  }
}>()

const { lang } = useData()
const isEnglish = computed(() => (lang.value || '').toLowerCase().startsWith('en'))

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const showControls = ref(true)
const controlsTimeout = ref<number | null>(null)
const isDescriptionExpanded = ref(false)

const title = computed(() => props.video.title[isEnglish.value ? 'en' : 'zh'])
const description = computed(() => props.video.description[isEnglish.value ? 'en' : 'zh'])

const toggleDescription = () => {
  isDescriptionExpanded.value = !isDescriptionExpanded.value
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const togglePlay = () => {
  if (!videoRef.value) return
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
}

const handleTimeUpdate = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
}

const handleLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}

const handleVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (videoRef.value) {
    videoRef.value.volume = parseFloat(target.value)
    volume.value = videoRef.value.volume
  }
}

const handleProgressClick = (e: MouseEvent) => {
  if (!videoRef.value) return
  const progressBar = e.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  videoRef.value.currentTime = percent * duration.value
}

const toggleFullscreen = () => {
  if (!videoRef.value) return
  if (!document.fullscreenElement) {
    videoRef.value.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const downloadVideo = async () => {
  try {
    // Try to download directly using fetch
    const response = await fetch(props.video.videoUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch video')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title.value.replace(/[<>:"/\\|?*]/g, '_')}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    // Fallback: open video URL in new tab (for CORS issues)
    console.warn('Direct download failed, opening video URL:', error)
    const link = document.createElement('a')
    link.href = props.video.videoUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const openManual = () => {
  window.open(withBase(props.video.manualLink), '_blank')
}

const showControlsTemporarily = () => {
  showControls.value = true
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
  controlsTimeout.value = window.setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

watch(() => props.video.id, () => {
  if (videoRef.value) {
    videoRef.value.load()
    isPlaying.value = false
    currentTime.value = 0
  }
})

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.addEventListener('play', () => {
      isPlaying.value = true
      showControlsTemporarily()
    })
    videoRef.value.addEventListener('pause', () => {
      isPlaying.value = false
      showControls.value = true
    })
  }
})

const ui = computed(() => ({
  download: isEnglish.value ? 'Download Video' : '下载视频',
  manual: isEnglish.value ? 'Online Manual' : '在线手册'
}))
</script>

<template>
  <div class="video-player-container">
    <!-- Video Player -->
    <div class="video-wrapper" @touchstart="showControlsTemporarily" @click="showControlsTemporarily">
      <video
        ref="videoRef"
        class="video-player"
        :poster="video.thumbnail"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @click.stop="togglePlay"
      >
        <source :src="video.videoUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <!-- Play Button Overlay -->
      <div v-if="showControls || !isPlaying" class="video-controls">
        <button class="play-button" @click.stop="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="white" width="64" height="64">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="white" width="48" height="48">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        </button>
      </div>

      <!-- Video Controls Bar -->
      <div class="video-controls-bar" v-if="showControls || !isPlaying">
        <div class="progress-bar" @click.stop="handleProgressClick">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        
        <div class="controls-row">
          <button class="control-btn" @click.stop="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
            <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </button>
          
          <span class="time-display">{{ formatTime(currentTime) }} / {{ video.duration }}</span>
          
          <div class="volume-control">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="volume"
              @input.stop="handleVolumeChange"
              class="volume-slider"
            />
          </div>
          
          <button class="control-btn" @click.stop="toggleFullscreen" aria-label="Fullscreen">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Video Info -->
    <div class="video-info">
      <h1 class="video-title">{{ title }}</h1>
      <div class="video-description-wrapper">
        <p class="video-description" :class="{ 'expanded': isDescriptionExpanded }">{{ description }}</p>
        <button v-if="description.length > 60" class="expand-btn" @click="toggleDescription" :aria-label="isDescriptionExpanded ? 'Collapse' : 'Expand'">
          <svg v-if="!isDescriptionExpanded" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
          </svg>
        </button>
      </div>
      
      <div class="video-meta">
        <span>Updated: {{ video.updated }}</span>
      </div>

      <div class="video-actions">
        <button class="btn-download" @click="downloadVideo">
          {{ ui.download }}
        </button>
        <button class="btn-manual" @click="openManual">
          {{ ui.manual }}
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-player-container {
  width: 100%;
  background: transparent;
}

.video-wrapper {
  position: relative;
  width: 100%;
  background: #000;
  aspect-ratio: 16 / 9;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
}

.video-controls {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.play-button {
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.play-button:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.video-controls-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 12px;
  z-index: 10;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #ff6900;
  border-radius: 2px;
  transition: width 0.1s;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.control-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.control-btn:hover {
  opacity: 0.8;
}

.time-display {
  font-size: 14px;
  color: white;
  min-width: 100px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.volume-slider {
  flex: 1;
  max-width: 100px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #ff6900;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #ff6900;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.video-info {
  padding: 16px 20px;
  background: transparent;
}

.video-title {
  font-size: 16px;
  font-weight: 700;
  color: #15335f;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.video-description-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.video-description {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all 0.3s;
}

.video-description.expanded {
  display: block;
  -webkit-line-clamp: unset;
}

.expand-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.25s;
  border-radius: 4px;
}

.expand-btn:hover {
  color: #15335f;
}

.video-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 14px;
}

.video-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-download {
  background: #15335f;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  flex: 1;
}

.btn-download:hover {
  background: #1f427a;
  transform: translateY(-1px);
}

.btn-manual {
  background: white;
  color: #15335f;
  border: 1px solid rgba(21, 51, 95, 0.2);
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.25s;
  flex: 1;
}

.btn-manual:hover {
  background: rgba(21, 51, 95, 0.05);
  border-color: rgba(21, 51, 95, 0.3);
}
</style>
