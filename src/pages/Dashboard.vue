<template>
  <div class="flex flex-col gap-6 items-center">
    <h1 class="text-xl font-bold">Dashboard</h1>

    <div class="self-center flex justify-around text-white gap-0.5 text-lg font-semibold w-full">
      <button class="bg-purple-600 rounded-l-lg w-full py-1"
        @click="toggleShow('mydata')">
        My Data
      </button> 
      <button class="bg-purple-600 rounded-r-lg w-full py-1"
        @click="toggleShow('mydex')">
        My Dex
      </button>
    </div>

    <div v-if="show == 'mydata'">
      <div v-if="loading">Loading user data...</div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else-if="user" class="card">
        <p><strong>ID:</strong> {{ user._id }}</p>
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Joined:</strong>
          {{ new Date(user.createdAt).toLocaleString() }}
        </p>
      </div>

      <div class="flex w-full justify-between">
        <button @click="logout" class="self-center cursor-pointer border-2 border-black px-4 py-2 rounded-md hover:bg-gray-200">
          Logout
        </button>

        <button @click="goToCardGame" class="self-center cursor-pointer border-2 border-black px-4 py-2 rounded-md hover:bg-gray-200">
          Play a game
        </button>
      </div>
    </div>

    <div v-else-if="show == 'mydex'">
      <div class="card flex flex-col gap-4 items-center">
        <button @click="goToPokeapi" class="self-center cursor-pointer bg-purple-400 px-2 py-1 border-2 border-purple-800 rounded-lg">
          Browse more Pokemons
        </button>
        <div v-if="user.mydex.length == 0">This is where your PokeDex would be displayed.</div>
        <div v-else>
          pokemons in your PokeDex: {{ user.mydex.length }}
        </div>
        <div class="max-h-[60vh] overflow-y-auto w-full">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <div
              v-for="pokemon in user.mydex"
              :key="pokemon.pokemonName"
              class="border-gray-500 h-50 w-50 rounded-xl flex flex-col items-center border-2"
            >
              <img
                class="w-30 h-30"
                :src="pokemon.pokemonImage"
                :alt="pokemon.pokemonName"
              />

              <div class="bg-gray-300 w-full h-[50%] flex flex-col items-center rounded-b-lg">
                <p class="capitalize font-bold text-xl">
                  {{ pokemon.pokemonName }}
                </p>
                <div v-for="type in pokemon.types" :key="type">
                  <p class="font-semibold capitalize">{{ type }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue"
  import { useRouter } from "vue-router"
  import axios from "axios"

  // state
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const router = useRouter()

  const show = ref("mydata")

  onMounted(async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/me", {
        withCredentials: true,
      })

      // support both { user: {...} } and direct user response
      user.value = res.data.user ?? res.data
      console.log("user object", user.value)
    } catch (err) {
      console.error(err)
      error.value = "Unauthorized. Please login again."
      router.push("/login")
    } finally {
      loading.value = false
    }
  })

  function toggleShow(instruction) {
    if(instruction == 'mydata'){
      if(show.value == 'mydex'){
        show.value = 'mydata'
      }
    }
    else if(instruction == 'mydex'){
      if(show.value == 'mydata'){
        show.value = 'mydex'
      }
    }
  }

  function goToCardGame() {
    router.push("/cardgame")
  }

  function logout() {
    axios
      .get(
        "http://localhost:9000/api/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        router.push("/login")
      })
      .catch((err) => {
        console.error("Logout failed:", err)
      })
  }

  function goToPokeapi() {
    router.push("/pokeapi")
  }
</script>

<style scoped>
  .dashboard {
    padding: 40px;
    font-family: Arial, sans-serif;
  }

  .card {
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .error {
    color: red;
  }
</style>
