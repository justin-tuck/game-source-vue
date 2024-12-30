<template>
    <div class="signin_container">

       <div class="text-center" v-show="userStore.loading">
            <v-progress-circular 
                indeterminate
                color="primary"
            />
        </div>

        <Form @submit="onSubmit" :validation-schema="formSchema">
            <h1 v-text=" !type ? 'Sign in' : 'Register'"></h1>

            <div class="form-group">
                <Field name="email" :value="'justin@gmail.com'" v-slot="{field, errors, errorMessage}" v-show="!userStore.loading">
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Enter your email" 
                        v-bind="field" 
                        :class="{'is-invalid':errors.length !== 0}"/>
                    <div class="input_alert" v-if="errors.length !== 0">
                        {{  errorMessage }}
                    </div>
                </Field>
            </div>

            <div class="form-group">
                <Field name="password" :value="'testing123'" v-slot="{field, errors, errorMessage}">
                    <input 
                        type="password" 
                        class="form-control" 
                        placeholder="Enter your password" 
                        v-bind="field" 
                        :class="{'is-invalid':errors.length !== 0}"/>
                    <div class="input_alert" v-if="errors.length !== 0">
                        {{  errorMessage }}
                    </div>
                </Field>
            </div>

            <button type="submit" class="btn mb-3 btn-block" v-text=" !type ? 'Sign in' : 'Register'">
            </button>

            <hr />
            <div class="form_swap" @click="type = !type">
                <span v-if="type">
                    I want to <b>Sign in</b>
                </span>
                <span v-else>
                    I want to <b>Register</b>
                </span>
            </div>
        </Form>
    </div>
</template>

<script setup>
    import {Field, Form} from 'vee-validate';
    import { ref } from 'vue';
    import * as yup from 'yup';

    //Toasts
    import { useToast } from 'vue-toast-notification';
    const $toast = useToast();
    // AUTH Store in pinia 
    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
 

    const type = ref(false); 
    const formSchema = yup.object({
        email: yup.string().required('The email is required.').email('Not a valid email'),
        password: yup.string().required('The password is required.') 
    })

    function onSubmit(values, {resetForm}) {
        if(type.value) {
            // register
            userStore.register(values); 
        } else {
            //sign in 
            userStore.signin(values); 
        }
       
    }

    //subscribe to error
    userStore.$onAction(({name, after, onError})=>{
        if(name === 'register' || name === 'signin') {
            after(()=> {
                $toast.success('Welcome!')
            })
            onError((error)=>{
                $toast.error(error.message)
            })
        }
    })

</script>