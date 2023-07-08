import {Player} from "./components/Player.tsx";
import {SongsList} from "./components/SongsList.tsx";
import {PlaylistDrawer} from "./components/PlaylistDrawer.tsx";
import {RightAffix} from "./components/RightAffix.tsx";
import LeftAffix from "./components/LeftAffix.tsx";

function App() {

  return (
    <div style={{ overflow: "hidden"}}>
      <SongsList/>
      <PlaylistDrawer/>
      <Player/>
      <RightAffix/>
      <LeftAffix/>

    </div>
  )
}

export default App
