import { defineStore } from "pinia";
import router from "@/router";
import { useUserStore } from "./user";

import { DB } from "../../firebase-config";
import {  collection, getDoc, doc, setDoc, serverTimestamp, updateDoc, query, orderBy, 
    getDocs, limit, startAfter, deleteDoc } from 'firebase/firestore';
import { reload } from "firebase/auth";

 //TOASTS
 import { useToast } from "vue-toast-notification";
 const $toast = useToast(); 

let articlesCol = collection(DB, 'articles')

export const useArticleStore = defineStore('article', {
    state:()=>({
        homeArticles:'',
        adminArticles:'',
        adminLastVisible: ''
    }),
    getters:{
        getHomeArticles(state) {
            return state.homeArticles
        },
        getFeaturedSlides(state) {
            return state.homeArticles.slice(0,3); 
        }
    },
    actions:{
        async getArticles(docLimit) {
            try {
                const q = query(articlesCol, orderBy('timestamp', 'desc'), limit(docLimit));
                const querySnapshot = await getDocs(q);
                const articles = querySnapshot.docs.map(doc=> ({
                    id: doc.id,
                    ...doc.data()
                }));
                this.homeArticles = articles; 
            } catch(error) {
                $toast.error(error.message);
                throw new Error(error)
            }
        },
        async updateArticle(id, formData) {
            try {
                const docRef = doc(DB, 'articles', id);
                await updateDoc(docRef, {
                    ...formData
                });

                $toast.success('Updated the Article')

                return true

            } catch(error) {
                $toast.error(error.message)
                throw new Error(error)
            }
        },
        async getArticleById(id) {
            try {
                const docRef = await getDoc(doc(DB, 'articles', id))

                if(!docRef.exists()) {
                    throw new Error("Could not find document"); 
                }
                return docRef.data(); 

            } catch(error) {
                $toast.error(error.message);
                router.push({name: '404'})
            }
        },
        async addArticle(formData){
            try {
                // Get User Profile
                const userStore = useUserStore(); 
                const user = userStore.getUserData; 
                //post doc in db
                const newArticle = doc(articlesCol);
                await setDoc(newArticle, {
                    timestamp:serverTimestamp(),
                    owner:{
                        uid: user.uid,
                        firstname: user.firstname,
                        lastname: user.lastname
                    },
                    ...formData
                });
                
                // Redirect User
                router.push({name: 'admin_articles', query:{reload:true}})

                return true;

            } catch(error) {
                throw new Error(error); 
            }
        },
        async adminGetArticles(docLimit) {
            try {
                const q = query(articlesCol, orderBy('timestamp', 'desc'), limit(docLimit));
                const querySnapshot =  await getDocs(q);
                const lastIndex = querySnapshot.docs.length -1
                const lastVisible = querySnapshot.docs[lastIndex];
                const articles = querySnapshot.docs.map(doc=> ({
                    id: doc.id,
                    ...doc.data()
                }));

                // UPDATE ADMIN Articles 
                this.adminArticles = articles; 
                this.adminLastVisible = lastVisible;

            } catch(error) {
                $toast.error(error.message);
                throw new Error(error)
            }
        },
        async adminGetMoreArticles(docLimit) {
            try {
                if(this.adminLastVisible) {
                    let oldArticles = this.adminArticles;
                    const q = query(
                        articlesCol,
                         orderBy('timestamp', 'desc'), 
                         startAfter(this.adminLastVisible),
                         limit(docLimit)
                    );
                    const querySnapshot =  await getDocs(q);
                    const lastIndex = querySnapshot.docs.length -1
                    const lastVisible = querySnapshot.docs[lastIndex];
                    const newArticles = querySnapshot.docs.map(doc=> ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    // UPDATE ADMIN Articles 
                    this.adminArticles = [...oldArticles, ...newArticles]; 
                    this.adminLastVisible = lastVisible;

                }

            } catch(error) {
                $toast.error(error.message);
                throw new Error(error)
            }
        },
        async removeById(id) {
            try {
                await deleteDoc(doc(DB, 'articles', id));

                const newList = this.adminArticles.filter(x=>{
                    return x.id != id
                });

                this.adminArticles = newList; 
                
                $toast.success('Removed Article!')
            } catch(error) {
                $toast.error(error.message);
                throw new Error(error)
            }
        }
    }
})