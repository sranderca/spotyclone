import {useAtomValue, useSetAtom} from "jotai";
import {
  globalChangeModel,
  globalCurrentSongDetails,
  globalCurrentSongInstance,
  globalPocketbase,
  globalSongsPlaylist
} from "../globalState.ts";
import {useEffect, useState} from "react";
import Song from "../types/song.ts";
import {Howl} from "howler";
import {SongsListSong} from "./SongsListSong.tsx";
import {Center, Grid} from "@mantine/core";

//lista de canciones

export function SongsList() {
  const pb = useAtomValue(globalPocketbase); //instancia bd
  const setPlaylist = useSetAtom(globalSongsPlaylist) //obtengo la playlist global
  const setCurrentSongInst = useSetAtom(globalCurrentSongInstance)//instancia global cancion
  const setCurrentSongDet = useSetAtom(globalCurrentSongDetails)
  const changeModel = useAtomValue(globalChangeModel)
  const [currentPage,] = useState(1) 
  const [songs, setSongs] = useState<Song[]>([]); //resultados de la cancion(el cuadrado que vemos con la inf)
  useEffect(() => {
    getSongs()
  }, [changeModel])

  //con la bd obtiene una lista de hasta 30 canciones
  async function getSongs() {
    const songs = (await pb.collection("songs").getList<Song>(currentPage, 30)).items;
    setSongs(songs || [])
  }

  //cuando se le play desde el cuadro inicia la cancion
  async function playSong(song: Song) {
    const url = pb.getFileUrl(song as never, song.song)
    setCurrentSongInst(new Howl({
      src: [url]
    }))
    setCurrentSongDet(song);
  }

  return (

    <Grid grow gutter={"xs"} justify={"flex-start"} align={"stretch"} style={{ paddingBottom: "8%"}}>
      {songs.map((s) =>
        <Grid.Col span={2} key={s.id}>
          <Center >
            <SongsListSong  song={s} onPlayClick={() => playSong(s)}
                           onPlaylistAddClick={() => setPlaylist((prev) => [...prev, s])}/>
          </Center>
        </Grid.Col>
      )}
    </Grid>
  )
}