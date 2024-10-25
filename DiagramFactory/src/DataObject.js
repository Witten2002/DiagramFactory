/**
 * This module concatinates the config that will be used to render the diagram.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */

/**
 * This creates the config that will be used to render the diagram.
 */
class DataObject {
  #dataObject
  #interactivity
  #elementId
  #height
  #width
  #animation
  #visualData
  #barWidth
  #svg
  #yAxelFontSize
  #xAxelFontSize
  #barSpacing
  #showGrid
  #shadowRoot

  /**
   * Creates an instance of CreateData. This will create and validate the config.
   *
   * @param {object} config - The config that will be used to render the diagram.
   */
  constructor (config) {
    this.#visualData = []

    /* --------- VALIDATE --------- */
    this.#setElementId(config.elementId)
    this.#setShadowRoot(config.shadowRoot)
    this.#setHeight(config.height)
    this.#setWidth(config.width)
    this.#setData(config.data)
    this.#setInteractivity(config.interactivity)
    this.#setAnimation(config.animation)
    this.#setSvg(config.elementId)
    this.#setBarSpacing()
    this.#setBarWidth()
    this.#setXAxelFontSize()
    this.#setYAxelFontSize(this.#height)
    this.#setShowGrid(config.decoration)
    /* ---------------------------- */
  }

  /**
   * Sets the shadow root.
   *
   * @param {object} shadowRoot - The shadow root to set.
   */
  #setShadowRoot (shadowRoot) {
    this.#shadowRoot = shadowRoot
  }

  /**
   * Sets the height of the data object.
   *
   * @param {number} height - The height to set.
   * @throws {Error} Throws an error if the height is not a number.
   */
  #setHeight (height) {
    if (!this.#isNumber(height)) {
      throw new Error('Height must be a number')
    }

    this.#height = height
  }

  /**
   * Sets the width of the data object.
   *
   * @param {number} width - The width to set.
   * @throws {Error} Throws an error if the width is not a number.
   */
  #setWidth (width) {
    if (!this.#isNumber(width)) {
      throw new Error('Width must be a number')
    }

    this.#width = width
  }

  /**
   * Sets the show grid.
   *
   * @param {boolean} decoration - If the user wants to show the grid.
   */
  #setShowGrid (decoration) {
    if (decoration !== undefined) {
      if (this.#isValidShowGridDecoration(decoration.showGrid)) {
        throw new Error('showGrid must be a boolean')
      }

      this.#showGrid = decoration.showGrid
    } else {
      this.#showGrid = true
    }
  }

  /**
   * Checks if the show grid decoration is valid.
   *
   * @param {boolean} showGrid - The show grid decoration to check.
   * @returns {boolean} - Returns true if the show grid decoration is valid, otherwise false.
   */
  #isValidShowGridDecoration (showGrid) {
    return showGrid !== undefined && this.#isBoolean(showGrid)
  }

  /**
   * Checks if the given value is not a boolean.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} - Returns true if the value is not a boolean, otherwise false.
   */
  #isBoolean (value) {
    return typeof value !== 'boolean'
  }

  /**
   * Sets the bar spacing.
   */
  #setBarSpacing () {
    if (this.#width < 200) {
      this.#barSpacing = 1
    } else if (this.#width < 600) {
      this.#barSpacing = 5
    } else {
      this.#barSpacing = 10
    }
  }

  /**
   * Sets the x axel font size.
   */
  #setXAxelFontSize () {
    if (this.#width < 200) {
      this.#xAxelFontSize = 4
    } else if (this.#width < 400) {
      this.#xAxelFontSize = 8
    } else if (this.#width <= 600) {
      this.#xAxelFontSize = 12
    } else {
      this.#xAxelFontSize = 14
    }
  }

  /**
   * Sets the y axel font size.
   *
   * @param {number} height - The height of the svg element.
   */
  #setYAxelFontSize (height) {
    if (height < 200) {
      this.#yAxelFontSize = 4
    } else if (height < 400) {
      this.#yAxelFontSize = 8
    } else if (height < 600) {
      this.#yAxelFontSize = 12
    } else {
      this.#yAxelFontSize = 14
    }
  }

  /**
   * Sets the svg element.
   *
   * @param {string} elementId - The id of the svg element.
   */
  #setSvg (elementId) {
    this.#svg = document.querySelector(elementId)

    if (!this.#svg) {
      this.#svg = this.#shadowRoot.querySelector(elementId)
    }

    if (!this.#svg) {
      throw new Error('No element found.')
    }

    if (!this.#isEmpty()) {
      throw new Error('The svg is not empty.')
    }
  }

  /**
   * Checks if the SVG element is empty.
   *
   * @returns {boolean} - Returns true if the SVG element has no child nodes, otherwise false.
   */
  #isEmpty () {
    const EMPTY = 0

    return this.#svg.childNodes.length === EMPTY
  }

  /**
   * Sets the bar width. **Magical number** 50 is the padding on the left side of the svg element.
   */
  #setBarWidth () {
    const dataLength = this.#visualData.length
    const barSpacing = this.#barSpacing * dataLength
    const PADDING = 50

    this.#barWidth = ((this.#width - barSpacing - PADDING) / (dataLength))
  }

  /**
   * Sets the animation config.
   *
   * @param {object} animation - The animation that will be used to render the diagram.
   */
  #setAnimation (animation) {
    if (!animation) {
      this.#animation = false
    } else {
      const DEFAULT_SPEED = 100
      let speed = 0

      if (animation.speed) {
        if (!this.#isNumber(animation.speed)) {
          throw new Error('Animation speed must be a number')
        }

        speed = animation.speed
      } else {
        speed = DEFAULT_SPEED
      }

      this.#animation = {
        speed
      }
    }
  }

  /**
   * Checks if the given value is not a number.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} - Returns true if the value is not a number, otherwise false.
   */
  #isNumber (value) {
    return typeof value === 'number'
  }

  /**
   * Sets the interactivity.
   *
   * @param {boolean} interactivity - If the user wants to add interactivity to the diagram.
   */
  #setInteractivity (interactivity) {
    if (interactivity) {
      this.#interactivity = {
        expand: {
          // check if the user want hover effect on the bars
          show: interactivity.expand || false
        },
        infoBoxWhenHover: {
          // check if the user want to add a little information about the bars when the mouse is over them
          show: interactivity.infoBoxWhenHover || false
        }
      }
    }
  }

  /**
   * Sets the data.
   *
   * @param {object} dataArray - The data that will be used to render the diagram.
   */
  #setData (dataArray) {
    if (!dataArray) {
      throw new Error('Data was not provided.')
    }

    for (const data of dataArray) {
      // check if not provided
      if (this.#validDataValue(data)) {
        throw new Error('Value was not provided.')
      } else if (!data.label) {
        throw new Error('Label was not provided.')
      } else if (!data.color) {
        throw new Error('Color was not provided.')
      }

      // validate each value
      this.#validateValue(data.value)
      this.#validateLabel(data.label)
      this.#validateColor(data.color)

      // The Ok Data.
      this.#visualData.push(data)
    }
  }

  /**
   * Will check if value exist.
   *
   * @param {object} data The value to check.
   * @returns {boolean} if value exist or not.
   */
  #validDataValue (data) {
    return this.#isNull(data.value) || this.#isUndefined(data.value) || data.value === ''
  }

  /**
   * Checks if the given value is null.
   *
   * @param {*} element - The value to check.
   * @returns {boolean} - Returns true if the value is null, otherwise false.
   */
  #isNull (element) {
    return element === null
  }

  /**
   * Validate the value and place it in an array if ok.
   *
   * @param {number} value - The value each "bar" have.
   */
  #validateValue (value) {
    if (!this.#isNumber(value)) {
      throw new Error('Value need to ba a number.')
    }
  }

  /**
   * Sets the element id.
   *
   * @param {string} elementId - The element id that will be used to render the diagram.
   */
  #setElementId (elementId) {
    if (this.#isUndefined(elementId)) {
      throw new Error('The element is not provided.')
    } else if (this.#isString(elementId) || !elementId.startsWith('#')) {
      throw new Error('Could not find the element in the DOM.')
    } else {
      this.#elementId = elementId
    }
  }

  /**
   * Checks if the given value is undefined.
   *
   * @param {*} element - The value to check.
   * @returns {boolean} - Returns true if the value is undefined, otherwise false.
   */
  #isUndefined (element) {
    return element === undefined
  }

  /**
   * Checks if the given value is not a string.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} - Returns true if the value is not a string, otherwise false.
   */
  #isString (value) {
    return typeof value !== 'string'
  }

  /**
   * Validate a color.
   *
   * @param {string} color - the color to be validated.
   */
  #validateColor (color) {
    const style = new Option().style
    style.color = color

    if (style.color === '') {
      throw new Error('Not a valid color')
    }
  }

  /**
   * Sets the labels.
   *
   * @param {object} label - The labels that will be used to render the diagram.
   */
  #validateLabel (label) {
    if (this.#isString(label)) {
      throw new Error('Labels must be a string')
    } else if (label.length > 20) {
      throw new Error('Label is longer then 20 character.')
    }
  }

  /**
   * Creates the object.
   */
  createObject () {
    this.#dataObject = {
      config: {
        elementId: this.#elementId,
        shadowRoot: this.#shadowRoot,
        height: this.#height,
        width: this.#width,
        interactivity: this.#interactivity,
        animation: this.#animation,
        barWidth: this.#barWidth,
        barSpacing: this.#barSpacing,
        svg: this.#svg,
        fonts: {
          yAxel: this.#yAxelFontSize,
          xAxel: this.#xAxelFontSize
        },
        decoration: {
          showGrid: this.#showGrid
        }
      },
      visualData: this.#visualData
    }
  }

  /**
   * Returns the visual data.
   *
   * @returns {object} - The data.
   */
  getVisualData () {
    return this.#visualData
  }

  /**
   * Returns the data object.
   *
   * @returns {object} - The data.
   */
  getDataObject () {
    return this.#dataObject
  }
}

export { DataObject }
