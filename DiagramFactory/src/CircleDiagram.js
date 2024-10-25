/**
 * The class for creating Circle Diagrams.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */
import { Diagram } from './Diagram.js'
import { diagramTypes } from './config/DiagramTypes.js'

/**
 * The CircleDiagram class
 */
class CircleDiagram extends Diagram {
  #dataObject
  #visualData
  #eachPrecents
  #eachAngles
  /**
   * The constructor.
   *
   * @param {object} config - The config object
   */
  constructor (config) {
    super(config)
    this.#eachPrecents = []
    this.#eachAngles = []
    this.#setDataObject()
    this.#setVisualData()
  }

  /**
   * Sets the data object.
   */
  #setDataObject () {
    this.#dataObject = super.getDataObject()
  }

  /**
   * Sets the visual data.
   */
  #setVisualData () {
    this.#visualData = super.getVisualData()
  }

  /**
   * The render method that creates the Diagram.
   */
  render () {
    const sum = this.#calculateSum()
    this.#calculateEachPercent(sum)
    this.#calculateEachAngle()

    const svg = super.getSvg()
    const svgHeight = super.getSvgHeight()
    const svgWidth = super.getSvgWidth()

    this.#createEachPath(svgWidth, svgHeight, svg)

    this.#showLabels(svg)
  }

  /**
   * Creates and appends SVG path elements representing sections of a circle diagram.
   *
   * @param {number} svgWidth - The width of the SVG element.
   * @param {number} svgHeight - The height of the SVG element.
   * @param {SVGSVGElement} svg - The SVG element to append the path elements to.
   */
  #createEachPath (svgWidth, svgHeight, svg) {
    const context = this.#createContext(svgWidth, svgHeight)

    let startAngle = 0

    for (let i = 0; i < this.#eachAngles.length; i++) {
      const endAngle = this.#calcEndAngle(startAngle, this.#eachAngles[i])

      const angles = {
        startAngle,
        endAngle
      }

      const coordinates = this.#calcEachCoords(context, angles)

      const largeArcFlag = this.#calcLargeArcFlag(angles)

      const pathData = this.#createPathData(context, coordinates, largeArcFlag)

      const path = this.#createPath(pathData, this.#visualData[i].color)

      this.#createInteractivity(path, this.#visualData[i])

      svg.appendChild(path)

      startAngle = endAngle
    }
  }

  /**
   * Creates a context object containing the radius and center coordinates for a circle diagram.
   *
   * @param {number} svgWidth - The width of the SVG element.
   * @param {number} svgHeight - The height of the SVG element.
   * @returns {object} - The context object with radius and center properties.
   */
  #createContext (svgWidth, svgHeight) {
    const context = {
      radius: this.#calcRadius(svgWidth, svgHeight),
      center: this.#calcCenter(svgWidth, svgHeight)
    }

    return context
  }

  /**
   * Calculates the radius for a circle diagram based on the SVG element's width and height.
   *
   * @param {number} svgWidth - The width of the SVG element.
   * @param {number} svgHeight - The height of the SVG element.
   * @returns {number} - The calculated radius of the circle.
   */
  #calcRadius (svgWidth, svgHeight) {
    const DIVIDED = 2
    const PADDING = 30

    return Math.min(svgWidth, svgHeight) / DIVIDED - PADDING
  }

  /**
   * Calculates the center coordinates for a circle diagram based on the SVG element's width and height.
   *
   * @param {number} svgWidth - The width of the SVG element.
   * @param {number} svgHeight - The height of the SVG element.
   * @returns {object} - The center coordinates of the circle.
   */
  #calcCenter (svgWidth, svgHeight) {
    const DIVIDED = 2

    const centerX = svgWidth / DIVIDED
    const centerY = svgHeight / DIVIDED

    return { centerX, centerY }
  }

  /**
   * Calculates the end angle for a segment in a circle diagram.
   *
   * @param {number} startAngle - The starting angle in radians.
   * @param {number} angle - The angle in degrees to be converted and added to the start angle.
   * @returns {number} - The calculated end angle in radians.
   */
  #calcEndAngle (startAngle, angle) {
    const RADIUS_TRIANGLE = 180
    const endAngle = startAngle + angle * Math.PI / RADIUS_TRIANGLE

    return endAngle
  }

  /**
   * Calculates the coordinates for the start and end points of a segment in a circle diagram.
   * !!! COPILOT HELPT ME WITH THE CALCULATIONS !!!
   *
   * @param {object} context - The context object containing the radius and center coordinates.
   * @param {object} angles - The angles object containing the start and end angles in radians.
   * @returns {object} - The coordinates object with properties x1, y1, x2, and y2.
   */
  #calcEachCoords (context, angles) {
    const coords = {
      x1: context.center.centerX + context.radius * Math.cos(angles.startAngle),
      y1: context.center.centerY + context.radius * Math.sin(angles.startAngle),
      x2: context.center.centerX + context.radius * Math.cos(angles.endAngle),
      y2: context.center.centerY + context.radius * Math.sin(angles.endAngle)
    }

    return coords
  }

  /**
   * Calculates the large-arc-flag for an SVG path element based on the given angles.
   * !!! COPILOT HELPT ME WITH THE CALCULATIONS !!!
   *
   * @param {object} angles - The angles object containing the start and end angles in radians.
   * @returns {number} - Returns 1 if the arc is greater than 180 degrees, otherwise 0.
   */
  #calcLargeArcFlag (angles) {
    const largeArcFlag = angles.endAngle - angles.startAngle > Math.PI ? 1 : 0

    return largeArcFlag
  }

  /**
   * Creates the SVG path data string for a segment in a circle diagram.
   * !!! COPILOT HELPT ME WITH THE CALCULATIONS !!!
   *
   * @param {object} context - The context object containing the radius and center coordinates.
   * @param {object} coordinates - The coordinates object containing the start and end points of the segment.
   * @param {number} largeArcFlag - The large-arc-flag for the SVG path element.
   * @returns {string} - The SVG path data string.
   */
  #createPathData (context, coordinates, largeArcFlag) {
    const pathData = [
      `M ${context.center.centerX} ${context.center.centerY}`,
      `L ${coordinates.x1} ${coordinates.y1}`,
      `A ${context.radius} ${context.radius} 0 ${largeArcFlag} 1 ${coordinates.x2} ${coordinates.y2}`,
      'Z'
    ].join(' ')

    return pathData
  }

  /**
   * Creates an SVG path element with the given path data and color.
   *
   * @param {string} pathData - The path data for the SVG path element.
   * @param {string} color - The fill color for the SVG path element.
   * @returns {SVGPathElement} The created SVG path element.
   */
  #createPath (pathData, color) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', pathData)
    path.setAttribute('fill', color)

    return path
  }

  /**
   * Applies interactivity and animation settings to a given path element.
   *
   * @param {SVGPathElement} path - The SVG path element to apply settings to.
   * @param {object} visualData - The data structure.
   */
  #createInteractivity (path, visualData) {
    const interactivityAndAnimationSettings = {
      element: path,
      visualData,
      type: diagramTypes.CIRCLE_DIAGRAM
    }
    super.applyInteractivityAndAnimation(interactivityAndAnimationSettings)
  }

  /**
   * Creating a infobox.
   *
   * @param {object} svg - the DOM element.
   */
  #showLabels (svg) {
    const xCoord = 10
    const yCoord = 10

    const coords = {
      xCoord,
      yCoord
    }

    for (let i = 0; i < this.#visualData.length; i++) {
      const rect = this.#createRect(coords, this.#visualData[i].color)

      svg.appendChild(rect)

      const textPercent = this.#createPercentLabel(coords, this.#eachPrecents[i])

      svg.appendChild(textPercent)

      const text = this.#createTextLabel(coords, this.#visualData[i].label)

      svg.appendChild(text)

      coords.yCoord += 15
    }
  }

  /**
   * Creates an SVG rect element with the given coordinates and color.
   *
   * @param {object} coords - The coordinates.
   * @param {string} color - The fill color of the rect.
   * @returns {SVGRectElement} The created SVG rect element.
   */
  #createRect (coords, color) {
    const SIZE = 10

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', coords.xCoord)
    rect.setAttribute('y', coords.yCoord)
    rect.setAttribute('width', SIZE)
    rect.setAttribute('height', SIZE)
    rect.setAttribute('fill', color)

    return rect
  }

  /**
   * Creates an SVG text element to display the percentage label.
   *
   * @param {object} coords - The coordinates.
   * @param {number} angle - The angle representing the percentage in decimal form.
   * @returns {SVGTextElement} The created SVG text element displaying the percentage.
   */
  #createPercentLabel (coords, angle) {
    const MOVE_X = 3
    const MOVE_Y = 8

    const textPercent = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textPercent.setAttribute('x', coords.xCoord * MOVE_X)
    textPercent.setAttribute('y', coords.yCoord + MOVE_Y)
    textPercent.setAttribute('fill', 'black')
    textPercent.setAttribute('text-anchor', 'left')
    textPercent.setAttribute('font-size', this.#dataObject.config.fonts.xAxel)

    const percent = this.#calculatePercent(angle)
    textPercent.textContent = `${percent}%`

    return textPercent
  }

  /**
   * Calculate the percentage.
   *
   * @param {number} angle - The angle in decimal form.
   * @returns {number} The percentage.
   */
  #calculatePercent (angle) {
    const percentInDec = angle
    const HUNDREDPERCENT = 100
    const percent = Math.round((percentInDec * HUNDREDPERCENT))

    return percent
  }

  /**
   * Creates an SVG text element to display a label.
   *
   * @param {object} coords - The coordinates.
   * @param {string} label - The text content to display.
   * @returns {SVGTextElement} The created SVG text element displaying the label.
   */
  #createTextLabel (coords, label) {
    const MOVE_X = 6
    const MOVE_Y = 8

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', coords.xCoord * MOVE_X)
    text.setAttribute('y', coords.yCoord + MOVE_Y)
    text.setAttribute('fill', 'black')
    text.setAttribute('text-anchor', 'left')
    text.setAttribute('font-size', this.#dataObject.config.fonts.xAxel)
    text.textContent = label

    return text
  }

  /**
   * Calculates the total sum.
   *
   * @returns {number} The total sum.
   */
  #calculateSum () {
    let sum = 0

    for (const data of this.#visualData) {
      sum += data.value
    }

    return sum
  }

  /**
   * Calculates each angle.
   */
  #calculateEachAngle () {
    const TOTAL_ANGEL = 360

    for (const percent of this.#eachPrecents) {
      const angle = TOTAL_ANGEL * percent
      this.#eachAngles.push(angle)
    }
  }

  /**
   * Calculate each percent.
   *
   * @param {number} sum - Total value.
   */
  #calculateEachPercent (sum) {
    for (const data of this.#visualData) {
      const percent = data.value / sum
      this.#eachPrecents.push(percent)
    }
  }
}

export { CircleDiagram }
