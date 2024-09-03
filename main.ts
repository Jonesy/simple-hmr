import { serveDir, serveFile } from "jsr:@std/http/file-server";
import "jsr:@std/dotenv/load";

const port = Deno.env.get("PORT") ?? 8000;
const hmrURL = Deno.env.get("HMR_URL") ?? "/_hmr";

/**
 * Store connected clients
 */
const clients = new Map<string, ReadableStreamDefaultController>();

async function handler(req: Request) {
  const url = new URL(req.url);

  if (url.pathname === hmrURL) {
    switch (req.method) {
      // POST requests receive the updated file and publish them to the
      // event source
      case "POST": {
        const data = await req.formData();
        const file = data.get("name");

        // Write the updated file to the event stream
        // The client expects it in this format:
        // event: change
        // data: ...
        clients.forEach((value) => {
          const encoder = new TextEncoder();
          value.enqueue(encoder.encode(`event: change\n`));
          value.enqueue(
            encoder.encode(
              `data: ${file}\n\n`,
            ),
          );
        });

        return new Response(`[PUBLISHED] ${file}`);
      }

      // Get requests are from the EventSource on the client side, which
      // register to the ReadableStream. It returns a a keep-alive connection
      // to the client.
      case "GET": {
        const sessionId = crypto.randomUUID();
        const body = new ReadableStream({
          start(controller) {
            clients.set(sessionId, controller);
          },
          cancel() {
            clients.delete(sessionId);
          },
        });

        return new Response(body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      }
    }
  }

  if (url.pathname.startsWith("/src")) {
    return serveDir(req, {
      fsRoot: "src",
      urlRoot: "src",
    });
  }

  return serveFile(req, "index.html");
}

Deno.serve({ port }, handler);
