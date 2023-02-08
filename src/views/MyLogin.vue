
<template>
  <div id="login">
    <div class="signInArea" v-if="!login_info.login_email">
      <h2>ログインしてください</h2>
      <div>
        icon image
        <form action="">
          <input type="text" accept=".png, .jpg, .jpeg">
        </form>
      </div>
      <div>
        name
        <form action="">
          <input type="text" v-model="signIn_input.signIn_name">
        </form>
      </div>
      <div>
        account name
        <form action="">
          @<input type="text" v-model="signIn_input.signIn_accountName">
        </form>
      </div>
      <div>
        email
        <form action="">
          <input type="text" v-model="signIn_input.signIn_email">
        </form>
      </div>
      <div>
        password
        <form action="">
          <input type="text" v-model="signIn_input.signIn_password">
        </form>
      </div>
      <div>
        <router-link to="/signIn">まだsignInしていない方はこちら</router-link><br/>
        <button @click="login">login</button><br/>
        <button @click="signOut">signOut</button>
      </div>
    </div>
  </div>
</template>

<script>

import firebase from "firebase/app";
import { signOut } from "@/module/signOut.js";

import TimeLine from "@/components/TimeLine.vue";


export default {
  data() {
    return {
      tweetContent: '',
      login_info: {
        login_uuid: '',
        login_email: '',
        login_name: '',
        login_accountName: '',
        login_icon: '',
      },
      signIn_input: {
        signIn_icon: 'logo',
        signIn_name: '',
        signIn_accountName: '',
        signIn_email: '',
        signIn_password: '',
      },
      user_info: [],
      timeline_tweetContents: [],
    }
  },
  methods: {
    login() {
    firebase.auth().signInWithEmailAndPassword(this.signIn_input.signIn_email, this.signIn_input.signIn_password)
    .then((userCredential) => {
      var user = userCredential.user;
      alert('login しました')
      console.log('signIn run', user)
      TimeLine.methods.fetchTweet()
      this.fetchUser()
    })
    .catch((error) => {
      console.log('signIn error', error)
    });
  },
    signOut: signOut,
  },
}
</script>

<style>
@import '@/styles/nav.css';
</style>
