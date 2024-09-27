# DiagramFactory

## Description
The DiagramFactory library is a tool designed to create dynamic and interactive diagrams based on user-provided data. It utilizes SVG (Scalable Vector Graphics) to render high-quality, scalable visualizations that maintain clarity and responsiveness across different screen sizes.

The library supports a variety of diagram types, including:

- Line Diagrams for visualizing trends and data progression over time.
- Circle Diagrams (Pie Charts) for representing proportions or percentage distributions.
- Bar Diagrams (both horizontal and vertical) for comparing categorical data.

With its flexible configuration options, the DiagramFactory library allows developers to customize colors, labels, animations, and interactive elements, making it easy to tailor the diagrams to specific design and functional requirements. This makes it an ideal solution for integrating visually engaging data representations into web applications.

## Installation
Download the DiagramFactory library from the GitHub repository and include it in your lib directory on the client. You need to add the following html element in your html file:
```html
  <svg id="svgDiagram" width="600" height="400"></svg>
```

You can then import the library into your JS file using a relative path:
```javascript
import { DiagramFactory } from './lib/DiagramFactory/DiagramFactory'
```
After the lib is imported you can create a new instance of the DiagramFactory class and pass the configuration object as an argument:The minimum configuration object requires the elementId property, which specifies the ID of the SVG element where the diagram will be rendered. And the data you want to visualize as an array.
```javascript
const diagramFactory = new DiagramFactory({
  elementId: '#svgDiagram',
  data: [
    { label: 'A', value: 10, color: 'blue' },
    { label: 'B', value: 20, color: 'red' },
    { label: 'C', value: 100, color: 'green' },
    { label: 'D', value: 40, color: 'yellow' },
    { label: 'E', value: 120, color: 'purple' },
    { label: 'F', value: 96, color: 'orange' },
    { label: 'G', value: 130, color: 'cyan' }
  ]
})
```
You can then call the create diagram method to render the diagram based on the provided data and configuration:

If you want to create a line diagram you can call the createLineDiagram method:
```javascript
diagramFactory.createLineDiagram()
```
If you want to create a circle diagram you can call the createCircleDiagram method:
```javascript
diagramFactory.createCircleDiagram()
```
If you want to create a bar diagram you can call the createBarDiagram method:
```javascript
diagramFactory.createBarDiagram()
```
## Setting up config
The DiagramFactory library provides a range of configuration options that allow you to customize the appearance and behavior of the diagrams. The following properties can be included in the configuration object when creating a new instance of the DiagramFactory class:

#### Required properties:
- `elementId`: The ID of the SVG element where the diagram will be rendered. Need to be an svg element.
- `data`: An array of objects representing the data to be visualized. Each object should have the following properties:
  - `label`: A string representing the label or category associated with the data point.
  - `value`: A number representing the value or size of the data point.
  - `color`: A string representing the color of the data point. This can be a named color (e.g., 'red', 'blue', 'green').

#### Optional properties:
- `interactivity`: **Currently not working with circleDiagrams.**
  - `expand`: A boolean value that determines whether the diagram elements should expand when hovered over. Default is `false`.
  - `infoBoxWhenHover`: A boolean value that determines whether an info box should be displayed when hovering over a diagram element. Default is `false`.
- `animation`: **As things stand BarDiagram is the only diagram that can be animated.**
  - `speed`: A number representing the animation speed in milliseconds. Default is `100`.
- `decoration`:
  - `showGrid`: A boolean value that determines whether a grid should be displayed in the background of the diagram. Default is `true`.

  Example of a configuration object with optional properties:
```javascript
  const diagramFactory = new DiagramFactory({
    elementId: '#svgDiagram',
    data: [
      { label: 'A', value: 10, color: 'blue' },
      { label: 'B', value: 20, color: 'red' },
      { label: 'C', value: 100, color: 'green' },
      { label: 'D', value: 40, color: 'yellow' },
      { label: 'E', value: 120, color: 'purple' },
      { label: 'F', value: 96, color: 'orange' },
      { label: 'G', value: 130, color: 'cyan' }
    ],
    interactivity: {
      expand: true,
      infoBoxWhenHover: true
    },
    animation: {
      speed: 100
    },
    decoration: {
      showGrid: false
    }
  })
```

## Methods
BarDiagram
```javascript
diagramFactory.createBarDiagram()
```
LineDiagram
```javascript
diagramFactory.createLineDiagram()
```
CircleDiagram
```javascript
diagramFactory.createCircleDiagram()
```

## Code example
Here is an example of how to create a `bar` diagram with interactivity and animation using the DiagramFactory library:

```html
  <svg id="svgDiagram" width="600" height="400"></svg>
```

```javascript
  const diagramFactory = new DiagramFactory({
    elementId: '#svgDiagram',
    data: [
      { label: 'A', value: 10, color: 'blue' },
      { label: 'B', value: 20, color: 'red' },
      { label: 'C', value: 100, color: 'green' },
      { label: 'D', value: 40, color: 'yellow' },
      { label: 'E', value: 120, color: 'purple' },
      { label: 'F', value: 96, color: 'orange' },
      { label: 'G', value: 130, color: 'cyan' }
    ],
    interactivity: {
      expand: true,
      infoBoxWhenHover: true
    },
    animation: {
      speed: 100
    }
  })

  diagramFactory.createBarDiagram()
```

## Dependencies
This module primmarily relies on built-in browser features and the SVG (Scalable Vector Graphics) standard for rendering the diagrams. It does not have any external dependencies or require additional libraries to function.

## Language
The DiagramFactory library is written in `JavaScript` (ES6) and utilizes modern language features such as classes, arrow functions, and template literals. It is designed to be compatible with modern web browsers and can be easily integrated into web applications using ES6 modules.

## Version
The current version of the DiagramFactory library is `1.0.0`. Future updates and enhancements may be released to improve functionality, performance, and compatibility with different browsers and devices. In future versions, additional diagram types and customization options may be added to provide more flexibility and control over the visualizations.

This project uses **Semantic Versioning**. Each version follows the format:

- **MAJOR**: Incompatible API changes.
- **MINOR**: Backward-compatible new functionality.
- **PATCH**: Backward-compatible bug fixes.

For more information about Semantic Versioning, visit [SemVer.org](https://semver.org).


## Bugreports

### Known Issues
| Issue ID | Description | Status | Priority | Remarks |
|----------|-------------|--------|----------|---------|
| BUG001 | The CircleDiagram does not have the ability to expand. | open | minor | Requires update to interaction logic |
| BUG002 | The Labels does not fit good with the circle diagram when the space is to small | open | minor | Suggest resizing or using smaller labels |


We welcome all users to submit issues for bug reports, feature requests, or general feedback. Please visit our [GitHub Issues page](https://github.com/Witten2002/DiagramFactory/issues) to create a new issue or comment on an existing one.

Steps to submit an issue:
1. Go to the [Issues page](https://github.com/Witten2002/DiagramFactory/issues).
2. Click "New Issue."
3. Provide a detailed description, steps to reproduce the issue, and any relevant screenshots or code snippets.

Make sure to check existing issues before submitting a new one!

## Contributing
We welcome contributions! If you'd like to contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch (e.g., `feature/new-feature`).
3. Make your changes and commit them.
4. Submit a pull request to the `main` branch.

Please ensure all changes are tested before submitting.

For more details on the coding standard, you can refer to the official LNU guidelines [here](https://www.npmjs.com/package/@lnu/eslint-config).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments
The DiagramFactory library was developed as part of a project for the course "Web Development" at Linnaeus University. The project aimed to create a reusable library for generating interactive diagrams using SVG and JavaScript. The library was developed by Ludwig Wittenberg and is intended for educational purposes and as a learning resource for web developers.

***After the course is ended the library will no longer be maintained and updated.***

## Testrapport
The DiagramFactory library has been tested using a combination of manual and automated testing methods to ensure that the diagrams are rendered correctly and that the interactivity and animations function as expected. The automated tests are written using the Jest testing framework and cover a range of scenarios to validate the library's behavior under different conditions. The automated test check if the configuration object is valid and if the diagram is rendered correctly. The manual tests involve visual inspection of the diagrams to verify that they match the expected output based on the provided data and configuration.

[Full TestRapport](https://github.com/Witten2002/1dv610-Labboration-2/blob/main/TestRapport.md)
