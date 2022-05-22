import { Action, ActionPanel, Image, List, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { PlayAction } from "./actions";
import { usePlaylistSearch } from "./client/client";

export default function SpotifyList() {
  const [searchText, setSearchText] = useState<string>();
  const response = usePlaylistSearch(searchText);

  if (response.error) {
    showToast(Toast.Style.Failure, "Search has failed", response.error);
  }

  return (
    <List
      searchBarPlaceholder="Search playlists..."
      onSearchTextChange={setSearchText}
      isLoading={response.isLoading}
      throttle
    >
      {response.result?.playlists.items.map((p) => (
        <PlaylistItem key={p.id} playlist={p} />
      ))}
    </List>
  );
}

function PlaylistItem(props: { playlist: SpotifyApi.PlaylistObjectSimplified }) {
  const playlist = props.playlist;
  const icon: Image.ImageLike = {
    source: playlist.images[playlist.images.length - 1].url,
    mask: Image.Mask.Circle,
  };

  const title = playlist.name;
  const subtitle = playlist.owner.display_name;
  return (
    <List.Item
      title={title}
      subtitle={subtitle}
      accessories={[{ text: `${playlist.tracks.total.toString()} songs`, tooltip: "number of tracks" }]}
      icon={icon}
      actions={
        <ActionPanel title={title}>
          <PlayAction itemURI={playlist.uri} />
          <Action.OpenInBrowser
            title={`Show Playlist (${playlist.name.trim()})`}
            url={playlist.external_urls.spotify}
            icon={icon}
            shortcut={{ modifiers: ["cmd"], key: "a" }}
          />
          <Action.OpenInBrowser title="Show Artist" url={playlist.owner.external_urls.spotify} />
          <Action.CopyToClipboard
            title="Copy URL"
            content={playlist.external_urls.spotify}
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        </ActionPanel>
      }
    />
  );
}
