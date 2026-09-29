// What counts as a lead: OpenStreetMap tag filters per category, as Overpass QL fragments.
// Each fragment is matched as nwr<fragment>(area.a) — add a category by adding a key here.
// Tag reference: https://wiki.openstreetmap.org/wiki/Map_features
module.exports = {
  categories: {
    dyk: {
      label: 'Dykning',
      filters: ['["shop"="scuba_diving"]', '["sport"~"scuba_diving|free_diving"]', '["amenity"="dive_centre"]', '["club"="scuba_diving"]'],
    },
    segling: {
      label: 'Segling',
      filters: ['["sport"="sailing"]', '["club"="sailing"]', '["leisure"="sailing_club"]'],
    },
    kajak: {
      label: 'Kajak & kanot',
      filters: ['["sport"~"canoe|kayak"]', '["rental"~"kayak|canoe"]', '["shop"~"kayak|canoe"]'],
    },
    bat: {
      label: 'Båtuthyrning & båtturer',
      filters: ['["amenity"="boat_rental"]', '["shop"="boat"]', '["tourism"="boat_tour"]', '["amenity"="boat_sharing"]'],
    },
    surf: {
      label: 'Surf, kite & SUP',
      filters: ['["sport"~"surfing|kitesurfing|windsurfing|stand_up_paddleboarding|paddleboarding"]', '["shop"~"surf|kitesurf"]'],
    },
    fiske: {
      label: 'Fiske & fisketurer',
      filters: ['["shop"="fishing"]', '["leisure"="fishing"]["website"]', '["tourism"="fishing"]'],
    },
  },

  // Default run: the water-sports categories closest to what the portfolio already shows.
  defaults: ['dyk', 'segling', 'kajak', 'bat', 'surf'],

  // Chains and big retailers: never a lead for a hand-built site. Matched case-insensitively against the name.
  exclude: [
    'biltema', 'jula', 'decathlon', 'xxl', 'stadium', 'intersport', 'naturkompaniet', 'clas ohlson', 'team sportia',
    'jaktia', 'jakt & fiske', 'granngården', 'bauhaus', 'hööks', 'mekonomen', 'sportamore', 'outnorth', 'friluftsbolaget',
    'sjöräddnings', 'sjöfartsverket', 'kustbevakning',
  ],
};
