import {ActionIcon, Affix, Avatar, Button, Card, Center, Divider, Grid, Modal, rem, Stack, Text} from "@mantine/core";
import {IconLogout, IconUser} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useAtomValue} from "jotai";
import {globalChangeModel, globalPocketbase} from "../globalState.ts";
import Song from "../types/song.ts";
import {PlaylistSong} from "./PlaylistSong.tsx";
import {Auth} from "./Auth.tsx";

function LeftAffix() {
  const [isOpened, setIsOpened] = useState(false);
  const pb = useAtomValue(globalPocketbase)
  const changeModel = useAtomValue(globalChangeModel)
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  useEffect(() => {
    if (!pb.authStore.model) return
    pb.collection("users").getOne(pb.authStore.model.id, {expand: "favorites"}).then((user) => {
      console.log(user)
      setFavorites(user.expand.favorites as never || [])
    })
  }, [isOpened, changeModel])

  return (
    <>
      <Modal opened={isOpened} onClose={() => setIsOpened(false)} fullScreen>
        <div style={{marginInline: "5em", marginTop: "10em"}}>
          <Stack style={{height: "100%", paddingBottom: "10em", justifySelf: "left"}}>
            <Text size={"2em"} style={{marginLeft: "1em"}}>
              {pb.authStore.model?.name}
            </Text>
            <Divider/>
            <Grid>
              {favorites && favorites.map((song) =>
                <Grid.Col span={4} key={song.id}>

                  <PlaylistSong song={song}/>
                </Grid.Col>
              )
              }
            </Grid>
          </Stack>
        </div>
      </Modal>
      <Modal opened={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Auth/>
      </Modal>
      <Affix position={{left: rem(10), top: rem(10)}}>
        <Card onClick={pb.authStore.model ? () => setIsOpened(true) : undefined}
              style={isLoginOpen ? {display: "none"} : undefined}>
          {pb.authStore.model &&
              <Center>
                  <Avatar radius={"xl"} variant={"filled"}>
                      <IconUser/>
                  </Avatar>

                  <Text weight={600} style={{marginLeft: "1em"}}>
                    {pb.authStore.model?.name}
                  </Text>
                  <ActionIcon style={{marginLeft: "0.3em"}} onClick={(e) => {
                    e.preventDefault();
                    pb.authStore.clear();
                    window.location.reload();
                  }}>
                      <IconLogout/>
                  </ActionIcon>
              </Center>
          }
          {!pb.authStore.model && <Center>
              <Button color={"green"} onClick={() => setIsLoginOpen(true)}>Identificate</Button>
          </Center>
          }
        </Card>
      </Affix>
    </>
  )
}

export default LeftAffix