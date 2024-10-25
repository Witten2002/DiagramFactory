/**
 * A class to animate the diagrams.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

import { diagramTypes } from './config/DiagramTypes.js'

/**
 * A class representing a diagram.
 */
class Animation {
  #element

  /**
   * Creates an instance of Animate.
   *
   * @param {object} element - The chart that will be used to render the diagram.
   */
  constructor (element) {
    this.#setElement(element)
  }

  /**
   * Sets the element.
   *
   * @param {object} element - The element to set.
   */
  #setElement (element) {
    this.#element = element
  }

  /**
   * Animate the diagram.
   *
   * @param {object} config - The configuration of the animation.
   * @param {number} speed - The speed of the animation.
   */
  startAnimation (config, speed) {
    if (this.#isHorizontal(config.type)) {
      this.#animateHorizontalBar(config, speed)
    }
  }

  /**
   * Checks if the diagram type is horizontal.
   *
   * @param {string} type - The type of the diagram.
   * @returns {boolean} - Returns true if the diagram type is horizontal, otherwise false.
   */
  #isHorizontal (type) {
    return type === diagramTypes.HORIZONTAL_BAR
  }

  /**
   * Animates the each bar of the diagram.
   *
   * @param {object} config - The configuration of the animation.
   * @param {number} speed - The speed of the animation.
   */
  #animateHorizontalBar (config, speed) {
    let currentHeight = 0
    let currentY = this.#calcCurrentY(config)

    const increment = this.#calcIncrement(config, speed)

    /**
     * Animates the bars.
     */
    const animate = () => {
      if (currentHeight < config.finalHeight) {
        currentHeight += increment
        currentY -= increment
        this.#setHeight(currentHeight, currentY)
        requestAnimationFrame(animate)
      } else {
        this.#setHeight(config.finalHeight, config.finalYCoordinate)
      }
    }
    requestAnimationFrame(animate)
  }

  /**
   * Calculates the current y-coordinate of the element.
   *
   * @param {object} config - The configuration of the animation.
   * @returns {number} - The calculated y-coordinate.
   */
  #calcCurrentY (config) {
    return parseInt(this.#element.getAttribute('y')) + config.finalHeight
  }

  /**
   * Calculates the increment for the animation.
   *
   * @param {object} config - The configuration of the animation.
   * @param {number} speed - The speed of the animation.
   * @returns {number} - The calculated increment
   */
  #calcIncrement (config, speed) {
    return config.finalHeight / speed
  }

  /**
   * Sets the height and y-coordinate of the element.
   *
   * @param {number} height - The height of the element.
   * @param {number} yCoordinate - The y-coordinate of the element.
   */
  #setHeight (height, yCoordinate) {
    this.#element.setAttribute('height', height)
    this.#element.setAttribute('y', yCoordinate)
  }
}

export { Animation }
