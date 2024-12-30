import * as yup from 'yup';
import { ref } from 'vue';

// User Store
import { useUserStore } from '@/stores/user';


export const updateProfile = () => {
    const userStore = useUserStore();

    const firstname = ref(userStore.user.firstname);
    const lastname = ref(userStore.user.lastname);

    const loading = ref(false); 
    const formSchema = yup.object({
        firstname:yup.string().required('First name is required').max(100,'Your name is too long'),
        lastname:yup.string().required('Last name is required').max(100,'Your name is too long'),
    })

    function onSubmit(values, {resetForm}) {
        loading.value = true; 
        userStore.updateProfile(values)
        .finally(()=> {
            loading.value = false; 
        })
    }

    return {
        loading,
        formSchema,
        onSubmit,
        firstname,
        lastname
    }
}