import {
  ActionIcon,
  Affix,
  Button,
  Center,
  FileInput,
  Input,
  Modal,
  MultiSelect,
  rem,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import {IconPlayerPlayFilled, IconPlaylistAdd, IconSearch, IconUpload} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useDebouncedValue} from "@mantine/hooks";
import {useAtomValue, useSetAtom} from "jotai";
import {
  globalCurrentSongDetails,
  globalCurrentSongInstance,
  globalPocketbase,
  globalSongsPlaylist
} from "../globalState.ts";
import Song from "../types/song.ts";
import {PlaylistSong} from "./PlaylistSong.tsx";
import {nanoid} from "nanoid";
import {Howl} from "howler";
import {useForm} from "@mantine/form";
import {MusicGenres} from "../constants.ts";
//este archivo se encarga de la busqueda de las canciones

export function RightAffix() {
  const [uploadModalOpened, setUploadModalOpened] = useState(false)
  const [searchModalOpened, setSearchModalOpened] = useState(false)
  const [inputVal, setInputVal] = useState("")//estado del input de busqueda
  const [results, setResults] = useState<Song[]>([])//obtiene una lista de las canciones que salieron en la busqueda
  const setCurrentSongInst = useSetAtom(globalCurrentSongInstance)
  const setCurrentSongDet = useSetAtom(globalCurrentSongDetails)
  const pb = useAtomValue(globalPocketbase)
  const [val] = useDebouncedValue(inputVal, 100)
  const setPlaylist = useSetAtom(globalSongsPlaylist)

  //pone la cancion a sonar desde el buscador 
  async function playSong(song: Song) {
    const url = pb.getFileUrl(song as never, song.song)
    setCurrentSongInst(new Howl({
      src: [url]
    }))
    setCurrentSongDet(song);
  }
  //actualiza los resultados de las busquedas(haciendo una peticion a la bd)
  //esto lo hace por similitud del nombre
  useEffect(() => {
    if (!searchModalOpened) return;
    console.log("Searching..")
    pb.collection("songs").getList<Song>(1, 10, {
      filter: `name ~ "${val}"`
    }).then((r) => {
      setResults(r.items)
    })
    console.log("Model", pb.authStore.model)
  }, [pb, val])

  const form = useForm({
    initialValues: {
      name: '',
      artist: '',
      thumbnail: null,
      genres: '',
      song: null,
    },
  });
  //Aqui basicamente se crea la nueva cansion, de aqui se setean todos los campos ingresados a la bd
  const handleSubmit = ( {name, artist, thumbnail, genres, song }:  {name: string, artist: string, thumbnail: null | File , genres: string, song: null | File}) => {
    console.log(`Values`, name, artist, thumbnail, genres, song);
    const formData = new FormData();

    formData.append("name", name)
    formData.append("artist", artist)
    thumbnail ? formData.append("thumbnail", thumbnail) : console.log("Thumbnail not provided")
    formData.append("genres", genres)
    if (!song) {
      console.error("Song not provided")
      return
    }
    formData.append("song", song)
    pb.collection("songs").create(formData).then((res) => {
      console.log(res)
      form.reset()
    })
  
  };


  return (
    <div>

      <Modal opened={searchModalOpened} onClose={() => setSearchModalOpened(false)} withCloseButton={false}>
        <Input icon={<IconSearch/>} value={inputVal} onChange={(e) => setInputVal(e.target.value)}
               style={{marginBottom: "1em"}}/>
        <Stack style={{justifyContent: "left"}}>

          {results && results.map((s) =>
            <Center inline>

              <div style={{marginTop: "0.5em", width: "100%"}}>
                <PlaylistSong key={nanoid()} song={s}/>
              </div>
              <Center>
                <ActionIcon style={{marginRight: "0.2em"}} onClick={() => setPlaylist((prev) => {
                  if (prev.includes(s)) return prev;
                  return [...prev, s]
                })}>
                  <IconPlaylistAdd/>
                </ActionIcon>
                <ActionIcon onClick={() => playSong(s)}>
                  <IconPlayerPlayFilled/>
                </ActionIcon>
              </Center>
            </Center>
          )}
          {results.length === 0 && <Center>
              <Text>
                  No se encontraron resultados
              </Text>
          </Center>}
        </Stack>
      </Modal>
      <Modal opened={uploadModalOpened} onClose={() => setUploadModalOpened(false)} withCloseButton={false} >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            label="Name"
            placeholder="Enter the name"
            required
            style={{marginTop: "1em"}}
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Artist"
            placeholder="Enter the artist"
            required
            style={{marginTop: "1em"}}
            {...form.getInputProps("artist")}
          />

          <FileInput
            label="Thumbnail"
            placeholder="Drop or select an image"
            accept="image/*"
            style={{marginTop: "1em"}}
            {...form.getInputProps("thumbnail")}
          />

          <MultiSelect
            data={MusicGenres}
            label="Genres"
            placeholder="Enter the genres"
            required
            style={{marginTop: "1em"}}
            {...form.getInputProps("genres")}
          />

          <FileInput
            label="Song"
            placeholder="Drop or select an audio file"
            accept="audio/webm,audio/mp3"
            required
            style={{marginTop: "1em"}}
            {...form.getInputProps("song")}
          />

          <Button type="submit" style={{marginTop: "1em"}}>Submit</Button>
        </form>
      </Modal>
      <Affix position={{top: rem(10), right: rem(15)}}>
        <Center>
          {pb.authStore.model &&
          <ActionIcon variant={"filled"} size={"xl"} onClick={() => setUploadModalOpened(true)}>
            <IconUpload/>
          </ActionIcon>
          }
          <ActionIcon style={{marginLeft: "1em"}} variant={"filled"} size={"xl"}
                      onClick={() => setSearchModalOpened(true)}>
            <IconSearch/>
          </ActionIcon>
        </Center>
      </Affix>
    </div>
  )
}