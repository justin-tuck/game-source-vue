import { defineStore } from "pinia";
import router from "@/router";

// Fire Base
import { AUTH, DB } from "../../firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {getDoc, doc, setDoc, updateDoc} from 'firebase/firestore'
import errorCodes from "@/components/utils/fbcodes";

const DEFAULT_USER = {
    uid: null,
    email: null,
    firstname: null,
    lastname: null,
    isAdmin: null
}

 import { useToast } from "vue-toast-notification";
 const $toast = useToast(); 

export const useUserStore = defineStore('user', {
    state:()=> ({
        loading: false, 
        user: DEFAULT_USER,
        auth: false
    }),
    getters:{
        getUserData(state) {
            return state.user;
        },
        getUserId(state) {
            return state.user.uid
        }
    },
    actions:{
        setUser(newUser) {
            this.user = { ...this.user, ...newUser };
            this.auth = true; 
        },
        async updateProfile(formData) {
            try {
                const userRef = doc(DB, 'users', this.getUserId);
                await updateDoc(userRef, {
                    ...formData
                });

                this.setUser(formData); 

                $toast.success('Updated Profile!');
                return true; 
            } catch(error) {
                $toast.error(error.message);
                throw new Error(error)
            }
        },
        async signOut() {
            try {
                await signOut(AUTH);
                this.user = (DEFAULT_USER);
                this.auth = false;
                router.push({name: 'home'});
            } catch(error) {
                throw new Error(error.code)
            }
        },
        async autosignin(uid) {
            try {
                const userData = await this.getUserProfile(uid) ;
                 /// update local state
                 this.setUser(userData);
            } catch (error) {
                console.log(error)
            }
        },
        async getUserProfile(uid) {
            try {
                const userRef = await getDoc(doc(DB, 'users', uid));
                if(!userRef.exists() ){
                    throw new Error('Could not find user!')
                }
                return userRef.data();
            } catch(error) {
                throw new Error(error)
            }
        },
        async signin(formData) {
             try {
                this.loading = true; 

                // register user 
                const response = await signInWithEmailAndPassword(
                    AUTH, 
                    formData.email, 
                    formData.password
                );

                const userData = await this.getUserProfile(response.user.uid);

                this.setUser(userData);

                router.push({name:'dashboard'})
            } catch(error) {
                throw new Error(errorCodes(error.code))
            } finally {
                this.loading = false;
            }
        },
        async register(formData) {
            try {
                this.loading = true; 

                // register user 
                const response = await createUserWithEmailAndPassword(
                    AUTH, 
                    formData.email, 
                    formData.password
                );

                // Add user to DB

                const newUser = {
                    uid: response.user.uid,
                    email: response.user.email,
                    isAdmin: false
                }

                await setDoc(doc(DB, 'users', response.user.uid), newUser );
                
                // update local state 
                this.setUser(newUser);
                // redirect user 
                router.push({name:'dashboard'})
            } catch(error) {
                throw new Error(errorCodes(error.code))
            } finally {
                this.loading = false;
            }
        }
    }
})
