<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

    const router = useRouter();

    const user = reactive({
        name: '',
        email: '',
        password: '',
    })

    const signUpDone = ref(false);

    function handleInfo(){
        console.log({...user});
    }

    const signup = async () => {
        try {
            const res = await fetch("http://localhost:9000/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                })
            })

            if(!res.ok){
                throw new Error("Signup failed");
            }

            const loginRes = await fetch("http://localhost:9000/api/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                }),
            })


            if(!loginRes.ok){
                throw new Error("Login failed");
            }

            const data = await loginRes.json();
            console.log("Signup successful", data);
            signUpDone.value = true;
            await router.push("/dashboard")

        } catch (error) {
            console.error("Signup failed:", error.message)
        }
    }


</script>

<template>
    <div class="flex flex-col gap-6">
        <div v-if="!signUpDone">
            <div class="font-bold text-5xl mb-6">
                SIGN UP HERE
            </div>
            <form class="flex flex-col gap-4" @submit.prevent="handleInfo">
                <div class="flex justify-between">
                    <p class="text-xl font-semibold self-center">Name:</p>
                    <input
                        v-model="user.name"
                        type="text" class="border-2 border-black rounded-xl outline-none py-1 px-3">
                </div>

                <div class="flex justify-between">
                    <p class="text-xl font-semibold self-center">Email:</p>
                    <input 
                        v-model="user.email"
                        type="email" class="border-2 border-black rounded-xl outline-none py-1 px-3">
                </div>

                <div class="flex justify-between">
                    <p class="text-xl font-semibold self-center">Password:</p>
                    <input 
                        v-model="user.password"
                        type="password" class="border-2 border-black rounded-xl outline-none py-1 px-3">
                </div>

                <button class="bg-blue-400 border-2 border-blue-600 text-white font-semibold w-fit px-2 py-1 rounded-lg self-center
                        hover:bg-blue-600 hover:border-blue-800 hover:scale-110 hover:font-bold transition-all mt-4"
                        type="submit"
                        @click="signup">
                    Submit
                </button>
            </form>
        </div>

        <div v-else>
            <div class="font-bold text-5xl mb-6">
                SIGNUP SUCCESSFUL!
            </div>
        </div>
    </div>
</template>