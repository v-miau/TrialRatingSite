const difficulties = {
    Challenging: { id: '01', name: 'Challenging' },
    Expert: { id: '02', name: 'Expert' },
    Hardcore: { id: '03', name: 'Hardcore' },
    Extreme: { id: '04', name: 'Extreme' },
    Inhumane: { id: '05', name: 'Inhumane' },
    Nameless: { id: '05', name: 'Inhumane' },
};

const thumbnailFilenameOverrides = { //Exceptions bc Vadi messed up his filenames sigh
    'Crouching Tiger in the Poet\'s Den': 'crouching_tiger_tmtrial_1.jpg',
    'Abstracture 2 [remast.]': 'abstracture2_tmtrial_1.jpg',
    'S O T H E R A': 'sothera_tmtrial_1.jpg',
    'Super Monkey Ball': 'supermonkeyball_tmtrial_1.jpg',
    'trial_map2.gbx': 'trialmapgbx2_tmtrial_1.jpg',
    'Complexity of Road Works': 'complexity_of_roadworks_tmtrial_1.jpg',
    'The Duat': 'the_duat_tmtrial_1_.jpg',
    'I.O.N.': 'ion_tmtrial_1.jpg',
    'Psychosomatic Exhaustion 2': 'pe2_tmtrial_1.jpg',
    'Rainbow Tylenol 2': 'rt2_tmtrial_1.jpg',
    'Rainbow Tylenol': 'rt1_tmtrial_1.jpg',
    'Rainbow Tylenol 3': 'rt3_tmtrial_1.jpg',
    'Intergalactic II: Dream of my life': 'intergalactic2_tmtrial_1.jpg',
    'Psychosomatic Exhaustion': 'pe1_tmtrial_1.jpg',
    'Another Pipe Challenge for Gamers': 'anotherpipechallenge_tmtrial_1.jpg',
    'Cretaceous Period': 'creta_tmtrial_1.jpg',
    'o f f w o r l d': 'offworld_tmtrial_1.jpg',
    '/½/¾/': '1234_tmtrial_1.jpg',
    'trial_map.Gbx': 'trialmapgbx_tmtrial_1.jpg',
    'Under Construction': 'underconstruction_tmtrial_1.jpg',
    'Tree House': 'treehouse_tmtrial_1.jpg',
    'T.A.L.O.S': 'talos_tmtrial_1.jpg',
    'Black Cyalume': 'bc1_tmtrial_1.jpg',
    'Black Cyalume II: Afterglow': 'bc2_tmtrial_1.jpg',
    'Black Cyalume III: Neon Chrome': 'bc3_tmtrial_1.jpg',
    'Delta-V': 'deltav_tmtrial_1.jpg',
    'i.': 'i._tmtrial_1.jpg',
};

const thumbnailDifficultyOverrides = {
    'Feria Sevilla': 'Challenging',
};

function toImageFilename(mapName) {
    return mapName
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .toLocaleLowerCase()
        .replace(/['’]/gu, '')
        .replace(/[^\p{L}\p{N}]+/gu, '_')
        .replace(/^_+|_+$/gu, '');
}

function getThumbnailFilename(mapName) {
    return thumbnailFilenameOverrides[mapName] ?? `${toImageFilename(mapName)}_tmtrial_1.jpg`;
}

function MapImage({ mapName, category }) {
    const difficulty = difficulties[thumbnailDifficultyOverrides[mapName] ?? category];
    if (!difficulty || !mapName) {
        return <p>Thumbnail unavailable for this map.</p>;
    }

    const imageUrl = `http://maniacdn.net/vad1/trialsite_rebuild/List_Hardest/List_Hardest_${difficulty.id}_${difficulty.name}/${getThumbnailFilename(mapName)}`;

    return <img className="img-fluid" src={imageUrl} alt={`${mapName} map thumbnail`} />;
}

export default MapImage