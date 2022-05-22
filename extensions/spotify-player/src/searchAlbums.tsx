import { Action, ActionPanel, Image, List, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { PlayAction } from "./actions";
import { useAlbumSearch } from "./client/client";

export default function SpotifyList() {
  const [searchText, setSearchText] = useState<string>();
  const response = useAlbumSearch(searchText);

  if (response.error) {
    showToast(Toast.Style.Failure, "Search has failed", response.error);
  }

  return (
    <List
      searchBarPlaceholder="Search albums..."
      onSearchTextChange={setSearchText}
      isLoading={response.isLoading}
      throttle
    >
      {response.result?.albums.items.map((a) => (
        <AlbumItem key={a.id} album={a} />
      ))}
    </List>
  );
}

function AlbumItem(props: { album: SpotifyApi.AlbumObjectSimplified }) {
  const album = props.album;
  const icon: Image.ImageLike = {
    source: album.images[album.images.length - 1].url,
    mask: Image.Mask.Circle,
  };

  const title = album.name;
  const subtitle = `${album.artists.map((a) => a.name).join(", ")}`;
  return (
    <List.Item
      title={title}
      subtitle={subtitle}
      accessories={[
        { text: album.release_date.substring(0, 4), tooltip: "release year" },
        { text: `${album.total_tracks.toString()} songs`, tooltip: "number of tracks" },
      ]}
      icon={icon}
      actions={
        <ActionPanel title={title}>
          <PlayAction itemURI={album.uri} />
          <Action.OpenInBrowser
            title={`Show Album (${album.name.trim()})`}
            url={album.external_urls.spotify}
            icon={icon}
            shortcut={{ modifiers: ["cmd"], key: "a" }}
          />
          <Action.OpenInBrowser title="Show Artist" url={album.artists[0].external_urls.spotify} />
          <Action.CopyToClipboard
            title="Copy URL"
            content={album.external_urls.spotify}
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        </ActionPanel>
      }
    />
  );
}
