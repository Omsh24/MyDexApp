<template>
  <div class="min-h-screen relative bg-green-200">

    <!-- Fixed Header -->
    <header
      class="fixed top-0 left-0 w-full bg-green-300 border-b-2 border-black z-50 flex justify-center"
    >
      <img
        :src="MyPokeApi"
        alt="MyPokeDex"
        class="h-24"
      />
      <select v-model="gen" @change="display" name="gen" id="gen" class="fixed right-0 top-4 font-semibold bg-white border-2 border-gray-800 rounded-md m-4 p-2">
        <option value="Generation I">Generation I</option>
        <option value="Generation II">Generation II</option>
        <option value="Generation III">Generation III</option>
        <option value="Generation IV">Generation IV</option>
        <option value="Generation V">Generation V</option>
        <option value="Generation VI">Generation VI</option>
        <option value="Generation VII">Generation VII</option>
        <option value="Generation VIII">Generation VIII</option>
        <option value="Generation IX">Generation IX</option>
      </select>
    </header>

    <!-- Spacer (reserves space for fixed header) -->
    <div class="h-30"></div>

    <!-- Content -->
    <main class="flex flex-col items-center gap-6">
      <div v-if="loading" class="text-center my-6">
        <p>Loading Pokémons...</p>
      </div>

      <div v-if="error" class="text-center my-6">
        <p class="text-red-600 font-bold">Error: {{ error }}</p>
      </div>

      <div
        v-if="!loading && !error"
        class="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 grid grid-rows-4 w-full"
      >
        <div
          v-for="pokemon in pokemons"
          :key="pokemon.id"
          class="flex flex-col items-center relative rounded-lg shadow p-10 cursor-pointer border-2 border-gray-800 hover:scale-105 transition-transform duration-300"
          :style="getCardStyle(pokemon)"
          @click="selectPokemon(pokemon)"
        >
          <img :src="tick" alt="✅" class="w-8 h-8 absolute -top-3 -right-3 border-2 border-black rounded-full" v-if="myDexData.find(p => p.pokemonName === pokemon.name)"/>
          <img
            :src="
              pokemon.sprites.other?.['official-artwork']?.front_default
              || pokemon.sprites.front_default
            "
            :alt="pokemon.name"
            class="w-32 h-32 hover:scale-140 transition-transform duration-300"
          />

          <span class="capitalize font-bold mt-2">
            {{ pokemon.name }}
          </span>
        </div>
      </div>
    </main>

  </div>
</template>



<script setup>
    import { onMounted, onUpdated, reactive, ref, watch } from 'vue';
    import { MyPokeApi, tick} from '../assets/export.js'
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    const pokemons = ref([])
    const error = ref(null)
    const loading = ref(true)
    const router = useRouter()
    const userID = ref(null)
    const userData = ref(null)
    const myDexData = ref([])

    const start = ref(1)
    const end = ref(151)
    const gen = ref("Generation I")

    const display = () => {
      // console.log(gen.value)
      switch (gen.value) {
        case "Generation I":
          start.value = 1
          end.value = 151
          break
        case "Generation II":
          start.value = 152
          end.value = 251
          break
        case "Generation III":
          start.value = 252
          end.value = 386
          break
        case "Generation IV":
          start.value = 387
          end.value = 493
          break
        case "Generation V":
          start.value = 494
          end.value = 649
          break
        case "Generation VI":
          start.value = 650
          end.value = 721
          break
        case "Generation VII":
          start.value = 722
          end.value = 809
          break
        case "Generation VIII":
          start.value = 810
          end.value = 905
          break
        case "Generation IX":
          start.value = 906
          end.value = 1010
          break
      }
    }

    watch([start, end], async () => {
      loading.value = true
      await fetchPokemons()
    })

    onMounted( async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/me", {
          withCredentials: true,
        })

        // support both { user: {...} } and direct user response
        userData.value = res.data.user ?? res.data
        userID.value = userData.value._id
        myDexData.value = userData.value.mydex
        console.log("user object", userID.value)
        console.log("myDex data", myDexData.value)
      } catch (err) {
        console.error(err)
        error.value = "Unauthorized. Please login again."
        router.push("/login")
      } 
      await fetchPokemons();
    })

    const typeColors = {
      grass: "#78C850",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      poison: "#A040A0",
      bug: "#A8B820",
      flying: "#A890F0",
      normal: "#A8A878",
      ground: "#E0C068",
      fairy: "#EE99AC",
      fighting: "#C03028",
      psychic: "#F85888",
      rock: "#B8A038",
      ghost: "#705898",
      ice: "#98D8D8",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
    }

    const pokemonData = reactive({
      pokemonName: '',
      pokemonImage: '',
      types: [],
    })


    const getCardStyle = (pokemon) => {
      const types = pokemon.types.map(t => t.type.name)

      // single type → solid color
      if (types.length === 1) {
        return {
          backgroundColor: typeColors[types[0]],
        }
      }

      // dual type → hard 50/50 split
      return {
        background: `linear-gradient(
          135deg,
          ${typeColors[types[0]]} 50%,
          ${typeColors[types[1]]} 50%
        )`,
      }
    }


    const fetchPokemons = async () => {
        try {
            const requests = Array.from({length: (end.value - start.value + 1)}, (_, i) => 
                fetch(`https://pokeapi.co/api/v2/pokemon/${i+start.value}`).then(res => res.json())
            ) 

            pokemons.value = await Promise.all(requests);
        } catch (error) {
            error.value = error.message
        }
        finally {
            loading.value = false
        }
    }

    const updateMyDex = async (pokemon) => {
      try {
        const res = await fetch("http://localhost:9000/api/updateMyDex", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pokemonName: pokemon.name,
            pokemonImage: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default,
            types: pokemon.types.map(t => t.type.name),
          }),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text)
        }

        return true
      } catch (err) {
        console.error("Failed to add Pokemon:", err.message)
        return false
      }
    }


    const selectPokemon = async (pokemon) => {
      // already in dex? do nothing
      if (myDexData.value.some(p => p.pokemonName === pokemon.name)) {
        return
      }

      const success = await updateMyDex(pokemon)

      if (success) {
        myDexData.value.push({
          pokemonName: pokemon.name,
          pokemonImage: pokemon.sprites.front_default,
          types: pokemon.types.map(t => t.type.name),
        })
      }
    }

</script>