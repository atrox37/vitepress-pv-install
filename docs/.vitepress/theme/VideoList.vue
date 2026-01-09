<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  videos: Array<{
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
  }>
  currentVideoId: string
}>()

const emit = defineEmits<{
  (e: 'select-video', video: any): void
}>()

const { lang } = useData()
const isEnglish = computed(() => (lang.value || '').toLowerCase().startsWith('en'))

// Store video metadata (duration and thumbnail)
const videoMetadata = ref<Record<string, { duration: string; thumbnail: string }>>({})

const selectVideo = (video: any) => {
  emit('select-video', video)
}

const isCurrentVideo = (videoId: string) => {
  return props.currentVideoId === videoId
}

const formatNumber = (num: number) => {
  return num.toLocaleString()
}

// Format duration from seconds to MM:SS
const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return ''
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Get video thumbnail (try to get first frame, fallback to default)
const getVideoThumbnail = async (videoUrl: string, videoId: string): Promise<string> => {
  if (videoMetadata.value[videoId]?.thumbnail) {
    return videoMetadata.value[videoId].thumbnail
  }
  
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'
    
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0.1 // Seek to 0.1s to get a frame
    })
    
    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 320
        canvas.height = video.videoHeight || 180
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
          videoMetadata.value[videoId] = {
            ...videoMetadata.value[videoId],
            thumbnail
          }
          resolve(thumbnail)
        } else {
          resolve('/logo.png')
        }
      } catch (e) {
        resolve('/logo.png')
      }
      video.remove()
    })
    
    video.addEventListener('error', () => {
      resolve('/logo.png')
      video.remove()
    })
    
    video.src = videoUrl
  })
}

// Get video duration
const getVideoDuration = async (videoUrl: string, videoId: string): Promise<string> => {
  if (videoMetadata.value[videoId]?.duration) {
    return videoMetadata.value[videoId].duration
  }
  
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.addEventListener('loadedmetadata', () => {
      const duration = formatDuration(video.duration)
      videoMetadata.value[videoId] = {
        ...videoMetadata.value[videoId],
        duration
      }
      resolve(duration)
      video.remove()
    })
    
    video.addEventListener('error', () => {
      resolve('')
      video.remove()
    })
    
    video.src = videoUrl
  })
}

// Load metadata for all videos
const loadVideoMetadata = async () => {
  for (const video of props.videos) {
    if (!videoMetadata.value[video.id]) {
      // Load duration
      await getVideoDuration(video.videoUrl, video.id)
      // Load thumbnail
      await getVideoThumbnail(video.videoUrl, video.id)
    }
  }
}

// Get thumbnail for a video
const getThumbnail = (video: any): string => {
  return videoMetadata.value[video.id]?.thumbnail || video.thumbnail || '/logo.png'
}

// Get duration for a video
const getDuration = (video: any): string => {
  return videoMetadata.value[video.id]?.duration || video.duration || ''
}

onMounted(() => {
  loadVideoMetadata()
})

watch(() => props.videos, () => {
  loadVideoMetadata()
}, { deep: true })
</script>

<template>
  <div class="video-list">
    <div
      v-for="video in videos"
      :key="video.id"
      class="video-card"
      :class="{ 'is-current': isCurrentVideo(video.id) }"
      @click="selectVideo(video)"
    >
      <div class="video-thumbnail">
        <img :src="getThumbnail(video)" :alt="video.title[isEnglish ? 'en' : 'zh']" />
        <div class="play-overlay">
          <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div v-if="getDuration(video)" class="duration-badge">{{ getDuration(video) }}</div>
      </div>
      
      <div class="video-card-content">
        <h3 class="video-card-title">{{ video.title[isEnglish ? 'en' : 'zh'] }}</h3>
        <p class="video-card-description">{{ video.description[isEnglish ? 'en' : 'zh'] }}</p>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.video-card {
  display: flex;
  gap: 12px;
  background: rgba(21, 51, 95, 0.03);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.25s;
  border: 1px solid transparent;
}

.video-card:hover {
  background: rgba(21, 51, 95, 0.08);
  border-color: rgba(21, 51, 95, 0.2);
}

.video-card.is-current {
  background: rgba(21, 51, 95, 0.1);
  border-color: #15335f;
}

.video-thumbnail {
  position: relative;
  width: 120px;
  min-width: 120px;
  aspect-ratio: 16 / 9;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s;
}

.video-card:hover .play-overlay {
  opacity: 1;
}

.duration-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
}

.video-card-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.video-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #15335f;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-card.is-current .video-card-title {
  color: #15335f;
  font-weight: 700;
}

.video-card-description {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
