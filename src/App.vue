<template>
  <div id="app">
    <nav>
      <router-link to="/about">About</router-link>|
      <router-link to="/signIn">signIn</router-link>|
      <router-link to="/about">login</router-link>
    </nav>
    <router-view/>
    <h1>login : {{ login_info.login_accountName }}</h1>
    <button @click="signOut">signOut</button>
    <div v-if="login_info.login_email">
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

export default {
  components: {
    TimeLine,
    TweetForm,
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
    signOut() {
      firebase.auth().signOut().then(() => {
        alert('logOut しました')
      }).catch((error) => {
        console.log('signOut error', error)
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
    observer() {
      this.login_info.login_email = ' '
      this.login_info.login_uuid = ' '
      this.fetchTweet()
    }
  },
  created() {
    this.observer()
  }
}

</script>
