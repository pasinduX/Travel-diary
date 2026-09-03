import type { AlbumPlan } from "@/interface/album";

export const AHANGAMA_TEST_ALBUM_ID = "bf0d5eac-a8e8-4bb0-8369-6cf20039a9c2";

/** Test-only projection of the supplied Ahangama payload into AlbumPlan. */
export const ahangamaTestAlbum: AlbumPlan = {
  title: "Ahangama Trip Highlights",
  subtitle: "An exploration of friendship and nature",
  tone: "JOYFUL_REFLECTIVE",
  chapters: [
    {
      id: "opening",
      order: 0,
      eyebrow: "A VOYALOOM TRAVEL STORY",
      title: "Ahangama, Sri Lanka",
      blocks: [
        { type: "album_cover", imageIds: ["ee13faa6-d227-4c00-bc4e-7412dbc9e3e8"] },
        {
          type: "full_bleed_quote",
          quote:
            "Some places stay with us because of the view. Others because of who was standing beside us.",
        },
        {
          type: "film_strip",
          imageIds: [
            "2e2934b2-4cb1-4dc5-af0a-45a1203f09ec",
            "cb771143-b7a9-48b6-8b3f-2bc4b6663d0c",
            "188e8300-ea23-4a1b-baf0-63855329f29d",
            "07d3d0b5-f353-4e52-bce9-0fc9e755826f",
            "e9bc1bbc-6181-4ca1-a7b5-e484b998fbd0",
          ],
          title: "A Glimpse of Ahangama",
          caption: "Green trails, open water and a coastline waiting to be explored.",
        },
        {
          type: "full_bleed_quote",
          quote:
            "Before the days became stories, there was only the road, the coast, and the feeling of getting away together.",
        },
      ],
    },
    {
      id: "day1",
      order: 1,
      eyebrow: "DAY ONE",
      title: "First Impressions",
      description:
        "The first evening unfolded slowly — arriving, settling in, sharing food and letting the trip begin without needing much of a plan.",
      blocks: [
        {
          type: "chapter_split",
          eyebrow: "DAY ONE",
          title: "First Impressions",
          text: "A first look at Ahangama, followed by an evening of food, familiar faces and the feeling that the trip had finally begun.",
        },
        {
          type: "full_bleed_image",
          imageIds: ["f48e206a-b00a-420c-99a1-d91361e58b96"],
          title: "The First Evening",
          caption: "The lights came on, and the first night quietly found its rhythm.",
        },
        {
          type: "image_caption",
          imageIds: ["bc0f46f4-18c1-425a-953c-0fd7be5eeef5"],
          title: "Around the Table",
          caption: "Good food has a way of making a new place feel familiar.",
        },
        {
          type: "image_caption",
          imageIds: ["d5371983-df31-4de4-82e7-2f455d2e84eb"],
          caption: "Some of the best parts of a trip happen between destinations.",
        },
        {
          type: "image_caption",
          imageIds: ["14252a98-1c30-407a-8579-4a6a9cacd45d"],
          title: "One More Round",
          caption: "The night ended exactly where it should — around a table together.",
        },
        {
          type: "full_bleed_quote",
          quote:
            "The first day was never really about arriving. It was about realizing we were finally here.",
        },
      ],
    },
    {
      id: "day2",
      order: 2,
      eyebrow: "DAY TWO",
      title: "Into the Green and Blue",
      description:
        "The second day moved between trails, water and the coast — the most adventurous part of the trip.",
      blocks: [
        {
          type: "chapter_split",
          eyebrow: "DAY TWO",
          title: "Into the Green and Blue",
          text: "The quiet first evening gave way to a full day outside — walking, exploring and following the coast.",
        },
        {
          type: "full_bleed_image",
          imageIds: ["20c00365-5558-45f4-8f05-5f7e2ba0c128"],
          title: "Into the Green",
          caption: "The trail disappeared into the trees, so we followed it.",
        },
        {
          type: "landscape_pair",
          imageIds: [
            "de251b1d-8381-40b8-865a-1ce8937e77c8",
            "188e8300-ea23-4a1b-baf0-63855329f29d",
          ],
          caption: "By afternoon, the journey had traded green trails for open water.",
        },
        {
          type: "full_bleed_image",
          imageIds: ["07d3d0b5-f353-4e52-bce9-0fc9e755826f"],
          title: "Where the Land Meets the Sea",
          caption: "The coast had its own rhythm — louder, brighter and impossible to ignore.",
        },
        {
          type: "full_bleed_quote",
          quote: "The best days rarely feel planned while you're living them.",
        },
      ],
    },
    {
      id: "day3",
      order: 3,
      eyebrow: "DAY THREE",
      title: "The Slow Goodbye",
      description:
        "The final day became quieter — familiar scenery, slower moments and the first signs that it was almost time to leave.",
      blocks: [
        {
          type: "chapter_split",
          eyebrow: "DAY THREE",
          title: "The Slow Goodbye",
          text: "The last day felt different. Nothing needed to be rushed anymore.",
        },
        {
          type: "full_bleed_image",
          imageIds: ["e9bc1bbc-6181-4ca1-a7b5-e484b998fbd0"],
          title: "One Last Morning",
          caption: "By the final day, even the quiet places felt familiar.",
        },
        {
          type: "story_text",
          imageIds: ["3bc3d167-a0e6-4d6d-b244-62a5e53afbea"],
          title: "Winding Down",
          text: "The pace softened as the trip came closer to its end. The scenery had stopped feeling new, but that somehow made it harder to leave.",
          caption: "The kind of afternoon that asks you to stay a little longer.",
        },
        {
          type: "image_caption",
          imageIds: ["48089a6c-5ed4-4a7e-8afa-734d742327cd"],
          caption: "Even the smallest details became part of the memory.",
        },
        {
          type: "full_bleed_quote",
          quote: "Leaving is how a trip becomes a memory.",
        },
      ],
    },
    {
      id: "closing",
      order: 4,
      eyebrow: "AHANGAMA · SRI LANKA",
      title: "Until the Next Journey",
      blocks: [
        {
          type: "closing_frame",
          imageIds: ["68e4874c-2c55-455b-9cd5-8c6018b319c5"],
          title: "Until the Next Journey",
          caption: "Three days, one coast, and a story worth keeping.",
        },
        {
          type: "full_bleed_quote",
          quote: "The destination gave us the scenery. The people beside us made it a story.",
        },
        { type: "story_text", text: "A VoyaLoom Travel Story" },
      ],
    },
  ],
};
