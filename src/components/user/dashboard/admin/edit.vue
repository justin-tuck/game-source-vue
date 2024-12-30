<template>
    <h1>Edit Article</h1>
    <hr />

    <Form class="mb-5" @submit="onSubmit" :validation-schema="ArticleSchema">
       <!-- 1 Name of the game -->
       <div class="mb-4">
           <Field name="game" v-model="article.game" v-slot="{field, errors, errorMessage}">
               <input 
                   type="text" 
                   placeholder="Name of the game" 
                   v-bind="field" 
                   class="form-control" 
                   :class="{'is-invalid':errors.length !== 0}"/>
               <div class="input_alert" v-if="errors.length !== 0">
                   {{  errorMessage }}
               </div>
           </Field>
       </div>
         <!-- 2 Title of the article -->
       <div class="mb-4">
           <Field name="title" v-model="article.title"  v-slot="{field, errors, errorMessage}">
               <input 
                   type="text" 
                   placeholder="Title of the Article " 
                   v-bind="field" 
                   class="form-control" 
                   :class="{'is-invalid':errors.length !== 0}"/>
               <div class="input_alert" v-if="errors.length !== 0">
                   {{  errorMessage }}
               </div>
           </Field>
       </div>
       <!-- 3 Excerpt -->
       <div class="mb-4">
           <Field name="excerpt" v-model="article.excerpt" v-slot="{field, errors, errorMessage}">
               <textarea 
                   rows="3"
                   placeholder="Add an excerpt" 
                   v-bind="field" 
                   class="form-control" 
                   :class="{'is-invalid':errors.length !== 0}"></textarea>
               <div class="input_alert" v-if="errors.length !== 0">
                   {{  errorMessage }}
               </div>
           </Field>
       </div>
       <!-- 4 What you see is what you get -->
       <div class="mb-4">
           <WYSIWYG @update="updateEditor" :content="article.editor"/>
           <Field name="editor" v-model="veditor" v-slot="{field, errors, errorMessage}">
               <input
                   type="hidden"
                   id="veditor"
                   v-bind="field"
               />
               <div class="input_alert" v-if="errors.length !== 0">
                   {{ errorMessage }}
               </div>
           </Field>
       </div>
      

       <!-- 5 Raiting -->
       <div class="mb-4">
           <Field name="rating" v-model="article.rating" value="Select a rating" v-slot="{field, errors, errorMessage}">
               <select
               v-bind="field"
               class="form-select" 
               :class="{'is-invalid':errors.length !== 0}"
               >
                   <option value="Select a rating">Select a rating</option>
                   <option v-for="rating in ratingArray" :key="rating" :value="rating">{{ rating }}</option>
               </select>
               <div class="input_alert" v-if="errors.length !== 0">
                   {{  errorMessage }}
               </div>
           </Field>
       </div>

         <!--  6 IMG -->
       <div class="mb-4">
           <Field name="img" v-model="article.img" v-slot="{field, errors, errorMessage}">
               <input 
                   type="text" 
                   placeholder="Add the source of the img" 
                   v-bind="field" 
                   class="form-control" 
                   :class="{'is-invalid':errors.length !== 0}"/>
               <div class="input_alert" v-if="errors.length !== 0">
                   {{  errorMessage }}
               </div>
           </Field>
       </div>

       <v-btn type="submit" 
       :disabled="loading"
       :loading="loading"
       >
           Edit Article
       </v-btn>
    </Form>
</template>

<script setup>
import { Field, Form} from 'vee-validate';
import { ref } from 'vue';
import ArticleSchema from './schema';
/// what you see is what youg et
import WYSIWYG from '@/components/utils/wysiwyg.vue';
import { useArticleStore } from '@/stores/articles';

// TOast
import { useToast } from 'vue-toast-notification';
import { useRoute } from 'vue-router';

const $toast = useToast(); 
const articleStore = useArticleStore(); 
const ratingArray = [0,1,2,3,4,5]
const veditor = ref('');
const loading = ref(true);
const article = ref({});


function onSubmit(values, {resetForm}) {
    console.log(values)
    loading.value = true; 
    articleStore.updateArticle(route.params.id, values)
    .finally(()=>{
        loading.value = false; 
    })
}

function updateEditor(value) {
   veditor.value = value; 
}

// we need to get article by ID and populate 
const route = useRoute();
articleStore.getArticleById(route.params.id)
.then((response)=>{
    article.value = {...response}
    updateEditor(response.editor);
    
}).catch((error)=>{
    $toast.error(error.message)
})
.finally(()=>{
      loading.value = false;
});

</script>