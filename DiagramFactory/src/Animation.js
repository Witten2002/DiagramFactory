/**
 * A class to animate the diagrams.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

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
    this.#element = element
  }

  /**
   * Animate the diagram.
   *
   * @param {object} config - The configuration of the animation.
   */
  animation (config) {
    if (config.type === 'horizontal') {
      this.#animateHorizontalBar(config.finalHeight, config.finalY, config.speed)
    }
  }

  /**
   * Animates the each bar of the diagram.
   *
   * @param {number} finalHeight - The final height of the bar.
   * @param {number} finalY - The final y position of the bar.
   * @param {number} speed - The speed of the animation.
   */
  #animateHorizontalBar (finalHeight, finalY, speed) {
    let currentHeight = 0
    let currentY = parseInt(this.#element.getAttribute('y')) + finalHeight

    const SPEED = speed
    const increment = finalHeight / SPEED
    const yIncrement = finalHeight / SPEED

    /**
     * Animates the bars.
     */
    const animate = () => {
      if (currentHeight < finalHeight) {
        currentHeight += increment
        currentY -= yIncrement
        this.#element.setAttribute('height', currentHeight)
        this.#element.setAttribute('y', currentY)
        requestAnimationFrame(animate)
      } else {
        this.#element.setAttribute('height', finalHeight)
        this.#element.setAttribute('y', finalY)
      }
    }
    requestAnimationFrame(animate)
  }
}

export { Animation }
