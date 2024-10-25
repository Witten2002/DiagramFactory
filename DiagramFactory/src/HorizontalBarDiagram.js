/**
 * A module representing a horizontal bar diagram.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

import { GraphDiagram } from './GraphDiagram.js'
import { diagramTypes } from './config/DiagramTypes.js'

/**
 * A class representing a bar diagram.
 */
class HorizontalBarDiagram extends GraphDiagram {
  #dataObject
  #svg
  #barWidth
  #barSpacing
  #svgHeight
  #maxDataValue
  #xCoodinates
  #visualData
  /**
   * Creates an instance of BarDiagram.
   *
   * @param {object} config - The data that will be used to render the diagram.
   */
  constructor (config) {
    super(config)
    this.#xCoodinates = []
    this.#setDataObject()
    this.#setSvg()
    this.#setBarWidth()
    this.#setBarSpacing()
    this.#setSvgHeight()
    this.#setMaxDataValue()
    this.#setVisualData()
  }

  /**
   * Sets the data object.
   */
  #setDataObject () {
    this.#dataObject = super.getDataObject()
  }

  /**
   * Sets the SVG.
   */
  #setSvg () {
    this.#svg = super.getSvg()
  }

  /**
   * Sets the width of the bars.
   */
  #setBarWidth () {
    this.#barWidth = this.#dataObject.config.barWidth
  }

  /**
   * Sets the spacing between the bars.
   */
  #setBarSpacing () {
    this.#barSpacing = this.#dataObject.config.barSpacing
  }

  /**
   * Sets the height of the SVG element.
   */
  #setSvgHeight () {
    this.#svgHeight = super.getSvgHeight()
  }

  /**
   * Sets the maximum data value.
   */
  #setMaxDataValue () {
    this.#maxDataValue = super.getMaxValue()
  }

  /**
   * Sets the visual data.
   */
  #setVisualData () {
    this.#visualData = super.getVisualData()
  }

  /**
   * Renders the diagram.
   *
   * @override
   */
  render () {
    for (let i = 0; i < this.#visualData.length; i++) {
      const barHeigth = this.#calcBarHeight(this.#visualData[i].value)
      const xCoordinate = this.#calcXCoord(i)

      const yCoordinate = this.#calcYCoord(barHeigth)

      const config = {
        xCoordinate,
        yCoordinate,
        barWidth: this.#barWidth,
        barHeigth,
        svgHeight: this.#svgHeight,
        visualData: this.#visualData[i]
      }

      const rect = this.#createBar(config)

      this.#createInteractivity(rect, config)

      this.#svg.appendChild(rect)

      const text = this.#createLabel(config)

      this.#svg.appendChild(text)
    }
  }

  /**
   * Calculates the height of a bar in a horizontal bar diagram based on the data value and maximum data value.
   *
   * @param {number} value - The data value of the bar.
   * @returns {number} - The calculated height of the bar.
   */
  #calcBarHeight (value) {
    const MARGIN_TOP = 50

    const barHeight = (value / this.#maxDataValue) * (this.#svgHeight - MARGIN_TOP)

    return barHeight
  }

  /**
   * Calculates the x-coordinate for a bar in a horizontal bar diagram based on its index.
   *
   * @param {number} index - The index of the bar in the data array.
   * @returns {number} - The calculated x-coordinate of the bar.
   */
  #calcXCoord (index) {
    const MARGIN_LEFT = 50

    const xCoordinate = index * (this.#barWidth + this.#barSpacing) + MARGIN_LEFT

    this.#xCoodinates.push(xCoordinate)

    return xCoordinate
  }

  /**
   * Calculates the y-coordinate for a bar in a horizontal bar diagram based on its height.
   *
   * @param {number} barHeight - The height of the bar.
   * @returns {number} - The calculated y-coordinate of the bar.
   */
  #calcYCoord (barHeight) {
    const MARGIN_BOTTOM = 30

    const yCoordinate = this.#svgHeight - barHeight - MARGIN_BOTTOM

    return yCoordinate
  }

  /**
   * Creates an SVG rect element to represent a bar in the horizontal bar diagram.
   *
   * @param {object} config - The data structure.
   * @returns {SVGRectElement} The created SVG rect element representing the bar.
   */
  #createBar (config) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', config.xCoordinate)
    rect.setAttribute('y', config.yCoordinate)
    rect.setAttribute('width', config.barWidth)
    rect.setAttribute('height', config.barHeigth)
    rect.setAttribute('fill', config.visualData.color)

    return rect
  }

  /**
   * Applies interactivity and animation settings to a given rect element.
   *
   * @param {SVGRectElement} rect - The SVG rect element to apply settings to.
   * @param {object} config - The data structure.
   */
  #createInteractivity (rect, config) {
    const interactivityAndAnimationSettings = {
      element: rect,
      finalHeight: config.barHeigth,
      finalYCoordinate: config.yCoordinate,
      visualData: config.visualData,
      type: diagramTypes.HORIZONTAL_BAR
    }
    super.applyInteractivityAndAnimation(interactivityAndAnimationSettings)
  }

  /**
   * Creates an SVG text element to display a label for a horizontal bar.
   *
   * @param {object} config - The data structure.
   * @returns {SVGTextElement} The created SVG text element displaying the label.
   */
  #createLabel (config) {
    const MARGINS_RIGHT = 2
    const MARGIN_BOTTOM = 10

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', config.xCoordinate + config.barWidth / MARGINS_RIGHT)
    text.setAttribute('y', config.svgHeight - MARGIN_BOTTOM)
    text.setAttribute('fill', 'black')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-size', this.#dataObject.config.fonts.xAxel)
    text.textContent = config.visualData.label

    return text
  }
}

export { HorizontalBarDiagram }
