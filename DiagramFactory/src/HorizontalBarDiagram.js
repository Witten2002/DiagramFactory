/**
 * A module representing a horizontal bar diagram.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

import { GraphDiagram } from './GraphDiagram.js'

/**
 * A class representing a bar diagram.
 */
class HorizontalBarDiagram extends GraphDiagram {
  #dataObject
  /**
   * Creates an instance of BarDiagram.
   *
   * @param {object} config - The data that will be used to render the diagram.
   */
  constructor (config) {
    super(config)
    this.#dataObject = super.getDataObject()
  }

  /**
   * Renders the diagram.
   *
   * @override
   */
  render () {
    const svg = super.getSvg()
    const barWidth = this.#dataObject.config.barWidth
    const barSpacing = this.#dataObject.config.barSpacing
    const svgHeight = super.getSvgHeight()
    const maxDataValue = super.getMaxValue()

    const xCoodinates = []

    const visualData = super.getVisualData()
    for (let i = 0; i < visualData.length; i++) {
      const barHeigth = (visualData[i].value / maxDataValue) * (svgHeight - 50)
      const xCoordinate = i * (barWidth + barSpacing) + 50
      xCoodinates.push(xCoordinate)
      const yCoordinate = svgHeight - barHeigth - 30

      // Add bars to the diagram
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', xCoordinate)
      rect.setAttribute('y', yCoordinate)
      rect.setAttribute('width', barWidth)
      rect.setAttribute('height', barHeigth)
      rect.setAttribute('fill', visualData[i].color)

      /* ---------------------- INTERACTIVITY ---------------------- */
      const interactivityAndAnimationSettings = {
        element: rect,
        finalHeight: barHeigth,
        finalY: yCoordinate,
        visualData: visualData[i],
        type: 'horizontal'
      }
      super.applyInteractivityAndAnimation(interactivityAndAnimationSettings)
      /* ----------------------------------------------------------- */

      svg.appendChild(rect)

      // Add text to the bars
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', xCoordinate + barWidth / 2)
      text.setAttribute('y', svgHeight - 10)
      text.setAttribute('fill', 'black')
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('font-size', this.#dataObject.config.fonts.xAxel)
      text.textContent = visualData[i].label

      svg.appendChild(text)
    }
  }
}

export { HorizontalBarDiagram }
