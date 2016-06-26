export default function serializeCSS (id, styles, stylesTo, timeout) {
  const transition = `${convertMStoS(timeout)}s ease-in-out`
  return`
    #vc-${id} {
      ${Object.keys(styles).map(k => `${camelCaseToDashCase(k)}: ${styles[k]};`).join('\t\n') }
      visibility: hidden;
    }
    #vc-${id}.is-animating {
      transition: ${Object.keys(styles).map(k => `${camelCaseToDashCase(k)} ${transition}`).join(',\t\n')};
      ${Object.keys(stylesTo).map(k => `${camelCaseToDashCase(k)}: ${stylesTo[k]};`).join('\t\n') }
      visibility: visible;
    }
  `
}

export function camelCaseToDashCase (key) {
  return `${key.substring(0, 1)}${key.substring(1).replace(/([a-z])?([A-Z])/g, '$1-$2')}`
    .toLowerCase()
}

export function convertMStoS (ms) {
  return ms / 1000
}
