import { firebase } from "@/main.js"
import { format } from 'date-fns';
const myTimestamp = firebase.firestore.Timestamp.now();
const myToDated = myTimestamp.toDate();
const myShaped = format(myToDated, 'yyyyMMddHHmmss');

export default {
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
      firebase.auth().onAuthStateChanged((user) => { //todo これだけでyutoを特定し、取得できている？userが増えたらどうなる？
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
