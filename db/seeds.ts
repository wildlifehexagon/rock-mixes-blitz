import * as fs from "fs"
import * as csv from "fast-csv"
import db from "./index"

type Row = {
  Title: string
  Track: string
  Artist: string
  Song: string
}

const clearTables = async () => {
  await db.artist.deleteMany({})
  await db.song.deleteMany({})
  await db.playlist.deleteMany({})
}

const uniqueArray = (list) =>
  list.filter((val, idx, arr) => arr.findIndex((t) => t.name === val.name) === idx)

// arr.filter((v,i,a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v)))===i)

const seed = async () => {
  let data: Row[] = []

  fs.createReadStream("db/mixes.csv")
    .pipe(csv.parse({ headers: true }))
    .on("data", (row: Row) => {
      data.push(row)
    })
    .on("end", async () => {
      const playlists = data.map((item) => ({
        name: item["Title"],
      }))
      const artists = data.map((item) => ({
        name: item["Artist"],
      }))
      const songs = data.map((item) => ({
        name: item["Song"],
      }))
      try {
        await clearTables()
        await db.artist.createMany({
          data: uniqueArray(artists),
          skipDuplicates: true,
        })
        await db.playlist.createMany({
          data: uniqueArray(playlists),
          skipDuplicates: true,
        })
        await db.song.createMany({
          data: uniqueArray(songs),
          skipDuplicates: true,
        })
        await db.$disconnect()
      } catch (error) {
        console.error(error)
      }
    })
}

export default seed
