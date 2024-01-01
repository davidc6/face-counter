<template>
    <div class="signin">
        <h1 class="sign-in">Login</h1>
        <div>
            <input type="email" v-model="email" placeholder="Email address" />
            <button @click="submit">Login</button>
        </div>
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
                if (response?.data?.token) {
                    sessionStorage.setItem("token", response.data.token)
                    this.$router.push("/")
                }
            } catch (e) {
                console.log(e)
                this.$router.push("/sign-in")
            }
        }
    }
}
</script>

<style>
.signin {
    text-align: center;
}

.sign-in {
    margin-bottom: 12px;
}
</style>