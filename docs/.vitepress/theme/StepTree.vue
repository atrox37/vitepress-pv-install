<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  steps: Array<{
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
    subSteps?: Array<{
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
  }>
  currentVideoId: string
}>()

const emit = defineEmits<{
  (e: 'select-video', video: any): void
}>()

const { lang } = useData()
const isEnglish = computed(() => (lang.value || '').toLowerCase().startsWith('en'))

const expandedSteps = ref<Set<string>>(new Set())

const toggleStep = (stepId: string) => {
  if (expandedSteps.value.has(stepId)) {
    expandedSteps.value.delete(stepId)
  } else {
    expandedSteps.value.add(stepId)
  }
}

const isStepExpanded = (stepId: string) => {
  return expandedSteps.value.has(stepId)
}

const selectVideo = (video: any) => {
  emit('select-video', video)
}

const isCurrentVideo = (videoId: string) => {
  return props.currentVideoId === videoId
}

const formatNumber = (num: number) => {
  return num.toLocaleString()
}

// Auto-expand step containing current video
const expandCurrentStep = () => {
  for (const step of props.steps) {
    if (step.id === props.currentVideoId) {
      expandedSteps.value.add(step.id)
      return
    }
    if (step.subSteps) {
      for (const subStep of step.subSteps) {
        if (subStep.id === props.currentVideoId) {
          expandedSteps.value.add(step.id)
          return
        }
      }
    }
  }
}

// Watch for currentVideoId changes
onMounted(() => {
  expandCurrentStep()
})

watch(() => props.currentVideoId, () => {
  expandCurrentStep()
})
</script>

<template>
  <div class="step-tree">
    <h2 class="step-tree-title">{{ isEnglish ? 'Steps' : '步骤' }}</h2>
    
    <div class="steps-list">
      <div
        v-for="step in steps"
        :key="step.id"
        class="step-item"
        :class="{ 'is-expanded': isStepExpanded(step.id), 'has-current': isCurrentVideo(step.id) }"
      >
        <div
          class="step-header"
          :class="{ 'is-current': isCurrentVideo(step.id) }"
          @click="selectVideo(step)"
        >
          <div class="step-content">
            <div class="step-title-row">
              <span class="step-number">{{ step.id.replace('step-', '') }}</span>
              <span class="step-title">{{ step.title[isEnglish ? 'en' : 'zh'] }}</span>
            </div>
            <div class="step-meta">
              <span>{{ formatNumber(step.views) }}</span>
              <span>{{ isEnglish ? 'views' : '次观看' }}</span>
              <span>{{ formatNumber(step.downloads) }}</span>
              <span>{{ isEnglish ? 'downloads' : '次下载' }}</span>
              <span>{{ isEnglish ? 'Duration' : '时长' }}: {{ step.duration }}</span>
            </div>
          </div>
          
          <button
            v-if="step.subSteps && step.subSteps.length > 0"
            class="expand-btn"
            @click.stop="toggleStep(step.id)"
            :aria-label="isStepExpanded(step.id) ? 'Collapse' : 'Expand'"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              :class="{ 'rotated': isStepExpanded(step.id) }"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
        
        <div v-if="step.subSteps && step.subSteps.length > 0" class="sub-steps" v-show="isStepExpanded(step.id)">
          <div
            v-for="subStep in step.subSteps"
            :key="subStep.id"
            class="sub-step-item"
            :class="{ 'is-current': isCurrentVideo(subStep.id) }"
            @click="selectVideo(subStep)"
          >
            <div class="sub-step-content">
              <div class="sub-step-title-row">
                <span class="sub-step-number">{{ subStep.id.replace('step-', '').replace('-', '.') }}</span>
                <span class="sub-step-title">{{ subStep.title[isEnglish ? 'en' : 'zh'] }}</span>
              </div>
              <div class="sub-step-meta">
                <span>{{ formatNumber(subStep.views) }}</span>
                <span>{{ isEnglish ? 'views' : '次观看' }}</span>
                <span>{{ formatNumber(subStep.downloads) }}</span>
                <span>{{ isEnglish ? 'downloads' : '次下载' }}</span>
                <span class="play-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {{ subStep.duration }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-tree {
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 80px;
}

.step-tree-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--mc-theme-soft-16);
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  border: 1px solid var(--mc-theme-soft-16);
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.25s;
}

.step-item.has-current {
  border-color: var(--mc-theme-1);
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s;
  background: var(--vp-c-bg);
}

.step-header:hover {
  background: var(--mc-theme-soft-08);
}

.step-header.is-current {
  background: var(--mc-theme-soft-16);
  border-left: 3px solid var(--mc-theme-1);
}

.step-content {
  flex: 1;
}

.step-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--mc-theme-1);
  color: white;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-header.is-current .step-number {
  background: var(--mc-sub-1);
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.step-header.is-current .step-title {
  color: var(--mc-theme-1);
}

.step-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-left: 40px;
}

.expand-btn {
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: transform 0.25s;
  flex-shrink: 0;
}

.expand-btn:hover {
  color: var(--mc-theme-1);
}

.expand-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.25s;
}

.expand-btn svg.rotated {
  transform: rotate(180deg);
}

.sub-steps {
  border-top: 1px solid var(--mc-theme-soft-16);
  background: var(--mc-theme-soft-08);
  padding: 8px;
}

.sub-step-item {
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.25s;
  margin-bottom: 4px;
}

.sub-step-item:last-child {
  margin-bottom: 0;
}

.sub-step-item:hover {
  background: var(--mc-theme-soft-16);
}

.sub-step-item.is-current {
  background: var(--mc-theme-soft-25);
  border-left: 3px solid var(--mc-sub-1);
}

.sub-step-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sub-step-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sub-step-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--mc-theme-1);
  min-width: 32px;
}

.sub-step-item.is-current .sub-step-number {
  color: var(--mc-sub-1);
}

.sub-step-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.sub-step-item.is-current .sub-step-title {
  color: var(--mc-theme-1);
  font-weight: 600;
}

.sub-step-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-left: 40px;
}

.play-icon {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--mc-sub-1);
}

.play-icon svg {
  width: 12px;
  height: 12px;
}

@media (max-width: 959px) {
  .step-tree {
    position: static;
    padding: 16px;
  }
}
</style>

