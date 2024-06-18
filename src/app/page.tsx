import { sanityFetch } from "@/sanity/lib/fetch";
import { FrontPage } from "@/types/pages";
import { groq } from "next-sanity";

export default async function Home() {

  const pageData = await sanityFetch<FrontPage>({
    query: groq`*[_type == "frontPage"][0]{
      title,
    }`,
  })

  return (
    <main className="">
      <h1 className="text-5xl text-center">
        {pageData.title}
      </h1>
      {
        // Calculator block
      }
      {
        //Comparison block
      }
    </main>
  );
}
