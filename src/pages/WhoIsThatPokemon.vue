<template>
    <div>
        <div v-if="loading">
            Loading...
        </div>

        <div v-if="err">
            {{ err }}
        </div>

        <div v-if="pokemon" class="flex flex-col lg:flex-row lg:gap-50 w-full items-center">
            <div class="flex flex-col gap-5 items-center">
                <p class="text-lg font-semibold">Current Score: {{ score }}</p>

                <div class="flex lg:flex-col gap-4">
                    <input v-model="enteredName" type="text" class="bg-white px-2 py-1 rounded-lg focus:scale-120 transition-all duration-300">
                    <button @click="handleInput" class="bg-blue-400 hover:bg-blue-600 hover:scale-110 transition-all duration-300 text-white font-semibold cursor-pointer rounded-lg px-2 py-1">Submit</button>
                    <button @click="skip" class="bg-red-400 hover:bg-red-600 hover:scale-110 transition-all duration-300 text-white font-semibold cursor-pointer rounded-lg px-2 py-1">Skip</button>
                </div>

                <div class="font-semibold text-lg text-center" :class="lastSubmit === 'Correct Guess!!!' ? 'text-green-500' : 'text-red-500'">
                    {{ lastSubmit }}
                </div>
            </div>
            <div>
                <div class="flex w-full flex-col items-center">
                    <p class="text-lg font-semibold">Pokemon sprite: </p>
                    <img :class="hint ? 'blur-xs' : 'brightness-0'" class="lg:w-110 lg:h-110 w-64 h-64 transition-all duration-300" :src="pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default" alt="Pokemon should be here">
                    <button @click="toggleHint" :class="hint ? 'bg-red-500' : 'bg-yellow-400'" class="text-white font-semibold rounded-lg px-2 py-1 cursor-pointer hover:bg-yellow-500 hover:scale-120 transition-all duration-300">Hint ?</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

    const pokemon = ref(null)
    const loading = ref(true)
    const err = ref('')
    
    const enteredName = ref('')
    const score = ref(0)
    const lastSubmit = ref('')
    const hint = ref(false)

    const handleInput = async () => {
        let name = enteredName.value.toLowerCase()
        console.log(name)
        if(name === pokemon.value.name){
            score.value++;
            lastSubmit.value = "Correct Guess!!!"
        }
        else if(name === ''){
            lastSubmit.value = "Enter something!!!"
            return;
        }
        else    lastSubmit.value = "Wrong Guess!!! It was " + pokemon.value.name
        enteredName.value = ''
        await game()
    }

    const skip = async () => {
        lastSubmit.value = ''
        await game()
    }

    const toggleHint = () => {
        hint.value = !hint.value
        console.log("hit")
    }

    const game = async () => {
        let randomNum = Math.floor(Math.random()*1025) + 1

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`).then(res => res.json())
            pokemon.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            loading.value = false
        }
        console.log(pokemon.value)
    }

    onMounted( async () => {
        await game()
    })
</script>