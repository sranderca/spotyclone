import {useAtomValue, useSetAtom} from "jotai/index";
import {
  globalCurrentSongDetails,
  globalCurrentSongInstance,
  globalPlaylistDrawerOpened, globalPocketbase,
  globalSongsPlaylist
} from "../globalState.ts";
import {useEffect, useState} from "react";
import {formatTime, getSecondsFromPercentage, getSongPercent, secondsToStyledTime} from "../util.ts";
import {ActionIcon, Affix, Avatar, Center, Slider, Stack, Text} from "@mantine/core";
import {
  IconMenu2,
  IconMusic,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconVolume,
  IconVolumeOff
} from "@tabler/icons-react";
import {useAtom} from "jotai";
import {Howl} from "howler";

export function Player() {
  const pb = useAtomValue(globalPocketbase)//intancia global de la  bd
  const [currentSongInst, setCurrentSongInst] = useAtom(globalCurrentSongInstance)
  const [currentSongDet, setCurrentSongDet] = useAtom(globalCurrentSongDetails)
  const [playlist, setPlaylist] = useAtom(globalSongsPlaylist);
  const setPlaylistDrawerOpen = useSetAtom(globalPlaylistDrawerOpened)
  const [currentSongProgress, setCurrentSongProgress] = useState("");
  const [currentSongProgressSeconds, setCurrentSongProgressSeconds] = useState(0);
  const [currentSongVolume, setCurrentSongVolume] = useState<number>(100)
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
// Update Song Percent
  useEffect(() => {
    if (!currentSongInst) return;
    const progressInterval = setInterval(() => {
      setCurrentSongProgress(getSongPercent(currentSongInst))
      setCurrentSongProgressSeconds(Number(getSecondsFromPercentage(currentSongInst.duration(), Number(getSongPercent(currentSongInst))).toFixed(2)))
    }, 100)
    currentSongInst.on("end", () => {
      console.log("song end")
      if (playlist.length > 0) {
        setCurrentSongInst(undefined)
        setCurrentSongDet(undefined);
        return
      }
      setIsPlaying(currentSongInst.playing())
    })
    play()
    return () => {
      clearInterval(progressInterval);
      if (!currentSongInst) return
      currentSongInst.unload()
    }

  }, [currentSongInst])

//Este useEffect se ejecuta cuando cambia la playlist o la cancion que se esta corriendo en ese momento
//si la playlist se acabo ejecuta la funcion advanceInPlaylist y hace que la siguiente cancion corra

  useEffect(() => {
    if (!currentSongInst) {
      console.log(playlist)
      advanceInPlayList()
    }
  }, [playlist, currentSongInst])

  function advanceInPlayList() {
    if (playlist.length === 0) return;
    const song = playlist[0]
    const url = pb.getFileUrl(song as never, song.song)
    setCurrentSongInst(new Howl({
      src: [url]
    }))
    setCurrentSongDet(song)
    setPlaylist((prev) => prev.filter((s) => s.id !== prev[0].id))
  }

// Update Volume
//Este useEffect lo que hace es cambiar el volumen cuando cambien el valor del slaider
  useEffect(() => {
    if (!currentSongInst) return;
    currentSongInst.volume(currentSongVolume / 100);
  }, [currentSongInst, currentSongVolume])

  //La funcion de play lo que hace es correr la cancion que esta detenida
  function play() {
    if (!currentSongInst) return;
    //verifica que la cancion se esta reproduciendo
    if (currentSongInst.playing()) return;
    currentSongInst.play()
    setIsPlaying(true)
  }
  //la funcion de pause lo que hace es lo contrario a la funcion de play
  function pause() {
    if (!currentSongInst) return;
    if (!currentSongInst.playing()) return;
    currentSongInst.pause()
    setIsPlaying(false)
  }
  //lo que hace es poner pausa o pley independientemente del estado de la cancion
  //si esta en paila la pone en play y si esta en play la pone en pausa
  function togglePlay() {
    if (!currentSongInst) return;
    if (currentSongInst.playing()) {
      pause()
      return;
    } else {
      play()
    }
  }
  //mutea la cancion y hace lo contrario
  function mute() {
    if (!currentSongInst) return;
    const isMuted = currentSongInst.mute()
    currentSongInst.mute(!isMuted)
    setIsMuted(!isMuted)
  }
  //cambia el avance de la cancion con el slaider inferiror 
  function seekSong(percentage: number) {
    if (!currentSongInst) return;
    currentSongInst.seek(getSecondsFromPercentage(currentSongInst.duration(), percentage))
  }


  return (
    <Affix bottom={0} style={{width: "100% "}}>
      <div style={{ backgroundColor: "#1A1B1E"}}>

      <Stack spacing={0} style={{paddingBottom: "1em"}}>
        <Center inline style={{justifyContent: "space-evenly"}}>
          <Text style={{marginLeft: "0.3em"}}>{secondsToStyledTime(currentSongProgressSeconds)}</Text>
          <Slider value={Number(currentSongProgress)} onChangeEnd={seekSong}
                  label={(v) => secondsToStyledTime(getSecondsFromPercentage(currentSongInst?.duration() || 0, v))}
                  color={"green"}
                  style={{width: "100%", marginInline: "0.3em"}}/>
          <Text style={{marginRight: "0.3em"}}>{formatTime(currentSongInst?.duration() || 0)}</Text>
        </Center>
        <Center style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginInline: "0.3em",
          paddingTop: "0.5em"
        }}>
          <Center style={{marginLeft: "0.5em"}}>

            <Avatar color={"red"} gradient={{from: '#ed6ea0', to: '#ec8c69', deg: 35}} variant={"gradient"} size={"md"}>
              <IconMusic/>
            </Avatar>
            <Stack spacing={0} ml={"0.3em"}>

              <Text weight={500} mb={"-0.1em"}>{currentSongDet?.name || "--/--"}</Text>
              <Text weight={200} size={"xs"}>{currentSongDet?.artist || "--/--"}</Text>
            </Stack>
          </Center>
          <ActionIcon onClick={togglePlay}>
            <IconPlayerSkipBack/>
          </ActionIcon>
          <ActionIcon onClick={togglePlay} variant={"filled"} radius={"xl"} size={"xl"}>
            {!isPlaying ? <IconPlayerPlayFilled/> : <IconPlayerPauseFilled/>}
          </ActionIcon>
          <ActionIcon onClick={() => {
            if (playlist.length > 0) {
              advanceInPlayList()
            }
          }}>
            <IconPlayerSkipForward/>
          </ActionIcon>
          <Center inline style={{width: "10em", marginRight: "1em"}}>
            <ActionIcon style={{marginRight: "0.5em"}} onClick={() => setPlaylistDrawerOpen((v) => !v)}>
              <IconMenu2/>
            </ActionIcon>
            <ActionIcon onClick={mute}>
              {isMuted ? <IconVolumeOff/> : <IconVolume/>}
            </ActionIcon>
            <Slider value={currentSongVolume} onChange={setCurrentSongVolume} style={{width: "100%"}}/>
          </Center>
        </Center>
      </Stack>
      </div>
    </Affix>
  )
}
