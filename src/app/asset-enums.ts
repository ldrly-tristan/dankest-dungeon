enum PhaserLoaderType {
  Html = 'html',
  Json = 'json'
}

export enum AssetKey {
  Manifest = 'manifest',
  Creatures = 'creatures',
  Items = 'items',
  Terrain = 'terrain',
  CreatePlayerNameInput = 'create-player-name-input'
}

export enum AssetType {
  Manifest = PhaserLoaderType.Json,
  Creatures = PhaserLoaderType.Json,
  Items = PhaserLoaderType.Json,
  Terrain = PhaserLoaderType.Json,
  CreatePlayerNameInput = PhaserLoaderType.Html
}

export enum AssetUrl {
  Manifest = 'assets/manifest.json',
  Creatures = 'assets/json/creatures.json',
  Items = 'assets/json/items.json',
  Terrain = 'assets/json/terrain.json',
  CreatePlayerNameInput = 'assets/html/create-player/name-input.html'
}
