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
  #animation
  #visualData
  #barWidth
  #svg
  #yAxelFontSize
  #xAxelFontSize
  #barSpacing
  #showGrid
  #svgWidth
  /**
   * Creates an instance of CreateData. This will create and validate the config.
   *
   * @param {object} config - The config that will be used to render the diagram.
   */
  constructor (config) {
    this.#visualData = []

    /* --------- VALIDATE --------- */
    this.#setElementId(config.elementId)
    this.#setData(config.data)
    this.#setInteractivity(config.interactivity)
    this.#setAnimation(config.animation)
    this.#setSvg(config.elementId)
    this.#setSvgWidth()
    this.#setBarSpacing()
    this.#setBarWidth()
    this.#setXAxelFontSize()
    this.#setYAxelFontSize(this.#svg.getAttribute('height'))
    this.#setShowGrid(config.decoration)
    /* ---------------------------- */

    // This must be done last
    this.#createObject()
  }

  /**
   * Gets the svg width and sets it to a private field.
   */
  #setSvgWidth () {
    this.#svgWidth = this.#svg.getAttribute('width')
  }

  /**
   * Sets the show grid.
   *
   * @param {boolean} decoration - If the user wants to show the grid.
   */
  #setShowGrid (decoration) {
    if (decoration !== undefined) {
      if (decoration.showGrid !== undefined && typeof decoration.showGrid !== 'boolean') {
        throw new Error('showGrid must be a boolean')
      }

      this.#showGrid = decoration.showGrid
    } else {
      this.#showGrid = true
    }
  }

  /**
   * Sets the bar spacing.
   */
  #setBarSpacing () {
    if (this.#svgWidth < 200) {
      this.#barSpacing = 1
    } else if (this.#svgWidth < 600) {
      this.#barSpacing = 5
    } else {
      this.#barSpacing = 10
    }
  }

  /**
   * Sets the x axel font size.
   */
  #setXAxelFontSize () {
    if (this.#svgWidth < 200) {
      this.#xAxelFontSize = 4
    } else if (this.#svgWidth < 400) {
      this.#xAxelFontSize = 8
    } else if (this.#svgWidth <= 600) {
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

    if (!this.#setSvg) {
      throw new Error('The elementId does not exist')
    }
  }

  /**
   * Sets the bar width. **Magical number** 50 is the padding on the left side of the svg element.
   */
  #setBarWidth () {
    const dataLength = this.#visualData.length
    const barSpacing = this.#barSpacing * dataLength
    const PADDING = 50

    this.#barWidth = ((this.#svgWidth - barSpacing - PADDING) / (dataLength))
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
      let speed = 0

      if (animation.speed) {
        if (typeof animation.speed !== 'number') {
          throw new Error('Animation speed must be a number')
        }

        speed = animation.speed
      } else {
        speed = 100
      }

      this.#animation = {
        speed
      }
    }
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
          show: interactivity.expand ? interactivity.expand : false
        },
        infoBoxWhenHover: {
          // check if the user want to add a little information about the bars when the mouse is over them
          show: interactivity.infoBoxWhenHover ? interactivity.infoBoxWhenHover : false
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
      if (!data.value) {
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
   * Validate the value and place it in an array if ok.
   *
   * @param {number} value - The value each "bar" have.
   */
  #validateValue (value) {
    if (typeof value !== 'number') {
      throw new Error('Value need to ba a number.')
    }
  }

  /**
   * Sets the element id.
   *
   * @param {string} elementId - The element id that will be used to render the diagram.
   */
  #setElementId (elementId) {
    if (elementId === undefined) {
      throw new Error('The element is not provided.')
    } else if (typeof elementId !== 'string' || !elementId.startsWith('#')) {
      throw new Error('Could not find the element in the DOM.')
    } else {
      this.#elementId = elementId
    }
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
    if (typeof label !== 'string') {
      throw new Error('Labels must be a string')
    } else if (label.length > 20) {
      throw new Error('Label is longer then 20 character.')
    }
  }

  /**
   * Creates the object.
   */
  #createObject () {
    this.#dataObject = {
      config: {
        elementId: this.#elementId,
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
