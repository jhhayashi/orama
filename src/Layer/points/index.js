// Copyright 2017 Kensho Technologies, Inc.

import {getMidX, getMidY} from '../../utils/rectUtils'
import {getPath2D} from '../../utils/path2DUtils'
import {getPlotValues} from '../../Layer/getPlotValues'
import {map, flatten, isArray} from 'lodash'

/*
`points` is used to generate render data for dots and similar.
it handles `x`, `y`, 'radius' and 'fill'.

@calling logic
points{
  getPointRenderData(retrievePointsData){}
}
*/

/*
generates the array of render data
*/
const getPointRenderData = (props, datum, idx) => {
  const values = getPlotValues(props, datum, idx, {
    hoverAlpha: 0.75,
    radius: 4,
    x: getMidX(props.plotRect),
    y: getMidY(props.plotRect),
  })
  const path2D = getPath2D()
  const hover2ndPath2D = getPath2D()
  path2D.arc(values.x, values.y, values.radius, 0, 2 * Math.PI)
  hover2ndPath2D.arc(values.x, values.y, values.radius + 8, 0, 2 * Math.PI)

  return {
    ...values,
    hover2ndPath2D,
    path2D,
    type: 'area',
  }
}

/*
Main entry point, if there's only `xMap` or `yMap` it will output an one dimension plot.
*/
export const points = props => {
  if (!props.xScale && !props.yScale) return undefined
  return flatten(map(
    props.data,
    (datum, idx) => {
      if (isArray(datum)) {
        return map(datum, (d, i) => getPointRenderData(props, d, i))
      }
      return getPointRenderData(props, datum, idx)
    },
  ))
}
