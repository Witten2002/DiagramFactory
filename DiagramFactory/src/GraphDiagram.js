/**
 * A module representing a the grap diagrams.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

import { Diagram } from './Diagram.js'

/**
 * A class representing a graph diagram.
 */
class GraphDiagram extends Diagram {
  #graphValues
  #dataObjects
  #visualData
  #barValues
  #svg

  /**
   * Creates an instance of graph diagram.
   *
   * @param {object} config - The data that will be used to render the diagram.
   */
  constructor (config) {
    super(config)
    this.#barValues = []

    this.#setDataObject()
    this.#setVisualData()
    this.#setSvg()
    this.#setState()
  }

  /**
   * Sets the data object.
   */
  #setDataObject () {
    this.#dataObjects = super.getDataObject()
  }

  /**
   * Sets the visual data.
   */
  #setVisualData () {
    this.#visualData = super.getVisualData()
  }

  /**
   * Sets the svg.
   */
  #setSvg () {
    this.#svg = super.getSvg()
  }

  /**
   * Sets the state of the diagram.
   */
  #setState () {
    this.#setBarValues()
    this.#setMaxValue()
    this.#createAxels(this.#svg, super.getSvgWidth(), super.getSvgHeight())
  }

  /**
   * Rounds up a value to the nearest ten.
   *
   * @param {number} value - The value to round up.
   * @returns {number} - The rounded up value.
   */
  #roundUpToNearestTen (value) {
    const ROUNDING_FACTOR = 10
    return Math.ceil(value / ROUNDING_FACTOR) * ROUNDING_FACTOR
  }

  /**
   * Sets the bar values.
   */
  #setBarValues () {
    for (const data of this.#visualData) {
      this.#barValues.push(data.value)
    }
  }

  /**
   * Creates an array with the values.
   *
   * @returns {Array} - The values.
   */
  getBarValues () {
    return this.#barValues
  }

  /**
   * Returns the data.
   */
  #setMaxValue () {
    const NUM_OF_ROWS = 5

    const values = this.getBarValues()
    const maxValue = Math.max(...values)
    const rowValue = (this.#roundUpToNearestTen(maxValue) / NUM_OF_ROWS)
    this.#graphValues = (this.#roundUpToNearestTen(rowValue) * NUM_OF_ROWS)
  }

  /**
   * Returns the max value.
   *
   * @returns {number} - The max value.
   */
  getMaxValue () {
    return this.#graphValues
  }

  /**
   * Creates the axels.
   *
   * @param {object} svg - The svg element.
   * @param {number} svgWidth - The width of the svg element.
   * @param {number} svgHeight - The height of the svg element.
   */
  #createAxels (svg, svgWidth, svgHeight) {
    const axisPadding = 50

    const config = {
      axisPadding,
      svg,
      svgWidth,
      svgHeight
    }

    this.#createXAxel(config)

    this.#createYAxel(config)

    this.#showAxisValuesLines(config)
  }

  /**
   * Creates an SVG line element representing the X-axis and appends it to the given SVG element.
   *
   * @param {object} config - The datastructure for the method.
   */
  #createXAxel (config) {
    const X_AXIS_START_OFFSET = 10
    const Y_AXIS_POSITION = 20

    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    xAxis.setAttribute('x1', config.axisPadding - X_AXIS_START_OFFSET)
    xAxis.setAttribute('y1', config.svgHeight - config.axisPadding + Y_AXIS_POSITION)
    xAxis.setAttribute('x2', config.svgWidth)
    xAxis.setAttribute('y2', config.svgHeight - config.axisPadding + Y_AXIS_POSITION)
    xAxis.setAttribute('stroke', 'black')

    config.svg.appendChild(xAxis)
  }

  /**
   * Creates an SVG line element representing the Y-axis and appends it to the given SVG element.
   *
   * @param {object} config - The datastructure for the method.
   */
  #createYAxel (config) {
    const X_AXIS_START_OFFSET = 10
    const Y_AXIS_POSITION = 30
    const X_AXIS_END = 20

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    yAxis.setAttribute('x1', config.axisPadding - X_AXIS_START_OFFSET)
    yAxis.setAttribute('y1', config.axisPadding - Y_AXIS_POSITION)
    yAxis.setAttribute('x2', config.axisPadding - X_AXIS_START_OFFSET)
    yAxis.setAttribute('y2', config.svgHeight - config.axisPadding + X_AXIS_END)
    yAxis.setAttribute('stroke', 'black')

    config.svg.appendChild(yAxis)
  }

  /**
   * Creates lines and values.
   *
   * @param {object} config - The datastructure for the method.
   */
  #showAxisValuesLines (config) {
    const NUM_OF_LINES = 5
    for (let i = 0; i <= NUM_OF_LINES; i++) {
      const labelConfig = {
        axisPadding: config.axisPadding,
        yPos: this.#calculateYPos(config, i, NUM_OF_LINES),
        numOfLines: NUM_OF_LINES,
        index: i
      }

      const label = this.#createYLabel(labelConfig)

      config.svg.appendChild(label)

      if (this.#dataObjects.config.decoration.showGrid) {
        const line = this.#createGrid(labelConfig, config.svgWidth)

        config.svg.appendChild(line)
      }
    }
  }

  /**
   * Calculates the Y-coordinate for a given index.
   *
   * @param {object} config - The datastructure for the method.
   * @param {number} index - The index of the value.
   * @param {number} numOfLines - The number of lines.
   * @returns {number} - The calculated Y-coordinate.
   */
  #calculateYPos (config, index, numOfLines) {
    return config.svgHeight - config.axisPadding - (index * (config.svgHeight - config.axisPadding) / numOfLines)
  }

  /**
   * Creates an SVG text element to display a Y-axis label.
   *
   * @param {object} labelConfig - The datastructure for the method.
   * @returns {SVGTextElement} The created SVG text element displaying the Y-axis label.
   */
  #createYLabel (labelConfig) {
    const X_AXIS_START_OFFSET = 15
    const Y_AXIS_POSITION = 25

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    label.setAttribute('x', labelConfig.axisPadding - X_AXIS_START_OFFSET)
    label.setAttribute('y', labelConfig.yPos + Y_AXIS_POSITION)
    label.setAttribute('text-anchor', 'end')
    label.setAttribute('font-size', this.#dataObjects.config.fonts.yAxel)
    label.textContent = Math.round((this.#graphValues / labelConfig.numOfLines) * labelConfig.index)

    return label
  }

  /**
   * Creates an SVG line element to represent a grid line in the diagram.
   *
   * @param {object} labelConfig - The datastructure for the method.
   * @param {number} svgWidth - The width of the SVG element.
   * @returns {SVGLineElement} The created SVG line element representing the grid line.
   */
  #createGrid (labelConfig, svgWidth) {
    const X_AXIS_START_OFFSET = 10
    const Y_AXIS_POSITION = 20

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', labelConfig.axisPadding - X_AXIS_START_OFFSET)
    line.setAttribute('y1', labelConfig.yPos + Y_AXIS_POSITION)
    line.setAttribute('x2', svgWidth)
    line.setAttribute('y2', labelConfig.yPos + Y_AXIS_POSITION)
    line.setAttribute('stroke', 'grey')

    return line
  }
}

export { GraphDiagram }
