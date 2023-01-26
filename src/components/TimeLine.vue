<template>
  <div class="timeline">
    <div class="timelinePost">
      <div class="information">
        <div class="info">
        <img src="@/assets/logo.png" alt="">
        <p>{{ tweet.t_userInfo.t_name }}</p>
        <p>@{{ tweet.t_userInfo.t_accountName }}</p>
        <p>経過時間</p>
        </div>
        <div class="menu" @click="tweetMenu(tweet)">
          <h2>=</h2>
        </div>
        <div class="modalMenu" v-show="tweet.t_isDisplay">
          <p v-if="loginInfo.login_accountName === tweet.t_userInfo.t_accountName" v-on:click="deleteTweet(tweet)">
            削除
          </p>
          <p v-if="loginInfo.login_accountName !== tweet.t_userInfo.t_accountName">〇〇さんをフォロー</p>
          <p v-if="loginInfo.login_accountName !== tweet.t_userInfo.t_accountName">〇〇さんをブロック</p>
        </div>
      </div>
      <div class="timelineArea">{{ tweet.t_content.t_textContent }}</div>
      <div class="likeEtc">
        <button>
          <img src="@/assets/logo.png" alt="">
          <p>{{ tweet.t_reaction.t_commentCount }}</p>
        </button>
        <button>
          <img src="@/assets/logo.png" alt="">
          <p>{{ tweet.t_reaction.t_likeCount }}</p>
        </button>
        <button>
          <img src="@/assets/logo.png" alt="">
          <p>{{ tweet.t_reaction.t_retweetCount }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  name: 'TimeLine',
  props: {
    tweet: {
      type: Object,
      require: true,
    },
    loginInfo: {
      type: Object,
      // required: true,
      default() {
        return {
          login_uuid: ' ',
          login_email: ' ',
          login_name: ' ',
          login_accountName: ' ',
          login_icon: ' ',
        }
      },
    },
  },
  methods: {
    tweetMenu (tweet) {
      if(tweet.t_isDisplay) {
        tweet.t_isDisplay = false
      } else {
        tweet.t_isDisplay = true
      }
    },
    deleteTweet(tweet) {
      console.log('deleteTweet run', tweet)
      firebase.firestore().collection("tweet").doc(tweet.t_userInfo.t_docId).delete()
      .then(() => {
        console.log("Document successfully deleted!");
        this.$emit('fetchTweetChild')
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    },
  },
}
</script>
