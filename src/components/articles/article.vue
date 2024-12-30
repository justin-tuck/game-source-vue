<template>
    <div class="container p_top">
        <div class="text-center m-3" v-if="loading">
            <v-progress-circular 
                indeterminate
                color="primary"
            />
        </div>
        <div class="article_page" v-else>
            <div class="game_tag">
                {{  article.game }}
            </div>
            <div class="article_featured" :style="{backgroundImage: `url(${article.img})`}" >
            </div>
            <div class="article_content">
                    <div class="owner">
                        Article written by <b>{{ article.owner.firstname }} {{ article.owner.lastname }}</b>
                    </div>
                    <hr />
                    <h1>{{ article.title }}</h1>
                    <div class="editor" v-html="article.editor"> </div>
                    <hr />
                    <div class="article_rating">
                        Our rating is {{  article.rating }} out of 5 stars! 
                    </div>

            </div>
        </div>
    </div>

</template>


<script setup>
    import { useArticleStore } from '@/stores/articles';  
    import { ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    const articleStore = useArticleStore(); 
    const article = ref('')

    const route = useRoute()
    const loading = ref(true); 

    articleStore.getArticleById(route.params.id)
    .then(response => {
        article.value = response
    })
    .finally(()=>{
        loading.value = false; 
    })

</script>