
TimeLine.vue
○ fetchTweetの処理を確認。
断念
**子コンポーネントでfetchTweetをしようとすると、this.timeline_tweetContents.push(newDoc)を$emitを使って行わなければならなくなる。それにともなう変更処理がわからず断念。**




ーーーー

親コンポーネントでは、「状態」を記述することを心がけ、
子コンポーネントでは、「処理」を記述することを心がける。


ーーーーーーーーーー



Propsは親コンポーネントから子コンポーネントへ一方的にpropsを渡すことができます。
**そのため子コンポーネントでは受け取ったpropsを更新してはいけません。**
子コンポーネントから親コンポーネントへデータを送りたい場合はemitを利用したイベントを利用してpropsを使って渡された値はすべて親のコンポーネントで更新処理を行います。




  props: {
    tweet: {
      type: Object,
      require: true,
    },
  },
    methods: {
    fetchTweet() {
      this.com_timeline_data = []
      console.log('fetchTweet');
      firebase.firestore().collection("tweet").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const newDoc = {
            ...doc.data(),
            t_userInfo: {...doc.data().t_userInfo, t_docId: doc.id},
          }
          this.com_timeline_data.push(newDoc)
          console.log('fetchTweet doc', doc.id, " => ", doc.data());
        })
      })
    },
  },
