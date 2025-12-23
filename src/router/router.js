import { createRouter, createWebHistory } from "vue-router";
import Signup from "../pages/Signup.vue";
import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import Pokeapi from "../pages/Pokeapi.vue";
import CardGame from "../pages/CardGame.vue";
import WhoIsThatPokemon from "../pages/WhoIsThatPokemon.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Signup
        },
        {
            path: "/login",
            component: Login
        },
        {
            path: "/dashboard",
            component: Dashboard
        },
        {
            path: "/pokeapi",
            component: Pokeapi
        },
        {
            path: "/cardgame",
            component: CardGame
        },
        {
            path: "/whosethatpokemon",
            component: WhoIsThatPokemon
        },
    ]
})