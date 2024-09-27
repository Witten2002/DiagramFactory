/**
 * The class for creating Circle Diagrams.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */
import { Diagram } from './Diagram.js'

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
    this.#dataObject = super.getDataObject()
    this.#visualData = super.getVisualData()

    this.#eachPrecents = []
    this.#eachAngles = []
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

    const radius = Math.min(svgWidth, svgHeight) / 2 - 50
    const centerX = svgWidth / 2
    const centerY = svgHeight / 2

    let startAngle = 0

    for (let i = 0; i < this.#eachAngles.length; i++) {
      const endAngle = startAngle + this.#eachAngles[i] * Math.PI / 180

      /* ---------------- Each Section Coords ---------------- */
      const x1 = centerX + radius * Math.cos(startAngle)
      const y1 = centerY + radius * Math.sin(startAngle)
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)
      /* ----------------------------------------------------- */

      // Determine if the arc should be the larger (1) or smaller (0) arc
      const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

      // path config
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathData)
      path.setAttribute('fill', this.#visualData[i].color)

      /* ---------------------- INTERACTIVITY ---------------------- */
      const interactivityAndAnimationSettings = {
        element: path,
        visualData: this.#visualData[i],
        type: 'Circle'
      }
      super.applyInteractivityAndAnimation(interactivityAndAnimationSettings)
      /* ----------------------------------------------------------- */

      svg.appendChild(path)

      startAngle = endAngle
    }
    this.#showLabels(svg)
  }

  /**
   * Creating a infobox.
   *
   * @param {object} svg - the DOM element.
   */
  #showLabels (svg) {
    const xCoord = 10
    let yCoord = 10

    for (let i = 0; i < this.#visualData.length; i++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', xCoord)
      rect.setAttribute('y', yCoord)
      rect.setAttribute('width', 10)
      rect.setAttribute('height', 10)
      rect.setAttribute('fill', this.#visualData[i].color)

      svg.appendChild(rect)

      const textPercent = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      textPercent.setAttribute('x', xCoord * 3)
      textPercent.setAttribute('y', yCoord + 8)
      textPercent.setAttribute('fill', 'black')
      textPercent.setAttribute('text-anchor', 'left')
      textPercent.setAttribute('font-size', this.#dataObject.config.fonts.xAxel)

      /* ------------ Calculate correct percentage ------------ */
      const percentInDec = this.#eachPrecents[i]
      const percent = Math.round((percentInDec * 100))
      /* ------------------------------------------------------ */
      textPercent.textContent = `${percent}%`

      svg.appendChild(textPercent)

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', xCoord * 6)
      text.setAttribute('y', yCoord + 8)
      text.setAttribute('fill', 'black')
      text.setAttribute('text-anchor', 'left')
      text.setAttribute('font-size', this.#dataObject.config.fonts.xAxel)
      text.textContent = this.#visualData[i].label

      svg.appendChild(text)

      yCoord += 15
    }
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
