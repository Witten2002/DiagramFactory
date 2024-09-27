/**
 * Line Diagram class
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

import { GraphDiagram } from './GraphDiagram'

/**
 * A class representing a line diagram.
 */
class LineDiagram extends GraphDiagram {
  #dataObject
  #visualData

  /**
   * Creates an instance of LineDiagram.
   *
   * @param {object} config - The data that will be used to render the diagram.
   */
  constructor (config) {
    super(config)
    this.#dataObject = super.getDataObject()
    this.#visualData = super.getVisualData()
  }

  /**
   * Renders the diagram.
   */
  render () {
    let yCoordinate
    let xCoordinate
    const svg = super.getSvg()
    const svgHeight = super.getSvgHeight()
    const svgWidth = super.getSvgWidth()
    const maxDataValue = super.getMaxValue()

    const visualData = super.getVisualData()
    const points = []

    for (let i = 0; i < visualData.length; i++) {
      xCoordinate = (i / visualData.length) * (svgWidth - 100) + 75
      yCoordinate = svgHeight - (visualData[i].value / maxDataValue) * (svgHeight - 50) - 30
      points.push(`${xCoordinate},${yCoordinate}`)
    }

    // creates the line
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    polyline.setAttribute('points', points)
    polyline.setAttribute('fill', 'none')
    polyline.setAttribute('stroke', this.#dataObject.visualData[0].color)
    polyline.setAttribute('stroke-width', '2')

    svg.appendChild(polyline)

    // creates a small circle on every value
    for (let i = 0; i < points.length; i++) {
      const coords = points[i].split(',')
      const xCoord = coords[0]
      const yCoord = coords[1]

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', xCoord)
      text.setAttribute('y', svgHeight - 10)
      text.setAttribute('fill', 'black')
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('font-size', this.#dataObject.config.fonts.xAxel)
      text.textContent = this.#visualData[i].label

      svg.appendChild(text)

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', xCoord)
      circle.setAttribute('cy', yCoord)
      circle.setAttribute('r', 4)
      circle.setAttribute('fill', this.#dataObject.visualData[0].color)

      svg.appendChild(circle)

      /* ---------------------- INTERACTIVITY ---------------------- */
      const interactivityAndAnimationSettings = {
        element: circle,
        finalY: yCoordinate,
        visualData: visualData[i],
        type: 'Line'
      }
      super.applyInteractivityAndAnimation(interactivityAndAnimationSettings)
      /* ----------------------------------------------------------- */
    }
  }
}

export { LineDiagram }
