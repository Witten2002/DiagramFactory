/**
 * A class representing a interactivity on bars.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

import { diagramElements } from './config/DiagramTypes.js'

/**
 * A class representing a interactivity.
 */
class Interactivity {
  /* ----- Private properties ----- */
  #element
  #originalHeight
  #originalWidth
  #originalX
  #originalY
  #infoBox
  #title
  #value
  #orginalRadius
  /* ----------------------------- */

  /**
   * Creates an instance of Interactivity.
   *
   * @param {object} element - The chart that will be used to render the diagram.
   */
  constructor (element) {
    this.#setElement(element)
    this.#setOrigianlHeight()
    this.#setOriginalWidth()
    this.#setOrginalX()
    this.#setOrginalY()
    this.#setOrginalRadius()
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
   * Sets the original height.
   */
  #setOrigianlHeight () {
    this.#originalHeight = this.#toInt(this.#element.getAttribute('height'))
  }

  /**
   * Sets the original width.
   */
  #setOriginalWidth () {
    this.#originalWidth = this.#toInt(this.#element.getAttribute('width'))
  }

  /**
   * Sets the original x position.
   */
  #setOrginalX () {
    this.#originalX = this.#toInt(this.#element.getAttribute('x'))
  }

  /**
   * Sets the original y position.
   */
  #setOrginalY () {
    this.#originalY = this.#toInt(this.#element.getAttribute('y'))
  }

  /**
   * Sets the original radius.
   */
  #setOrginalRadius () {
    this.#orginalRadius = this.#toInt(this.#element.getAttribute('r'))
  }

  /**
   * Converts a string to an integer.
   *
   * @param {string} value - The value to convert.
   * @returns {number} - The value as an integer.
   */
  #toInt (value) {
    return parseInt(value)
  }

  /**
   * Makes the bars interactive.
   *
   * @param {object} dataObject - The settings for the interactivity.
   * @param {object} config - The settings for the interactivity.
   */
  makeInteractive (dataObject, config) {
    // currently not working with circle/path diagrams
    if (dataObject.config.interactivity.expand.show && !this.#isCircle(config.type)) {
      this.#reactToMouseOver(dataObject.config.interactivity.expand.show)
    }

    if (dataObject.config.interactivity.infoBoxWhenHover.show) {
      this.#createInfoBox()
      this.#showInfoBoxWhenHover(config.visualData.label, config.visualData.value)
    }
  }

  /**
   * Checks if the given type is not a circle.
   *
   * @param {string} type - The type to check.
   * @returns {boolean} - Returns true if the type is not a circle, otherwise false.
   */
  #isCircle (type) {
    return type === diagramElements.CIRCLE
  }

  /**
   * The user can interactive with the diagram.
   *
   * @param {boolean} expand - If the diagram should expaned when the mouse is over them.
   */
  #reactToMouseOver (expand) {
    this.#element.addEventListener('mouseover', (event) => {
      if (expand) {
        // expand the bars when the mouse is over them and animate the change
        if (this.#isHorizontalBar(event.target.tagName)) {
          this.#makeHorizontalBarInteractivity(event)
        } else if (this.#isCircle(event.target.tagName)) {
          this.#makeCircleInteractive(event)
        }
      }
    })

    // reset the bars to their original size and position when the mouse is not over them
    this.#element.addEventListener('mouseout', (event) => {
      if (expand) {
        if (this.#isHorizontalBar(event.target.tagName)) {
          this.#resetHorizontalBar(event)
        } else if (this.#isCircle(event.target.tagName)) {
          this.#resetCircle(event)
        }
      }
    })
  }

  /**
   * Checks if the event target is a horizontal bar.
   *
   * @param {*} type - The event to check.
   * @returns {boolean} - Returns true if the event target is a horizontal bar, otherwise false.
   */
  #isHorizontalBar (type) {
    return type === diagramElements.HORIZONTAL_BAR
  }

  /**
   * Applies interactivity to a horizontal bar element by expanding its size on an event.
   *
   * @param {Event} event - The event object triggered by the interaction.
   */
  #makeHorizontalBarInteractivity (event) {
    const GROW = 10
    const POSITION = 5

    event.target.style.transition = 'width 0.5s ease, height 0.5s ease, x 0.5s ease, y 0.5s ease'
    event.target.setAttribute('width', this.#originalWidth + GROW)
    event.target.setAttribute('height', this.#originalHeight + GROW)
    event.target.setAttribute('x', this.#originalX - POSITION)
    event.target.setAttribute('y', this.#originalY - POSITION)
  }

  /**
   * Applies interactivity to a circle element by expanding its radius on an event.
   *
   * @param {Event} event - The event object triggered by the interaction.
   */
  #makeCircleInteractive (event) {
    const GROW = 3

    event.target.style.transition = 'r 0.5s ease'
    event.target.setAttribute('r', this.#orginalRadius + GROW)
  }

  /**
   * Resets the dimensions and position of a horizontal bar element to its original state.
   *
   * @param {Event} event - The event object triggered by the interaction.
   */
  #resetHorizontalBar (event) {
    event.target.setAttribute('width', this.#originalWidth)
    event.target.setAttribute('height', this.#originalHeight)
    event.target.setAttribute('x', this.#originalX)
    event.target.setAttribute('y', this.#originalY)
  }

  /**
   * Resets the radius of a circle element to its original state.
   *
   * @param {Event} event - The event object triggered by the interaction.
   */
  #resetCircle (event) {
    event.target.setAttribute('r', this.#orginalRadius)
  }

  /**
   * Shows an info box when the mouse is over the bars.
   *
   * @param {object} title - The settings for the info box.
   * @param {object} value - The settings for the info box.
   */
  #showInfoBoxWhenHover (title, value) {
    this.#element.addEventListener('mouseover', (event) => {
      this.#showInfoBox(event, title, value)
    })

    this.#element.addEventListener('mousemove', (event) => {
      this.#moveInfoBox(event)
    })

    this.#element.addEventListener('mouseout', (event) => {
      this.#hideInfoBox(event)
    })
  }

  /**
   * Displays an information box with the given title and value.
   *
   * @param {Event} event - The event object triggered by the interaction.
   * @param {string} title - The title to display in the information box.
   * @param {string|number} value - The value to display in the information box.
   */
  #showInfoBox (event, title, value) {
    this.#infoBox.style.display = 'flex'
    setTimeout(() => {
      this.#infoBox.style.opacity = '1'
      this.#infoBox.style.transform = 'scale(1)'
    }, 1000)
    this.#title.textContent = title
    this.#value.textContent = value
  }

  /**
   * Moves the information box to follow the cursor position.
   *
   * @param {MouseEvent} event - The mouse event object triggered by the interaction.
   */
  #moveInfoBox (event) {
    const MOVE = 10

    const scrollTop = window.scrollY
    const scrollLeft = window.scrollX

    this.#infoBox.style.top = `${event.clientY + scrollTop + MOVE}px`
    this.#infoBox.style.left = `${event.clientX + scrollLeft + MOVE}px`
  }

  /**
   * Hides the information box by setting its display, opacity, and transform properties.
   *
   * @param {Event} event - The event object triggered by the interaction.
   */
  #hideInfoBox (event) {
    this.#infoBox.style.display = 'none'
    this.#infoBox.style.opacity = '0'
    this.#infoBox.style.transform = 'scale(0.95)'
  }

  /**
   * Creates the info box.
   */
  #createInfoBox () {
    this.#createInfoBoxElement()
    this.#createInfoBoxContent()

    this.#styleInfoBox()

    document.body.appendChild(this.#infoBox)
  }

  /**
   * Creates an info box element and assigns it to the instance variable `#infoBox`.
   */
  #createInfoBoxElement () {
    this.#infoBox = document.createElement('div')
  }

  /**
   * Creates an info box element and assigns it to the instance variable `#infoBox`.
   */
  #createInfoBoxContent () {
    this.#title = document.createElement('span')
    this.#title.style.fontWeight = 'bold'
    this.#title.style.fontFamily = 'Arial'
    this.#title.style.fontSize = '12px'
    this.#infoBox.appendChild(this.#title)

    this.#value = document.createElement('span')
    this.#value.style.fontFamily = 'Arial'
    this.#value.style.fontSize = '12px'
    this.#infoBox.appendChild(this.#value)
  }

  /**
   * Styles the info box element with predefined CSS properties.
   */
  #styleInfoBox () {
    this.#infoBox.style.position = 'absolute'
    this.#infoBox.style.backgroundColor = 'white'
    this.#infoBox.style.color = 'black'
    this.#infoBox.style.padding = '5px'
    this.#infoBox.style.borderRadius = '1px'
    this.#infoBox.style.border = '1px solid black'
    this.#infoBox.style.zIndex = '10'
    this.#infoBox.style.display = 'none'
    this.#infoBox.style.pointerEvents = 'none'
    this.#infoBox.style.flexDirection = 'column'
    this.#infoBox.style.justifyContent = 'space-between'
    this.#infoBox.style.alignItems = 'start'
    this.#infoBox.style.transition = 'opacity 1s ease, transform 1s ease'
    this.#infoBox.style.opacity = '0'
    this.#infoBox.style.transform = 'scale(0.95)'
  }
}

export { Interactivity }
