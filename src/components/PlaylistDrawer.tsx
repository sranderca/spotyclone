import {Drawer, Stack, Text} from "@mantine/core";
import {useAtom} from "jotai";
import {
  globalChangeModel,
  globalCurrentSongDetails,
  globalPlaylistDrawerOpened,
  globalSongsPlaylist
} from "../globalState.ts";
import {PlaylistSong} from "./PlaylistSong.tsx";
import {useAtomValue} from "jotai/index";
import {nanoid} from "nanoid";
import {useEffect} from "react";

//esta es la lista de reproduccion que esta al lado del scrol del volumen

export function PlaylistDrawer() {
  const [isOpen, setIsOpen] = useAtom(globalPlaylistDrawerOpened)
  const playlist = useAtomValue(globalSongsPlaylist); //obtiene las canciones de que estan en la playlist
  const currentSongDet = useAtomValue(globalCurrentSongDetails);
  const changeModel = useAtomValue(globalChangeModel);
  //este lo que hace es iterar sobre la lista de canciones y crear el componente playlistsong que es el cuadro pequeño
  useEffect(() => {
    console.log("trin")
  }, [changeModel])
  
  return (
    <Drawer opened={isOpen} onClose={() => setIsOpen(false)} withCloseButton={false} position={"right"}
            styles={{inner: {height: "40em", marginTop: "10em"}, content: {borderRadius: "90%"}}}>
      <Stack>
        <Text>
          Reproduciendo Actualmente
        </Text>
        {currentSongDet &&
            <PlaylistSong song={currentSongDet} key={nanoid()}/>
        }
        {playlist.length > 0 && <Text>
            A continuacion
        </Text>
        }
        {playlist.length > 0 && playlist.map((song) =>
          <PlaylistSong song={song} key={song.id}/>
        )}
      </Stack>
    </Drawer>
  )
}