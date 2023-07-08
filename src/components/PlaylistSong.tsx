import {ActionIcon, Avatar, Card, Center, Stack, Text} from "@mantine/core";
import {IconHeart, IconHeartFilled, IconMusic} from "@tabler/icons-react";
import Song from "../types/song.ts";
import {useAtomValue, useSetAtom} from "jotai";
import {globalChangeModel, globalPocketbase} from "../globalState.ts";

export function PlaylistSong({ song }: { song: Song}) {
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
    <Card p={0} style={{ backgroundColor: "#1A1B1E"}}>
      <Center inline>

      <Avatar size={"lg"} variant={"filled"}>
        <IconMusic/>
      </Avatar>
      <Stack style={{ marginLeft: "0.5em"}}>
        <Text weight={500} style={{ marginBottom: "-0.5em"}}>
          {song.name}
        </Text>
        <Text weight={200} style={{ marginTop: "-0.5em"}}>
          {song.artist}
        </Text>
      </Stack>
        {pb.authStore.model &&

        <ActionIcon onClick={() => toggleFavorite(song)} style={{ marginLeft: "1em"}}>
        {pb.authStore.model.favorites.includes(song.id) ? <IconHeartFilled/> : <IconHeart/>}
        </ActionIcon>
        }
      </Center>
    </Card>
    )
}