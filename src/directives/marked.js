import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

hljs.initHighlightingOnLoad()

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  langPrefix: 'hljs language-',
  highlight: function (code, lang, callback) {
    return hljs.highlight(lang, code).value
  }
})

const install = function(Vue) {
  /* istanbul ignore if */
  if (install.installed) return
  Vue.directive('marked', function(el, binding, vnode) {
    if (!el.rendered) {
      el.innerHTML = marked(el.innerText)
      el.rendered = true
    }
  })
}

export default install
