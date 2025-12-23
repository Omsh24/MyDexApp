<template>
    <div class="flex lg:flex-row sm:flex-col sm:gap-4 items-center justify-around w-full">
        <div class="font-semibold text-center">
            <div class="text-5xl">Card Game</div>
            <div class="text-xl">Score: {{ score }}</div>
            <div class="text-xl">Wrong turns remainging: {{ turns }}</div>
        </div>

        <div class="grid grid-cols-4 grid-rows-4 gap-2">
            <div v-if="score < 8 && turns > 0" v-for="({url, name}, idx) in randomPokemons" :key="idx"
                    class="border-2 borde-gray-80 rounded-lg items-center text-center active:rotate-y-180 transition-all duration-100"
                    @click="selected(idx, name)"
                    :class="bgStyle(idx)"
                >
                    <img :src="url" :alt="name"
                    class="w-32 h-32" v-if="flip[idx] || found[idx]"
                    >
                    <div v-else class="w-32 h-32 bg-orange-800"></div>
            </div>
            <div v-if="score == 8 || turns == 0">
                <div>
                    Game Over: 
                    <span>{{ score == 8 ? "You won" : "You lost" }}</span>            
                </div>
                <div @click="restart = !restart">
                    <button>Restart Game</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUpdated, ref } from 'vue';

    // const randomPokemonArray = ref([])
    const pokemonArray = ref([]);
    const randomArray = ref([]);
    const randomPokemons = ref([]);

    const loading = ref(true)
    const err = ref('')

    const flip = ref([])
    const found = ref([])
    
    const selected1 = ref('')
    const selected2 = ref('')
    const selectedIndex1 = ref(-1)
    const selectedIndex2 = ref(-1)

    const score = ref(0)
    const turns = ref(12)
    const restart = ref(false)

    const bgStyle = (idx) => {
        if(found.value[idx])    return "bg-green-500"
        else if(flip.value[idx] && !found.value[idx])   return "bg-yellow-400"
    }

    const selected = (idx, name) => {
        if(!found.value[idx]){
            flip.value[idx] = true
            
            if(selected1.value === ''){
                selected1.value = name
                selectedIndex1.value = idx
            }
            else if(selected2.value === ''){
                selected2.value = name
                selectedIndex2.value = idx

                if(selected1.value === selected2.value && selected1.value !== '' && selectedIndex1.value !== selectedIndex2.value){
                    found.value[selectedIndex1.value] = true;
                    found.value[selectedIndex2.value] = true;
                    score.value++;
                    selected1.value = '';
                    selectedIndex1.value = -1;
                    selected2.value = '';
                    selectedIndex2.value = -1;
                }
                else{
                    setTimeout(() => {
                        flip.value[selectedIndex1.value] = false
                        flip.value[selectedIndex2.value] = false
                        selected1.value = '';
                        selectedIndex1.value = -1;
                        selected2.value = '';
                        selectedIndex2.value = -1;
                        turns.value--;
                    }, 1000)
                }
            }
        }
    }

    const fetchRandomPokemons = async () => {
        try {
            const requests = Array.from({length:16}, (_, i) => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${randomArray.value[i]}`).then(res => res.json())
            ) 
            pokemonArray.value = await Promise.all(requests);
        } catch (error) {
            err.value = error.message
        }
        finally {
            loading.value = false
        }
        // console.log("Fetchd pokemons", pokemonArray.value)
    }

    const game = async () => {
        // creating an array of random pokemon dex numbers
        let arr = []
        for(let i=0;i<8;i++){
            let num = Math.floor(Math.random()*1025) + 1
            while(arr.includes(num))   num = Math.floor(Math.random()*1025) + 1;
            arr.push(num)
            arr.push(num)
        }
        randomArray.value = arr;
        // console.log("Random pokemon dex number", randomArray.value)

        // creating an array of random indexes between 0-15
        let randomIndex = []
        for(let i=0;i<16;i++){
            let num = Math.floor(Math.random()*16)
            while(randomIndex.includes(num))    num = Math.floor(Math.random()*16);
            randomIndex.push(num)
        }
        // console.log("random indexes", randomIndex)
        
        // fetching the pokemons using random pokemon dex number array
        await fetchRandomPokemons()

        // randomizing the fetched pokemons
        for(let i=0;i<16;i++){
            randomPokemons.value.push({
                "url" :  pokemonArray.value[randomIndex[i]].sprites.other?.['official-artwork']?.front_default
                    || pokemonArray.value[randomIndex[i]].sprites.front_default,
                "name": pokemonArray.value[randomIndex[i]].name
            })
        }
        // console.log("random pokemons", randomPokemons.value)

        // creating flip and found array
        for(let i=0;i<16;i++){
            flip.value.push(false)
            found.value.push(false)
        }
    }

    const resetGame = async () => {
        // clear all state
        pokemonArray.value = []
        randomArray.value = []
        randomPokemons.value = []

        flip.value = []
        found.value = []

        selected1.value = ''
        selected2.value = ''
        selectedIndex1.value = -1
        selectedIndex2.value = -1

        score.value = 0
        turns.value = 12

        loading.value = true
        err.value = ''

        await game()
    }

    import { watch } from 'vue'

    watch(restart, async (newVal) => {
        if (newVal) {
            await resetGame()
            restart.value = false // reset the trigger
        }
    })



    onMounted( async () => {
        await game()
    })
</script>