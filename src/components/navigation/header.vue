<template>
    <header>
        <div class="container header_container">
            <div class="logo">
                <router-link :to="{name: 'home'}">
                    GameSource
                </router-link>
            </div>
            <div>
                <ul>
                    <li v-if="!userStore.auth">
                        <router-link :to="{name: 'signin'}">
                            Sign In 
                        </router-link>
                    </li>
                    <span>
                        <li v-if="userStore.auth">
                            <router-link :to="{name: 'dashboard'}" >
                                Dashboard
                            </router-link>
                        </li>
                        <li v-if="userStore.auth" @click="userStore.signOut()">
                            <span>
                                Logout
                            </span>
                        </li>
                    </span>
                </ul>
            </div>
        </div>
    </header>
</template>

<script setup>
    // User store
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore(); 



</script>