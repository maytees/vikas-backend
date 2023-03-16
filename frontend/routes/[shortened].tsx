import { Handlers, PageProps } from "$fresh/server.ts";

interface Url {
  link: string;
}

export const handler: Handlers<Url | null> = {
  async GET(req: Request, ctx) {
    const shortened = ctx.params.shortened;
    const res = await fetch(`http://localhost:9000/link/${shortened}`);
    const link = await res.text();
    if (!link) return Response.redirect("/", 404);

    // Redirect to link
    return Response.redirect(link, 307);
  },
};

export default function Page() {
  return <div>asdf</div>;
}
