import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Counter from "../islands/Counter.tsx";

interface Url {
  link: string;
  shortened: string;
}

export const handler: Handlers<Url> = {
  async GET(req: Request, ctx) {
    const url = new URL(req.url);
    const link = url.searchParams.get("link") || "";

    // make post request to http://localhost:900/link with a json body of an object with "url" key, and the variable link as value
    const res = await fetch("http://localhost:9000/link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: link }),
    });

    const shortened = await res.text();
    return ctx.render({ link, shortened });
  },
};

export default function Home({ data }: PageProps<Url>) {
  const { link, shortened } = data;

  return (
    <>
      <Head>
        <title>Vikas</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <form>
          <input type="text" name="link" value={link} />
          <button type="submit">Shorten</button>
          {shortened && (
            <div>
              <a href={shortened}>{shortened}</a>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
