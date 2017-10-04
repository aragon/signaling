import Vue from 'vue'
import signaling from 'comps/signaling/signaling.vue'

const initAppElement = (id = '#app') => {
  if (document.querySelector(id)) {
    return id
  }
  const main = document.createElement('div')
  main.id = id.slice(1)
  document.body.appendChild(main)
  return id
}

new Vue({
  el: initAppElement(),
  render: h => h(signaling),
})
