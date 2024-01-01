<template>
    <div class="about">
        <p class="sign-in">Sign in with your email address</p>
        <input type="email" v-model="email" placeholder="Email address" />
        <button @click="submit">Sign in</button>
    </div>
</template>

<script>
import { request } from "../utils/request"

export default {
    name: "App",
    data() {
        return {
            email: ''
        }
    },
    methods: {
        async submit() {
            try {
                const response = await request(
                    "http://localhost:8000/api/user/sign-up",
                    "",
                    { "Content-Type": "application/json" },
                    "post",
                    JSON.stringify({ email: this.email })
                )
                sessionStorage.setItem("token", response.data.token)
                this.$router.push("/")
            } catch (e) {
                console.log(e)
                this.$router.push("/sign-in")
            }
        }
    }
}
</script>

<style>
@media (min-width: 1024px) {
    .about {
        display: inline;
    }
}

.sign-in {
    margin-bottom: 12px;
}
</style>