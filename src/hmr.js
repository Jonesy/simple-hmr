const url = new URL("/_hmr", location.href);
const listener = new EventSource(url);
listener.addEventListener("change", handler);

/**
 * Handle event stream messages. Adapted from esbuild's example
 * @param {MessageEvent<string>} event
 */
function handler(event) {
  for (const link of document.getElementsByTagName("link")) {
    const linkHref = new URL(link.href);

    if (linkHref.host === location.host && event.data) {
      if (event.data.endsWith(".css") || linkHref.pathname === event.data) {
        const next = link.cloneNode();
        next.href = linkHref.pathname + "?t=" + Date.now();
        next.onload = () => link.remove();
        link.parentNode.insertBefore(next, link.nextSibling);
        return;
      }
    }
  }

  location.reload();
}
