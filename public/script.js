Vue.component('root-page', {
  template: `<div><component :key="blok._uid" v-for="blok in blok.body" :blok="blok" :is="'sb-' + blok.component"></component></div>`,
  props: ['blok']
})

Vue.component('root-topic', {
  template: `<div v-editable="blok">
    <h1>{{ blok.Title }}</h1>
    <img :src="blok.Image" />
  </div>`,
  props: ['blok']
})

Vue.component('root-content', {
  template: `<div class="root-content" v-editable="blok">
    <div>
      Date created: {{ blok.DateCreated }}<br>
      Topic: {{ blok.TopicId }}
    </div>
    <h3>Content body</h3>
    <component :key="blok._uid" v-for="blok in blok.contentBody" :blok="blok" :is="'sb-' + blok.component"></component>
    <h3>Video</h3>
    <component :key="blok._uid" v-for="blok in blok.Video" :blok="blok" :is="'sb-' + blok.component"></component>
    <h3>Details</h3>
    <component :key="blok._uid" v-for="blok in blok.Details" :blok="blok" :is="'sb-' + blok.component"></component>
  </div>`,
  props: ['blok']
})

Vue.component('sb-section', {
  template: `<div v-editable="blok" class="section">
    <h2>{{ blok.SectionTitle }}</h2>
    <component :key="blok._uid" v-for="blok in blok.Items" :blok="blok" :is="'sb-' + blok.component"></component>
  </div>`,
  props: ['blok']
})

Vue.component('sb-section-item', {
  template: `<div v-editable="blok" class="section-item">
    <div v-html="content"></div> 
  </div>`,
  props: ['blok'],
  computed: {
    content: function() {
      return marked(this.blok.Content)
    }
  }
})

Vue.component('sb-detail', {
  template: `<div v-editable="blok" class="detail">
    ID: {{ blok.Id }}
  </div>`,
  props: ['blok']
})

Vue.component('sb-video', {
  template: `<div v-editable="blok" class="video">
    <iframe width="560" height="315" :src="'https://www.youtube.com/embed/' + blok.Path" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
  </div>`,
  props: ['blok']
})

new Vue({
  el: '#app',
  template: `<div v-if="story.content.component"><component :blok="story.content" :is="'root-' + story.content.component"></component></div>`,
  data() {
    return {
      story: {
        content: {
          body: []
        }
      }
    }
  },
  created: function() {
    this.$storyblok.on('change', () => { this.loadStory('draft') })
    this.$storyblok.on('published', () => { this.loadStory('draft') })

    this.$storyblok.pingEditor(() => {
      this.loadStory(this.$storyblok.inEditor ? 'draft' : 'published')
    })
  },
  methods: {
    loadStory(version) {
      // The url path of the browser can define which story/content entry you get form the api
      // In the root path of your website you receive the content entry with the slug "home"
      // Replace this with for example a vue router if you are using a single page application
      var path = window.location.pathname == '/' ? 'home' : window.location.pathname

      this.$storyblok.get({
        slug: path,
        version: version
      }, (data) => {
        this.story = {
          content: {
            body: []
          }
        }
        this.$nextTick(() => {
          this.story = data.story
        })
      })
    }
  }
})
