import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { useState } from "preact/hooks";

import Counter from "../islands/Counter.tsx";

interface Url {
  link: string;
  shortened: string;
  length: number;
}

export const handler: Handlers<Url> = {
  async GET(req: Request, ctx) {
    const url = new URL(req.url);
    let link = url.searchParams.get("link") || "";
    let length = parseInt(url.searchParams.get("length")!) || 4;

    if (isNaN(length)) length = 4;
    else if (length < 4) length = 4;
    else if (length > 32) length = 32;

    // If link doesnt have http or https, add http
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      link = "http://" + link;
    }

    if (link) {
      try {
        new URL(link);
      } catch (e) {
        return ctx.render({
          link,
          shortened: "Bad request; specifiy url in json body",
          length,
        });
      }
    }

    const res = await fetch("http://localhost:9000/link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: link, length }),
    });

    const shortened = await res.text();
    return ctx.render({ link, shortened, length });
  },
};

export default function Home({ data }: PageProps<Url>) {
  const { link, shortened, length } = data;

  return (
    <>
      <Head>
        <title>Vikas</title>
      </Head>
      <div class="flex items-center flex-col justify-center h-screen pb-32">
        <div class="flex items-center flex-col justify-center">
          <img
            src="/vikas.svg"
            alt="Vikas"
            class="w-50 h-50 mb-5"
          />
          <h1 class="text-7xl font-bold text-slate-800">
            Vikas
          </h1>
          <h2 class="text-2xl font-medium">
            The{" "}
            <span class="font-bold text-indigo-600 animate-pulse">
              URL
            </span>{" "}
            shortener
          </h2>
        </div>

        <div class="flex items-center flex-col justify-center p-4 mx-auto max-w-screen-md">
          <form>
            <div class="flex flex-col">
              <label for="link" class="text-sm font-medium text-gray-700">
                Link
              </label>
              <div class="mt-1">
                <input
                  type="text"
                  name="link"
                  id="link"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={link}
                />
              </div>
            </div>
            {/* Create dropdown with a length slider, which can be adjusted from 4 characters to 32 */}
            <div class="flex flex-col mt-2">
              <label for="length" class="text-sm font-medium text-gray-700">
                Length
              </label>
              <div class="mt-1">
                <input
                  type="number"
                  name="length"
                  id="length"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={length}
                />
              </div>
            </div>

            <div class="flex justify-center items-center mt-2">
              <button
                type="submit"
                class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Shorten
              </button>
            </div>
            {shortened !== "Bad request; specifiy url in json body"
              ? (
                <div class="mt-2 flex justify-center align-center font-medium text-indigo-600">
                  <a href={shortened}>https://vikas.matees.net/{shortened}</a>
                </div>
              )
              : null}
          </form>
        </div>
      </div>
    </>
  );
}
