<template>
  <div id="signIn">
    <div class="signInArea" v-if="!login_info.login_email">
      <h2>サインインしてください</h2>
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
        <router-link to="/login">既にsignInしている方はこちら</router-link><br/>
        <button @click="signIn">signIn</button><br/>
        <button @click="signOut">signOut</button>
      </div>
    </div>
  </div>
</template>

<script>

import firebase from "firebase/app";
import { signOut } from "@/module/signOut.js";

import TimeLine from "@/components/TimeLine.vue";

import { format } from 'date-fns';
const myTimestamp = firebase.firestore.Timestamp.now();
const myToDated = myTimestamp.toDate();
const myShaped = format(myToDated, 'yyyyMMddHHmmss');

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
    signOut: signOut,
    signIn() {
    firebase.auth().createUserWithEmailAndPassword(this.signIn_input.signIn_email, this.signIn_input.signIn_password)
    .then((userCredential) => {
      var user = userCredential.user;
      var uid = user.uid;
      this.createUser(uid)
      alert('signIn しました')
      console.log('signIn run', user)
      TimeLine.methods.fetchTweet()
      this.fetchUser()
    })
    .catch((error) => {
      console.log('signIn error', error)
    });
  },
    createUser(uid) {
      firebase.firestore().collection('user').add({
        u_record: {
          u_createAt: myShaped,
          u_lastEditAt: myShaped,
          u_uuid: uid,
        },
        u_userInfo: {
          u_icon: this.signIn_input.signIn_icon,
          u_name: this.signIn_input.signIn_name,
          u_accountName: this.signIn_input.signIn_accountName,
          u_email: this.signIn_input.signIn_email,
          u_password: this.signIn_input.signIn_password,
        },
      })
      .then((docRef) => {
        console.log("createUser run", docRef.id);
        this.fetchTweet()
      })
      .catch((error) => {
          console.error("Error createUser : ", error);
      });
    },
  },
}
</script>

<style>
@import '@/styles/nav.css';
</style>
