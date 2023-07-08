import {atom} from "jotai"
import Pocketbase from "pocketbase"
import {serverURL} from "./constants.ts";
import {Howl} from "howler";
import Song from "./types/song.ts"

export const globalPocketbase = atom(new Pocketbase(serverURL))
export const globalCurrentSongInstance = atom<Howl | undefined>(undefined)
export const globalCurrentSongDetails = atom<Song | undefined>(undefined);
export const globalPlaylistDrawerOpened = atom<boolean>(false)
export const globalSongsPlaylist = atom<Song[]>([])

export const globalChangeModel = atom(false)