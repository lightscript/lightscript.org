import colorPairsPicker from 'color-pairs-picker'
import chroma from 'chroma-js'

import { config } from 'config'

export colors := colorPairsPicker(config.baseColor, {
  contrast: 5.5,
})

darker := chroma(config.baseColor).darken(10).hex()
export activeColors := colorPairsPicker(darker, {
  contrast: 7,
})
