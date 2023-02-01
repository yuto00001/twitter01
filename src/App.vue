<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>|
      <router-link to="/signIn">signIn</router-link>|
      <router-link to="/login">login</router-link>
    </nav>
    <router-view/>
    <h2 v-if="!login_info.login_email">サインインしてください</h2>
    <div v-if="login_info.login_email">
      <h1>login : {{ login_info.login_accountName }}</h1>
      <button @click="signOut">signOut</button>
      <TweetForm v-model="tweetContent"
      :loginInfo="login_info"
      @fetchTweetChild="fetchTweet"
      />
      <TimeLine v-for="(tweet, index) in timeline_tweetContents"
      :tweet="tweet"
      :loginInfo="login_info"
      @fetchTweetChild="fetchTweet"
      :key="index"
      />
    </div>

  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  padding: 30px;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav a.router-link-exact-active {
  color: #42b983;
}

.post,
.timeline {
  border: 1px solid;
  height: 20vh;
  width: 80%;
  margin: auto;
}
.post img,
.timeline img {
  width: 50px;
}
.post {
  border: 1px solid;
  height: 20vh;
  width: 80%;
  margin: auto;
}
.post input {
  height: 10vh;
  width: 85%;
  margin: 2% auto;
}
.post button {
  height: 5vh;
  width: 20%;
  margin: 0 0 0 60%;
}
.timeline {
height: 40vh;
}
.timelinePost {
  border: 1px solid;
  margin: 1%;
}
.timeline .timelineArea {
  background-color: rgba(186, 217, 243, 0.602);
  height: 30vh;
  width: 90%;
  margin: auto;
}
.timeline .information {
  display: flex;
  position: relative;
  justify-content: space-between;
}
.timeline .information .info {
  display: flex;
  width: -webkit-fill-available;
}
.timeline .information .info p {
  padding: 0 1%;
}
.timeline .information .menu {
  user-select: none;
  align-self: center;
  margin: 0 5% 0 0;
  cursor: pointer;
}
.timeline .information .menu h2{
  margin: auto 0;
}
.timeline .information .modalMenu{
  user-select: none;
  background-color: #38679c8e;
  border: 1px solid;
  border-radius: 5%;
  padding: 3%;
  position: absolute;
  top: 20%;
  right: 8%;
}
.timeline .information .modalMenu p{
  text-align: start;
}
.timeline .timelinePost .likeEtc{
  display: flex;
  width: 80%;
  margin: auto;
}
.timeline .timelinePost .likeEtc button{
  display: flex;
  align-items: center;
  height: fit-content;
  padding: 0 2%;
  margin: 0 10%;
}
.timeline .timelinePost .likeEtc button img{
  width: 70%;
}
.timeline .timelinePost .likeEtc button p{
  margin: 0;
}
</style>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import TimeLine from "@/components/TimeLine.vue";
import TweetForm from "@/components/TweetForm.vue";

import allData from "@/module/allData.js";


import { format } from 'date-fns';
const myTimestamp = firebase.firestore.Timestamp.now();
const myToDated = myTimestamp.toDate();
const myShaped = format(myToDated, 'yyyyMMddHHmmss');
export default {
  components: {
    TimeLine,
    TweetForm,
  },
  data() {
    return {
      tweetContent: allData.tweetContent,
      login_info: allData.login_info,
      signIn_input: allData.signIn_input,
      user_info: allData.user_info,
      timeline_tweetContents: allData.timeline_tweetContents,
    }
  },
  methods: {
    signOut() {
      firebase.auth().signOut().then(() => {
        alert('logOut しました')
      }).catch((error) => {
        console.log('signOut error', error)
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
    sortTweet() {
      this.timeline_tweetContents.sort((a, b) => {
        if(a.t_record.t_createAt < b.t_record.t_createAt) {
          return 1;
        }else if (a.t_record.t_createAt > b.t_record.t_createAt) {
          return -1;
        } else {
          return 0;
        }
      });
      console.log('sortTweet run')
    },
    fetchUser() {
      if(!this.login_info.login_email) {
        return
      } else {
      console.log('fetchUser');
      firebase.firestore().collection("user").where('u_record.u_uuid', "==", this.login_info.login_uuid).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log('fetchUser doc', doc.id, " => ", doc.data());
            this.user_info.push(doc.data())
            this.login_info.login_accountName = doc.data().u_userInfo.u_accountName
            this.login_info.login_name = doc.data().u_userInfo.u_name
            this.login_info.login_icon = doc.data().u_userInfo.u_icon
          });
        })
        .catch((error) => {
          console.log('fetchUser error',error)
        });
      }
    },
    fetchTweet() {
      this.timeline_tweetContents = []
      if(!this.login_info.login_email) {
        return
      } else {
        console.log('fetchTweet');
        firebase.firestore().collection("tweet").get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const newDoc = {
              ...doc.data(),
              t_userInfo: {...doc.data().t_userInfo, t_docId: doc.id},
            }
            this.timeline_tweetContents.push(newDoc)
            console.log('fetchTweet doc', doc.id, " => ", doc.data());
          })
          this.sortTweet()
        })
      }
    },
    observer() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.login_info.login_email = user.email
          this.login_info.login_uuid = user.uid
          this.signIn_input.signIn_icon = ''
          this.signIn_input.signIn_name = ''
          this.signIn_input.signIn_accountName = ''
          this.signIn_input.signIn_email = ''
          this.signIn_input.signIn_password = ''
          console.log('observer run', user)
          this.fetchTweet()
          this.fetchUser()
        } else {
          this.login_info.login_accountName = ''
          this.login_info.login_email = ''
          this.login_info.login_name = ''
          this.login_info.login_uuid = ''
          this.user_info = ''
          this.timeline_tweetContents = ''
        }
      });
    }
  },
  created() {
    this.observer()
  }
}

</script>
