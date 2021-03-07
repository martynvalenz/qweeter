<template>
  <q-page class="relative-position">
    <q-scroll-area
      class="absolute full-width full-height"
    >
      <div class="q-py-lg q-px-md row items-end q-gutter-md">
        <div class="col">
          <q-input
            v-model="newQweetContent"
            class="new-qweet"
            :dense="dense"
            placeholder="What's happening?"
            maxlength="280"
            bottom-slots
            counter
            outlined
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
            </template>
            <template v-slot:append>
              <q-icon v-if="newQweetContent !== ''" name="close" @click="newQweetContent = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet()"
            color="primary"
            label="Send"
            class="q-mb-lg"
            no-caps
            rounded
            unelevated
            :disable="!newQweetContent"
          />
        </div>
      </div>
      <q-separator
        class="divider"
        color="grey-1"
        size="10px"
      />
      <q-list
        separator
      >
      <transition-group
        appear
        enter-active-class="animated fadeIn slow"
        leave-active-class="animated fadeOut slow"
      >
        <q-item
            v-for="qweet in qweets"
            :key="qweet.id"
            class="q-py-md qweet"
          >
            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar2.jpg">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Danny Devito</strong>
                <span class="text-grey-7">
                  @danny_devito_ptm
                  <br class="lt-md" >&bull; {{ qweet.date | relativeDate }}
                </span>
              </q-item-label>
              <q-item-label class="qwett-content text-body1">
                {{ qweet.content }}
              </q-item-label>
              <div class="qweet-icons row justify-between q-mt-sm">
                <q-btn
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  :color="qweet.liked ? 'pink':'grey'"
                  :icon="qweet.liked ? 'fas fa-heart':'far fa-heart'"
                  size="sm"
                  flat
                  round
                  @click="toggleLiked(qweet)"
                />
                <q-btn
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                  flat
                  round
                  @click="deleteQweet(qweet)"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
  import {formatDistance} from 'date-fns'
  import db from 'src/boot/firebase'
  // import { es } from 'date-fns/locale'
  export default {
    name: 'PageHome',

    data(){
      return{
        newQweetContent:'',
        dense:false,
        qweets:[]
      }
    },

    mounted(){
      db.collection('qweets').orderBy('date').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let qweetChange = change.doc.data()
          qweetChange.id = change.doc.id

          if (change.type === 'added') {
            this.qweets.unshift(qweetChange)
          }
          if (change.type === 'modified') {
            let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
            // this.qweets.splice(index,1, qweetChange)
            Object.assign(this.qweets[index], qweetChange)
          }
          if (change.type === 'removed') {
            let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
            this.qweets.splice(index,1)
          }
        })
      })
    },

    filters:{
      relativeDate(value){
        return formatDistance(value, new Date())
      }
    },

    methods:{
      addNewQweet(){
        let newQweet = {
          content:this.newQweetContent,
          date:Date.now(),
          liked:false
        }

        db.collection('qweets').add(newQweet)
        .then(() => {
          
        })
        .catch((error) => {
          console.log(error)
        });

        this.newQweetContent = ''
      },

      deleteQweet(qweet){
        db.collection('qweets').doc(qweet.id).delete()
        .then(() => {

        })
        .catch(error => {
          console.log(error)
        })
      },

      toggleLiked(qweet){
        db.collection('qweets').doc(qweet.id).update({
          liked:!qweet.liked
        })
        .then(() => {

        })
        .catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style lang="sass">
  .new-qweet
    textarea
      font-size: 19px
      line-height: 1.4 !important
  .divider
    border-top: 1px solid
    border-bottom: 1px solid
    border-color: $grey-3
  .qweet:not(:first-child)
    border-top: 1px solid rgba(0,0,0,0.12)
  .qwett-content
    white-space: pre-line
  .qweet-icons
    margin-left: -5px
</style>