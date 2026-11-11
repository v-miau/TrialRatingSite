import { useEffect, useState } from 'react';

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

const thumbnailAspectRatios = [
    { css: '5 / 2', value: 5 / 2 },
    { css: '16 / 9', value: 16 / 9 },
];

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
    const [loadedImage, setLoadedImage] = useState(null);
    const difficulty = difficulties[thumbnailDifficultyOverrides[mapName] ?? category];
    const imageUrl = difficulty && mapName
        ? `http://maniacdn.net/vad1/trialsite_rebuild/List_Hardest/List_Hardest_${difficulty.id}_${difficulty.name}/${getThumbnailFilename(mapName)}`
        : null;

    useEffect(() => {
        if (!imageUrl) return undefined;

        let isCurrent = true;
        const image = new Image();
        image.onload = () => {
            if (!isCurrent) return;

            const imageRatio = image.naturalWidth / image.naturalHeight;
            const closestRatio = thumbnailAspectRatios.reduce((closest, candidate) =>
                Math.abs(Math.log(imageRatio / candidate.value)) < Math.abs(Math.log(imageRatio / closest.value))
                    ? candidate
                    : closest
            );
            setLoadedImage({ url: imageUrl, aspectRatio: closestRatio.css, failed: false });
        };
        image.onerror = () => {
            if (isCurrent) {
                setLoadedImage({ url: imageUrl, aspectRatio: null, failed: true });
            }
        };
        image.src = imageUrl;

        return () => {
            isCurrent = false;
        };
    }, [imageUrl]);

    if (!imageUrl) {
        return <p>Thumbnail unavailable for this map.</p>;
    }

    const imageIsLoaded = loadedImage?.url === imageUrl;
    return (
        imageIsLoaded
            ? loadedImage.failed
                ? <p role="status">Thumbnail failed to load.</p>
                : (
                    <div className="map-image-frame border rounded overflow-hidden" style={{ aspectRatio: loadedImage.aspectRatio }}>
                        <img
                            className="w-100 h-100 object-fit-cover"
                            src={imageUrl}
                            alt={`${mapName} map thumbnail`}
                        />
                    </div>
                )
            : <div className="map-image-loading border rounded" role="status">Loading thumbnail...</div>
    );
}

export default MapImage