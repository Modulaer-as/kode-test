import { defineType } from "sanity"


export const frontPage = defineType({
    name: "frontPage",
    title: "Frontpage",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
        },
        //calculator block
        //comparison block
    ],
})