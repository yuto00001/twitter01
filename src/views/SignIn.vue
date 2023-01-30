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
import allData from "@/module/allData.js";
// import {methods, created} from "@/module/signIn.js";
import firebase from "firebase/app";
import { format } from 'date-fns';
const myTimestamp = firebase.firestore.Timestamp.now();
const myToDated = myTimestamp.toDate();
const myShaped = format(myToDated, 'yyyyMMddHHmmss');

export default {
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
    signIn() {
      firebase.auth().createUserWithEmailAndPassword(this.signIn_input.signIn_email, this.signIn_input.signIn_password)
      .then((userCredential) => {
        var user = userCredential.user;
        var uid = user.uid;
        this.createUser(uid)
        alert('signIn しました')
        console.log('signIn run', user)
        this.fetchTweet()
        this.fetchUser()
      })
      .catch((error) => {
        console.log('signIn error', error)
      });
    },
    login() {
      firebase.auth().signInWithEmailAndPassword(this.signIn_input.signIn_email, this.signIn_input.signIn_password)
      .then((userCredential) => {
        var user = userCredential.user;
        alert('login しました')
        console.log('signIn run', user)
        this.fetchTweet()
        this.fetchUser()
      })
      .catch((error) => {
        console.log('signIn error', error)
      });
    },
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
