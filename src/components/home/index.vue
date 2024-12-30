<template>
    <div class="container"> 
        <AppCarousel /> 
        <Featured />
    </div>
  
</template>

<script setup>
    import { ref } from 'vue';
    import { useArticleStore } from '@/stores/articles';
    import AppCarousel from '../utils/carousel.vue';
    import Featured from './featured.vue';

    
    const articleStore = useArticleStore(); 

    if(!articleStore.homeArticles) {
        articleStore.getArticles(8); 
    }


</script>