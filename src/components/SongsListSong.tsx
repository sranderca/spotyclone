import {ActionIcon, Card, Center, Stack, Text, ThemeIcon} from "@mantine/core";
import {IconHeart, IconHeartFilled, IconMusic, IconPlayerPlayFilled, IconPlaylistAdd} from "@tabler/icons-react";
import Song from "../types/song.ts";
import {useAtomValue, useSetAtom} from "jotai";
import {globalChangeModel, globalPocketbase} from "../globalState.ts";

export function SongsListSong({song, onPlayClick, onPlaylistAddClick}: { song: Song, onPlayClick: Function, onPlaylistAddClick: Function }) {
  const pb = useAtomValue(globalPocketbase)
  const setChangeModel = useSetAtom(globalChangeModel)
  function toggleFavorite(song: Song) {
    if (!pb.authStore.model)return;
    let newFavs :string[] = []
    if (pb.authStore.model.favorites.includes(song.id)) {
      newFavs = pb.authStore.model.favorites.filter((item: string) => item !== song.id)
    } else {
      newFavs = pb.authStore.model.favorites
      newFavs.push(song.id)
    }
    pb.collection("users").update(pb.authStore.model.id, {
      ...pb.authStore.model,
      favorites: newFavs
    })
    setChangeModel((prev) => !prev)
  }
  return (
    <Card p={0} style={{marginInline: "2em", marginTop: "2em", marginBottom: "1em", backgroundColor: "#1A1B1E"}}>
      <Stack>
        <ThemeIcon size={300}>
          <IconMusic/>
        </ThemeIcon>

        <Center inline style={{justifyContent: "space-between"}}>
          {pb.authStore.model &&
            <ActionIcon onClick={() => toggleFavorite(song)}>
              {pb.authStore.model.favorites.includes(song.id) ? <IconHeartFilled/> : <IconHeart/>}
            </ActionIcon>
          }
          <Stack>

            <Text weight={600} size={"xl"} style={{marginTop: "-0.5em"}}>
              {song.name}
            </Text>
            <Text size={"lg"} style={{marginTop: "-1em"}}>
              {song.artist}
            </Text>
            <Text size={"md"} style={{marginTop: "-1.4em"}}>
              {song.genres.join(", ")}
            </Text>
          </Stack>
          <Stack>
            <ActionIcon onClick={() => onPlaylistAddClick()}>
              <IconPlaylistAdd/>
            </ActionIcon>
            <ActionIcon onClick={() => onPlayClick()}>
              <IconPlayerPlayFilled/>
            </ActionIcon>
          </Stack>
        </Center>
      </Stack>
    </Card>
  )
}