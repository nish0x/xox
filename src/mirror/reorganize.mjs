// The live site ships everything flat under /assets/ with content-hashed,
// meaningless names (e.g. "B0-DFxftU9o.png"). Locally we organize those
// files into subfolders by type (js/css/fonts/images/models/audio/data) and
// give them human-readable names, which means every internal reference has
// to be rewritten to match. This is the single place that knows how — used
// by crawl.mjs (so a fresh mirror lands pre-organized and pre-named) and
// verify.mjs (so it checks the organized layout instead of the live site's
// flat, hashed one).
//
// RENAME_MAP and CATEGORY_BY_LETTER are static, hand-verified data (see
// project history for how each name was confirmed against the app's own
// source — e.g. avatar part categories come from the app's own state model,
// icon chunk names come from the app's own glob-key strings). Like
// seed-files.mjs, this is tied to the live site's *current* build; if the
// site ever redeploys with different hashes, both files need updating.
const CATEGORY_BY_EXT = {
  '.js': 'js',
  '.css': 'css',
  '.woff2': 'fonts',
  '.png': 'images',
  '.jpg': 'images',
  '.jpeg': 'images',
  '.glb': 'models',
  '.mp3': 'audio',
  '.json': 'data',
  // .wasm goes in js/, not its own category: it's loaded relative to its
  // sibling basis_transcoder.js (same-directory Emscripten resolution),
  // so it has to stay next to it.
  '.wasm': 'js',
}

// avatar configurator option thumbnails — letter prefix -> category,
// confirmed directly from the app's state model (id:"beard" has options
// with id "B0", id:"eye" has "E0", id:"detail" has "D0", etc.)
const CATEGORY_BY_LETTER = {
  B: 'beard', D: 'detail', E: 'eye', F: 'face',
  H: 'hair', J: 'jewelry', N: 'nose', T: 'hat',
}

const RENAME_MAP = {
  // --- js chunks: names taken from the app's own icon glob-keys, e.g.
  // "../../assets/icons/versus/adrienl.svg" -> icon-versus-adrienl.js ---
  'index-DjTFcfxW': 'main',
  'basis.worker': 'basis.worker',
  'basis_transcoder': 'basis_transcoder', // covers both .js and its sibling .wasm
  'arrow-left-C7jeBWlv': 'icon-arrow-left',
  'arrow-right-DUyuFG79': 'icon-arrow-right',
  'check-B-2exQel': 'icon-check',
  'comma-Cth_LlsD': 'icon-comma',
  'cross-B0spWP7d': 'icon-cross',
  'download-DM8QDz7e': 'icon-download',
  'lightning-Cba1wdxJ': 'icon-lightning',
  'base-MwNZ0Omb': 'icon-logo-base',
  'randomize-bhz1IDAl': 'icon-randomize',
  'share-CKE7T_sZ': 'icon-share',
  'versus-background-Cmn-ySuf': 'icon-versus-background',
  'versus-foreground-DCIy8lIF': 'icon-versus-foreground',
  'adrienl-M9Nfaivy': 'icon-versus-adrienl',
  'adrienl_b-D75yyPDL': 'icon-versus-adrienl_b',
  'anthonym-DkdUpenk': 'icon-versus-anthonym',
  'anthonym_b-csK5V3xA': 'icon-versus-anthonym_b',
  'antoineu-DpqUN3B7': 'icon-versus-antoineu',
  'antoineu_b-YILGpawK': 'icon-versus-antoineu_b',
  'aurelienc-2Z5MwrGE': 'icon-versus-aurelienc',
  'aurelienc_b-BSoHgv5F': 'icon-versus-aurelienc_b',
  'camillec-NAk8zoZR': 'icon-versus-camillec',
  'camillec_b-tjCfpL8j': 'icon-versus-camillec_b',
  'cassandreb-DaRCBv_Q': 'icon-versus-cassandreb',
  'cassandreb_b-jxCUsxKP': 'icon-versus-cassandreb_b',
  'connorh-DwBefyz7': 'icon-versus-connorh',
  'connorh_b-CakU7z_L': 'icon-versus-connorh_b',
  'draw-B6oDcTHG': 'icon-versus-draw',
  'draw_b-CYctGT3o': 'icon-versus-draw_b',
  'florentinm-C_BSn9GL': 'icon-versus-florentinm',
  'florentinm_b-CBYTmLjv': 'icon-versus-florentinm_b',
  'francoisc-PKvg02gz': 'icon-versus-francoisc',
  'francoisc_b-dULGfrLH': 'icon-versus-francoisc_b',
  'francoises-BnNVW4AX': 'icon-versus-francoises',
  'francoises_b-Bohkk3Kh': 'icon-versus-francoises_b',
  'gauthierp-B0nbLVmN': 'icon-versus-gauthierp',
  'gauthierp_b-C5ooJMiy': 'icon-versus-gauthierp_b',
  'gregoryb-DpwY59Bj': 'icon-versus-gregoryb',
  'gregoryb_b-C3ZZ0m1E': 'icon-versus-gregoryb_b',
  'helenet-B8JC8OOM': 'icon-versus-helenet',
  'helenet_b-BUGyi5_O': 'icon-versus-helenet_b',
  'jeremiec-BYVhpi-I': 'icon-versus-jeremiec',
  'jeremiec_b-Dl47sCOb': 'icon-versus-jeremiec_b',
  'jeromel-ACN0GV9q': 'icon-versus-jeromel',
  'jeromel_b-Cin4icyR': 'icon-versus-jeromel_b',
  'julienv-5NFmIxAk': 'icon-versus-julienv',
  'julienv_b-DbFvYkUK': 'icon-versus-julienv_b',
  'lose-B1rPbQCJ': 'icon-versus-lose',
  'lose_b-DB0jMgeE': 'icon-versus-lose_b',
  'manonb-CTjLh5i_': 'icon-versus-manonb',
  'manonb_b-B-e17era': 'icon-versus-manonb_b',
  'marieelisea-TjUlBvgo': 'icon-versus-marieelisea',
  'marieelisea_b-CIJXQgIs': 'icon-versus-marieelisea_b',
  'mathiasr-CpmOZixN': 'icon-versus-mathiasr',
  'mathiasr_b-BzZE5asb': 'icon-versus-mathiasr_b',
  'nicolasr-CfdKaiJD': 'icon-versus-nicolasr',
  'nicolasr_b-B23fyufA': 'icon-versus-nicolasr_b',
  'nilsl-BHsc6MkV': 'icon-versus-nilsl',
  'nilsl_b-DSNHN-cZ': 'icon-versus-nilsl_b',
  'pierrel-C9CGbf0e': 'icon-versus-pierrel',
  'pierrel_b-BDW1q5uM': 'icon-versus-pierrel_b',
  'remib-BYQxSiV7': 'icon-versus-remib',
  'remib_b-CxIr4vDi': 'icon-versus-remib_b',
  'romainp-DHS4nBMM': 'icon-versus-romainp',
  'romainp_b-CfhtcN-Y': 'icon-versus-romainp_b',
  'sachag-Cu3Mb6vD': 'icon-versus-sachag',
  'sachag_b-DqsECZ9_': 'icon-versus-sachag_b',
  'sarahc-DGFDukEP': 'icon-versus-sarahc',
  'sarahc_b-C3vAeN_v': 'icon-versus-sarahc_b',
  'solener-Fm8_av5U': 'icon-versus-solener',
  'solener_b-DLvI-e11': 'icon-versus-solener_b',
  'thomasr-DbDMVX05': 'icon-versus-thomasr',
  'thomasr_b-B2COMgkm': 'icon-versus-thomasr_b',
  'valentinm-CXznlK7N': 'icon-versus-valentinm',
  'valentinm_b-DKJsyOTa': 'icon-versus-valentinm_b',
  'vincents-BSRHBr1H': 'icon-versus-vincents',
  'vincents_b-DFMr11p-': 'icon-versus-vincents_b',
  'win-DMFjlf5t': 'icon-versus-win',
  'win_b-BlmIENL7': 'icon-versus-win_b',
  'you-cocwCuf6': 'icon-versus-you',
  'you_b-0K3diT4K': 'icon-versus-you_b',

  // --- css ---
  'index-BSwuqJ-_': 'main',

  // --- fonts ---
  'aaksimosi-DjvOQu72': 'aaksimosi',
  'bangers-DeHY8Ncq': 'bangers',
  'poppins-regular-cpxAROuN': 'poppins-regular',

  // --- data: font atlas manifests + audio sprite map ---
  'aaksimosi-C3BzEqTF': 'aaksimosi-font-atlas',
  'bangers-DpM2yeyv': 'bangers-font-atlas',
  'game_audio-sd2rnhTe': 'game-audio-sprite',

  // --- audio ---
  'game_audio-Ve9oyfJI': 'game-audio',

  // --- models ---
  'avatar-bUMLPl_Q': 'avatar',
  'grid-WSOFoBNr': 'grid',
  'lightning-CCwfz3l8': 'lightning',
  'processed-BEDFlmDO': 'processed',
  'shapes-80-xMobG': 'shapes',

  // --- images: font atlas textures ---
  'aaksimosi-DwTuhxOd': 'aaksimosi-font-atlas',
  'bangers-D4QO0oTV': 'bangers-font-atlas',

  // --- images: named UI/scene art ---
  'rotate-avatar-UsFQ9y-m': 'rotate-avatar',
  'rotate-bg-DII71BQX': 'rotate-bg',
  'default-DVuH2Ed6': 'default',
  'hover-8pwqRDRl': 'hover',
  'o-dAMcZUkb': 'o',
  'x-DZBg_-zW': 'x',
  'background-desktop-CClWkPTW': 'background-desktop',
  'background-mobile-SPRgPPTg': 'background-mobile',
  'cookie-background-desktop-BJckyl82': 'cookie-background-desktop',
  'cookie-background-mobile-C9hXSMsW': 'cookie-background-mobile',
  'cookie-desktop-w3RA3aXh': 'cookie-desktop',
  'cookie-mobile-DzoMXazb': 'cookie-mobile',
  'dragndrop-DNT5_CGs': 'dragndrop',
  'heart-Bk4K9W7K': 'heart',
  'lightning-4grXkpr2': 'lightning',
  'sleep-B4d8uCDt': 'sleep',
  'stroke_transition-2hqvpxUU': 'stroke-transition',
  'stroke_transition_2-kiMmbJDV': 'stroke-transition-2',
  'tears-CC8MtNpa': 'tears',

  // --- images: sprite animation frames (numbered, order matters) ---
  'play_0-BKmhkj_6': 'play-0', 'play_1-CjeZflYa': 'play-1',
  'play_2-i9ORMu1-': 'play-2', 'play_3-YLxiEd5K': 'play-3',
  'play_white_0-CIHxJsQd': 'play-white-0', 'play_white_1-BYibLCHM': 'play-white-1',
  'play_white_2-D30gyIqI': 'play-white-2', 'play_white_3-CrSMrOQ3': 'play-white-3',
  'pulse_0-D-X61g-D': 'pulse-0', 'pulse_1-DOjGQbBv': 'pulse-1',
  'pulse_2-SRnGdOjW': 'pulse-2', 'pulse_3-C3nWXhjn': 'pulse-3', 'pulse_4-B2t4GiMd': 'pulse-4',
  'pulse_white_0-CLnIUUx8': 'pulse-white-0', 'pulse_white_1-DdRVB5Jk': 'pulse-white-1',
  'pulse_white_2-sCFYPMwc': 'pulse-white-2', 'pulse_white_3-C3DyS3Xg': 'pulse-white-3',
  'pulse_white_4-BLojzLc2': 'pulse-white-4',

  // --- images: avatar configurator option thumbnails ---
  'B0-DFxftU9o': 'beard-B0', 'B1-B0s62fYe': 'beard-B1', 'B2-B3bjq5Uy': 'beard-B2',
  'B3-BffhHJU1': 'beard-B3', 'B4-Uwj5QJx2': 'beard-B4', 'B5-Cg2_Ryz4': 'beard-B5',
  'B6-8tKqBHcQ': 'beard-B6', 'B7-BJ_iWpI9': 'beard-B7', 'B8-BTBuFrH8': 'beard-B8',
  'B9-wtABdzSn': 'beard-B9',
  'D1-C3tMxePw': 'detail-D1', 'D2-DUTH7npU': 'detail-D2', 'D3-DfzmNrZf': 'detail-D3',
  'D4-dILi-X3_': 'detail-D4', 'D5-Onipvdzz': 'detail-D5',
  'E0-BDD50b65': 'eye-E0', 'E1-Bxy3Zih9': 'eye-E1', 'E2-BypMnUCB': 'eye-E2',
  'E3-CeoaZStJ': 'eye-E3', 'E4-CfZNbH83': 'eye-E4', 'E5-DMEmHWip': 'eye-E5',
  'E6-Cvt8gZXU': 'eye-E6', 'E7-B1J0lljO': 'eye-E7', 'E8-Dw3slp2O': 'eye-E8',
  'E9-DHDRVx3y': 'eye-E9',
  'F1-H2-hAhrd': 'face-F1', 'F2-ConkQhto': 'face-F2', 'F3-DzWnFVPy': 'face-F3',
  'F4-CGPOqJJN': 'face-F4', 'F5-DiC1xa47': 'face-F5',
  'H1-DTTJy9Sz': 'hair-H1', 'H10-DzgcqZUW': 'hair-H10', 'H11-fF7kgHfq': 'hair-H11',
  'H12-BHXUvxKY': 'hair-H12', 'H13-D5OzBsSp': 'hair-H13', 'H14-BNH4C3Gi': 'hair-H14',
  'H2-BJCxmuvn': 'hair-H2', 'H3-WMx58srB': 'hair-H3', 'H4-DST_ItvZ': 'hair-H4',
  'H5-CQ_-nlHO': 'hair-H5', 'H6-BbcpU2Eo': 'hair-H6', 'H7-DrhBk9TK': 'hair-H7',
  'H8-Bk2401L6': 'hair-H8', 'H9-9Wj_cCvo': 'hair-H9',
  'J1-C27iZhfW': 'jewelry-J1', 'J2-CndpjxIo': 'jewelry-J2', 'J3-C_eVWHHu': 'jewelry-J3',
  'J4-BiwHo6-p': 'jewelry-J4', 'J5-DbDZFY4h': 'jewelry-J5', 'J6-BS4yZuvO': 'jewelry-J6',
  'N2-CmGFzWDv': 'nose-N2', 'N3-BzbnoIHy': 'nose-N3', 'N4-BVGiBiZI': 'nose-N4',
  'T1-ROYWNVIs': 'hat-T1', 'T2-DwHpoWqi': 'hat-T2', 'T3-CD1mUsaP': 'hat-T3',
  'T4-D6frEu1V': 'hat-T4',
}

function categoryOf(filename) {
  const ext = '.' + filename.split('.').pop()
  return CATEGORY_BY_EXT[ext]
}

function stemAndExt(filename) {
  const m = filename.match(/^(.*)(\.[^.]+)$/)
  return m ? [m[1], m[2]] : [filename, '']
}

function renamedFilename(filename) {
  const [stem, ext] = stemAndExt(filename)
  const newStem = RENAME_MAP[stem]
  return newStem ? `${newStem}${ext}` : filename
}

// Maps a live, flat relative path (e.g. "assets/B0-DFxftU9o.png") to where
// it lives locally (e.g. "assets/images/beard-B0.png"). Root files
// (index.html, logo.svg, ...) and favicon/* pass through unchanged.
export function localPathFor(relPath) {
  const parts = relPath.split('/')
  if (parts[0] !== 'assets' || parts.length !== 2) return relPath
  const filename = parts[1]
  const cat = categoryOf(filename)
  return cat ? `assets/${cat}/${renamedFilename(filename)}` : relPath
}

// Rewrites the internal references inside one fetched text file so they
// point at the reorganized, renamed local layout instead of the live
// site's flat, hashed one. `relPath` is the file's live, flat path (e.g.
// "assets/index-x.js"), `text` is its raw fetched content.
export function reorganizeReferences(relPath, text) {
  if (relPath === 'index.html') {
    let out = text
    for (const m of text.matchAll(/assets\/([A-Za-z0-9_.-]+)/g)) {
      const filename = m[1]
      const cat = categoryOf(filename)
      if (cat === 'js' || cat === 'css' || cat === 'fonts') {
        out = out.split(`assets/${filename}`).join(`assets/${cat}/${renamedFilename(filename)}`)
      }
    }
    return out
  }

  const filename = relPath.split('/').pop()

  if (categoryOf(filename) === 'js') {
    // new URL("name.ext", import.meta.url) -> the target's own name may
    // change, and if it's a non-js target it also needs a ../<cat>/ hop
    // since this file lives in assets/js/ but the target lives elsewhere.
    let out = text.replace(/new URL\("([^"]+)",\s*import\.meta\.url\)/g, (match, name) => {
      const cat = categoryOf(name)
      if (!cat) return match
      const newName = renamedFilename(name)
      return cat !== 'js'
        ? `new URL("../${cat}/${newName}", import.meta.url)`
        : `new URL("${newName}", import.meta.url)`
    })
    // sibling chunk-to-chunk dynamic imports, e.g. import("./adrienl-x.js")
    out = out.replace(/import\("\.\/([^"]+)\.js"\)/g, (match, name) => {
      const newStem = RENAME_MAP[name]
      return newStem ? `import("./${newStem}.js")` : match
    })
    // sibling chunk-to-chunk static imports, e.g.
    // import ... from "./index-DjTFcfxW.js" -> the entry chunk was renamed
    // to main.js, and every lazy icon chunk statically imports from it, so
    // this rewrite is what keeps the code-split chunks loadable locally.
    out = out.replace(/from\s+"\.\/([A-Za-z0-9_-]+)\.js"/g, (match, name) => {
      const newStem = RENAME_MAP[name]
      return newStem ? `from "./${newStem}.js"` : match
    })
    // one file loads a Worker via a page-relative (not import.meta.url
    // relative) literal path, so it needs the same treatment by hand.
    out = out.replace(/"\.\/assets\/basis\.worker\.js"/g, '"./assets/js/basis.worker.js"')
    return out
  }

  if (categoryOf(filename) === 'css') {
    // @font-face url(./name.woff2) -> css moves to assets/css/, fonts to
    // assets/fonts/, so it's one level up and back down, and the font's
    // own name may also change.
    return text.replace(
      /url\(\.\/([^)]+)\)/g,
      (match, name) => `url(../fonts/${renamedFilename(name)})`
    )
  }

  return text
}
