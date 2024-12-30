<template>
    <div v-if="articleStore.getFeaturedSlides">
        <Carousel
            :items-to-show="1"
            :wrap-around="true"
            class="p_top mb-5"
        >
            <Slide v-for="slide in articleStore.getFeaturedSlides" :key="slide.id">
              <div class="slider_bck" :style="{background:`url(${slide.img})`}">
                <div class="slide_content">
                    <div class="item">
                        <div>{{ slide.title }}</div>
                        <div>{{ slide.excerpt }}</div>
                    </div>
                </div>
              </div>
            </Slide>
            <template #addons>
                <Pagination>
                </Pagination>
            </template>
        </Carousel>
    </div>
</template>
<script setup>
    import 'vue3-carousel/dist/carousel.css'
    import { Carousel, Slide, Pagination } from 'vue3-carousel'
    import { useArticleStore } from '@/stores/articles';
    const articleStore = useArticleStore();
 
</script>