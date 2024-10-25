/**
 * Represents The diagram factory.
 *
 * @author Ludwig Wittenberg <lw223cq@student.lnu.se>
 * @version 1.0.0
 */
import { HorizontalBarDiagram } from './src/HorizontalBarDiagram.js'
import { LineDiagram } from './src/LineDiagram.js'
import { CircleDiagram } from './src/CircleDiagram.js'

/**
 * A class representing a diagram factory.
 */
class DiagramFactory {
  #config
  /**
   * Creates an instance of DiagramFactory.
   *
   * @param {object} config - The congig that will be used to render the diagram.
   */
  constructor (config) {
    this.#config = config
  }

  /**
   * Render the HorizontalBarDiagram and place it in the DOM.
   */
  displayBarDiagram () {
    try {
      const horizontalBarDiagram = new HorizontalBarDiagram(this.#config)
      horizontalBarDiagram.render()
    } catch (error) {
      console.error(error.message)
    }
  }

  /**
   * Render the LineDiagram and place it in the DOM.
   */
  displayLineDiagram () {
    try {
      const lineDiagram = new LineDiagram(this.#config)
      lineDiagram.render()
    } catch (error) {
      console.error(error.message)
    }
  }

  /**
   * Render the Circlediagram and place it in the DOM.
   */
  displayCircleDiagram () {
    try {
      const circleDiagram = new CircleDiagram(this.#config)
      circleDiagram.render()
    } catch (error) {
      console.error(error.message)
    }
  }
}

export { DiagramFactory }
