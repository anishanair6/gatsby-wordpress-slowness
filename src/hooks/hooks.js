import { useEffect } from "react"

export const useScript = (url, type) => {
  useEffect(() => {
    const script = document.createElement("script")

    script.src = url

    if (type === 1) {
      script.async = false

      document.head.appendChild(script)
    } else {
      if (url.indexOf("jquery.js") === -1) {
        script.async = true

        document.head.appendChild(script)
      }
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [url, type])
}

export const useScriptInline = (content, node) => {
  useEffect(() => {
    const script = document.createElement("script")

    if (content.indexOf("$") !== -1 || content.indexOf("jQuery") !== -1) {
      return
    }

    var inlineScript = document.createTextNode(content)

    script.appendChild(inlineScript)

    if (node === "head") {
      document.head.appendChild(script)
    } else {
      document.body.appendChild(script)
    }

    return () => {
      if (node === "head") {
        document.head.removeChild(script)
      } else {
        document.body.removeChild(script)
      }
    }
  }, [content, node])
}

export const useStyle = url => {
  useEffect(() => {
    const link = document.createElement("link")

    link.href = url
    link.rel = "stylesheet"

    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [url])
}

export const useStyleInline = content => {
  useEffect(() => {
    const style = document.createElement("style")

    var inlineStyle = document.createTextNode(content)

    style.appendChild(inlineStyle)

    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [content])
}

export const injectResources = data => {
  if (data != null && data.hasOwnProperty("wordpressPage")) {
    if (data.wordpressPage.hasOwnProperty("resource_urls")) {
      data.wordpressPage.resource_urls.style.inline.forEach(function (style) {
        useStyleInline(atob(style.value))
      })
    }
    if (data.wordpressPage.hasOwnProperty("cssLocal")) {
      data.wordpressPage.cssLocal.forEach(function (style) {
        useStyle(style.publicURL)
      })
    }
    if (data.wordpressPage.hasOwnProperty("resource_urls")) {
      data.wordpressPage.resource_urls.style.wordpress_3rdparty.forEach(
        function (style) {
          useStyle(style.url)
        }
      )
    }
    if (data.wordpressPage.hasOwnProperty("jsLocal")) {
      data.wordpressPage.jsLocal.forEach(function (script) {
        useScript(script.publicURL, 1)
      })
    }
    if (data.wordpressPage.hasOwnProperty("jsLocalFooter")) {
      data.wordpressPage.jsLocalFooter.forEach(function (script) {
        useScript(script.publicURL, 0)
      })
    }
    if (data.wordpressPage.hasOwnProperty("resource_urls")) {
      data.wordpressPage.resource_urls.script.inline.forEach(function (script) {
        useScriptInline(atob(script.value), script.node)
      })
    }
    if (data.wordpressPage.hasOwnProperty("resource_urls")) {
      data.wordpressPage.resource_urls.script.wordpress_3rdparty.forEach(
        function (script) {
          useScript(script.url, script.node === "head" ? 1 : 0)
        }
      )
    }
  }
}
