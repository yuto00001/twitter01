<template>
  <div class="post">
    <img src="@/assets/logo.png" alt="">
    <input type="text" placeholder="いまどうしてる？" v-model="tweetContent">
    <button @click="createTweet">ツイートする</button>
  </div>
</template>
<script>
import firebase from "firebase/app";

import { format } from 'date-fns';
const myTimestamp = firebase.firestore.Timestamp.now();
const myToDated = myTimestamp.toDate();
const myShaped = format(myToDated, 'yyyyMMddHHmmss');

export default {
  name: 'TweetForm',
  props: {
    loginInfo: {
      type: Object,
      required: true, //必須かどうかを判定。エラーを返してくれる。
    }
  },
  data() {
    return {
      tweetContent: '',
    }
  },
  methods: {
    createTweet() {
      this.$emit('update: tweetContent', this.tweetContent)
      firebase.firestore().collection('tweet').add({
        t_record: {
          t_createAt: myShaped,
          t_lastEditAt: myShaped,
        },
        t_userInfo: {
          t_icon: this.loginInfo.login_icon,
          t_name: this.loginInfo.login_name,
          t_accountName: this.loginInfo.login_accountName,
        },
        t_content: {
          t_textContent: this.tweetContent,
          t_wordCount: 13,
          t_mediaContent: '',
        },
        t_reaction: {
          t_commentCount: 0,
          t_retweetCount: 0,
          t_likeCount: 0,
        },
        t_isDisplay: false,
      })
      .then((docRef) => {
        this.tweetContent = ''
        console.log("createTweet run", docRef);
        this.$emit('fetchTweetChild')
      })
      .catch((error) => {
          console.error("Error createTweet : ", error);
      });
    },
  }
}
</script>
