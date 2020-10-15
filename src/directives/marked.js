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
      el.children.forEach(elem => {
        if (elem.tagName === 'PRE') {
          elem.children.forEach(code => {
            if (code.tagName === 'CODE') {
              const codeCount = code.innerText.replace(/<\/?span[^>]*>/g, '').split(/\r\n|\r|\n/).length
              let lineNumberText = '<figure class="highlight yaml"><table><tbody><tr><td class="gutter"><pre><code class="hljs">'
              for (let i = 0; i < codeCount; i++) {
                lineNumberText += '<span class="hljs-class">' + (i + 1) + '</span><br>'
              }
              lineNumberText += '</code></pre></td>'
              elem.outerHTML = lineNumberText + '<td class="code">' + elem.outerHTML + '</td></tr></tbody></table></figure>'
            }
          })
        }
      })
      el.rendered = true
    }
  })
}

export default install
