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
      @parentObserver="observer"
      />
      <TimeLine v-for="(tweet, index) in timeline_tweetContents"
      :tweet="tweet"
      :loginInfo="login_info"
      :key="index"
      />
    </div>

  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import TimeLine from "@/components/TimeLine.vue";
import TweetForm from "@/components/TweetForm.vue";
import { signOut } from "@/module/signOut.js";

export default {
  name: 'appComponent',
  components: {
    TimeLine,
    TweetForm, //todo 次確認
  },
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
    fetchUser() {
      if(!this.login_info.login_email) {
      return
    } else {
      console.log('fetchUser');
      firebase.firestore().collection("user").where('u_record.u_uuid', "==", this.login_info.login_uuid).get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          console.log('fetchUser doc', doc.id, " => ", doc.data());
          this.user_info.push(doc.data());
          this.login_info.login_accountName = doc.data().u_userInfo.u_accountName;
          this.login_info.login_name = doc.data().u_userInfo.u_name;
          this.login_info.login_icon = doc.data().u_userInfo.u_icon;
        }
      })
      .catch((error) => {
        console.error('fetchUser error',error)
      });
    }
    },
    fetchTweet() {
      this.timeline_tweetContents = []
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
    },
  },
  created() {
    this.observer()
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
