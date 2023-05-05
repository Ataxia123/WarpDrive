
# WARP 🚀🌌🔍🎨🌠🤖🔄 DRIVE

![](https://i.imgur.com/yK8VEk0.jpg)


## Setup

Quickstart
To get started with ***WarpDrive***, follow the steps below:

Clone this repo & install dependencies

```
git clone https://github.com/Ataxia123/WarpDrive.git
cd WarpDrive
yarn install
```

create a .env.local file and add MIDJOURNEY_API_KEY (Currently using thenextleg.io) and a BASE_URL (for local testing use ngrok temp url)

On a terminal, start your NextJS app:

`yarn start`

Visit your app on: http://localhost:3000.

### These emojis represent the key aspects of the project:

🚀: Space travel and exploration

🌌: The infinite universe setting

🔍: Scanning and analyzing images

🎨: Image generation and modification

🌠: Discovering new celestial objects or backgrounds

🤖: AI-powered text and image processing

🔄: Continuous cycle of scanning, modifying, and generating images


## Project Overview

The index page contains the home compenent which defines the functions that generate and display images based on the user's input. The component maintains several pieces of state, including loading status, error messages, image URLs, user input, and more. It interacts with a backend API to generate images and associated data based on user input, and it updates the user interface to display the results.

Key aspects of the code include:

**State management:** Various useState hooks are used to manage the state of the component, including loading status, error messages, response data, image URLs, user input, and more.

**useEffect hooks:** Several useEffect hooks are used to trigger side effects based on changes in the component's state. For instance, when the selected description index changes, the component updates the selected description. Similarly, when the travel status changes, the component fetches an interplanetary status report and triggers image generation.

**Event handlers:** Functions like handleEngaged and handleScanning are used to manage state changes based on user interaction. These functions are passed as props to child components, which then call them when the user interacts with the app.

**Image generation and fetching:** The submitPrompt function handles the image generation process. It first generates a prompt based on the user's input, then sends the prompt to the backend API via an axios POST request. The component then polls the server to fetch the generated image URL.

**Metadata:** The Metadata type is used to manage metadata related to the generated images, including the source URL, level, powers, alignments, side, interplanetary status report, and selected description.

**Rendering:** The component renders a user interface that displays images and associated data based on the current state. It also includes buttons and other interactive elements that allow users to customize their input and generate new images.

The component utilizes various hooks and functions to generate images and descriptions using an external API. Here is an overview of the main features:

**handleButtonClick:** This function handles button clicks for generating images based on the button and type passed to it. It sends a POST request to /api/postButtonCommand with the button and buttonMessageId as parameters. Then it polls the server to fetch the response from the cache. Based on the type, it sets the state variables accordingly, e.g., updating imageUrl, backgroundImageUrl, and buttonMessageId.

**handleDescribeClick:** This function is executed when a button is clicked to describe the image. It sends a POST request to /api/postDescription with the srcUrl as the parameter. It polls the server to fetch the description from the cache. After receiving the description, it cleans it by removing the first grapheme (emoji) from each string in the description array and sets the cleanedDescription to the state.

**handleMetadataReceived:** This function is called when metadata is received. It extracts the attributes from the metadata and sets the state variables for level, power1, power2, power3, power4, alignment1, alignment2, and side.

**metadata:** This object holds metadata information, including srcUrl, Level, Power1, Power2, Power3, Power4, Alignment1, Alignment2, Side, interplanetaryStatusReport, and selectedDescription.

**handleImageSrcReceived:** This function is called when an image source URL is received. It sets the srcUrl state variable.

**handleModifedPrompt:** This function is called to update the modifiedPrompt state variable.

**handleSelectedTokenIdRecieved:** This function is called when a selected token ID is received. It sets the selectedTokenId state variable.

**handleTokenIdsReceived:** This function is a placeholder for handling token IDs. You can update the state or call another function with the received token IDs.



The home component allows users to generate and display images based on their input, while also providing a detailed interplanetary status report. The component manages state and side effects using React hooks, and it interacts with a backend API to generate images and fetch relevant data


The return component of this React functional component renders the main layout and structure of the application. It includes several child components that handle different aspects of the application. Here's an overview of the components:

**Dashboard:** This is the main container component that holds all other child components. It receives various props, including state variables and callback functions, that are passed down to its children.

**SpaceshipInterface:** This component represents the spaceship's interface in the application. It receives the travelStatus prop to manage its behavior.

**AcquiringTarget:** This component is responsible for handling the target acquisition process. It receives the loading, travelStatus, and selectedTokenId props to manage its behavior.

**TokenSelectionPanel:** This component serves as a panel to display and select tokens. It receives various props, including callback functions to handle scanning, button clicks, metadata received, image source received, and token IDs received. It also receives travelStatus, interplanetaryStatusReport, and submitPrompt to manage its behavior.

**DescriptionPanel:** This component is responsible for displaying and managing the image descriptions. It receives several props, such as scanning, handleScanning, travelStatus, interplanetaryStatusReport, selectedTokenId, and description. It also receives callback functions for handling description index changes and describe button clicks.

**PromptPanel:** This component is responsible for handling and displaying the generated prompts. It receives various props, including state variables and callback functions to manage its behavior, such as warping, handleEngaged, travelStatus, imageUrl, interplanetaryStatusReport, srcUrl, onSubmitPrompt, handleButtonClick, loading, metadata, buttonMessageId, and generatePrompt.

*The main layout consists of a flex container with a series of child components that are organized vertically using the space-y-8 utility class from Tailwind CSS. The components are placed within the Dashboard component, which serves as the main container, and they handle different aspects of the application's functionality.*

There are two auxiliary components in the application: Background and Dashboard. These components contribute to the visual layout and interactive behavior of the application.

**Background:** This component is responsible for rendering and managing the background of the application. It receives several props, such as warping, dynamicImageUrl, fixedImageUrl, travelStatus, and scanning. The component maintains its internal state for background position (bgPosition), warp speed opacity (warpSpeedOpacity), and light speed (lightSpeed).

The handleMouseMove function updates the bgPosition state based on the mouse movement, creating a parallax effect on the background image. The component uses two useEffect hooks, one to add and remove the event listener for mouse movement, and another to update the lightSpeed state based on the warping prop.

The Background component renders a div with the styles.background CSS class, which contains an img element displaying the dynamicImageUrl prop, and a div element for the warp speed effect. The img element's transform property is updated based on the bgPosition state.

**Dashboard:** This component serves as the main container for the application, wrapping various other components like the MarqueePanel, Background, and Header. It receives several props that include state variables, callback functions, and metadata, which are passed down to its child components as needed.

The Dashboard component renders the static image overlay with the staticOverlay CSS class, the MarqueePanel component, the Background component, and the Header component. Additionally, it renders the children prop, which contains other child components from the main application component.

In summary, the Background component manages the background visuals and interactions, while the Dashboard component serves as the main container that wraps various other components in the application. These auxiliary components contribute to the overall structure and user experience of the application.

In summary, the return component provides the structure for the application by organizing child components and passing the necessary props and state variables down to them. Each child component focuses on a specific aspect of the application, such as token selection, description management, or prompt generation.

## Components:

# ReadAIU

The **ReadAIU** component is responsible for handling user interactions with the the blockchain and sending the requests to the AI models. It receives a number of props for handling callbacks, updating the state, and managing component display settings.

The component has several state variables like tokenIds, balance, selectedTokenId, tokenURI, metadata, imageSrc, mouseTrigger, and engaged.

It uses several custom hooks, such as useAccount, useDeployedContractInfo, useProvider, and useScaffoldEventHistory, to interact with the blockchain and fetch data.

There are multiple useEffect hooks in the component to handle different scenarios:

* Fetching token IDs and updating the app state based on the user's balance and owned token IDs.
* Fetching token URI when a token ID is selected.
* Fetching metadata based on the token URI and updating the metadata state.
* Setting the engaged state when the modifiedPrompt prop changes.
* Updating the image source based on the fetched metadata.
* Handling button state changes based on the travelStatus prop.
* The handleTokenIdChange function updates the selectedTokenId state and calls the onSelectedTokenIdRecieved callback.

**The handleButton** function is responsible for handling button clicks in different situations, based on the travelStatus, engaged, and scanning states. It manages the warp status and submits a character or background update when required.

**The AvailableButtons** component renders a set of buttons with different labels and manages their display and click events. It utilizes the handleButtonClick callback to perform actions based on the clicked button.

In summary, the ReadAIU component manages user interactions with the AI interface, fetches token and metadata information from the blockchain, and handles button interactions for different situations. It communicates with other components by passing updated state information through callback functions.

## SwitchBoard

Switchboard component is a React functional component that allows users to generate and modify prompts based on selected attributes. The prompts are then displayed in a hex-encoded format. The component takes several props, such as handleEngaged, travelStatus, attributes, onToggle, generatePrompt, promptData, and others.

Key features of the Switchboard component include:

**Toggling attributes:** Users can toggle individual attributes on and off. The toggled state of each attribute is managed through the checkedAttributes state variable, which is an array containing the currently toggled attributes.


**Generating a modified prompt:** When the user clicks the "Submit" button, the generateModifiedPrompt function is called. This function filters the selected attributes and generates a new prompt using the generatePrompt prop function.

**Displaying the modified prompt:** The modified prompt is displayed in both hex-encoded and plaintext formats. The hex-encoded format is generated using the stringToHex helper function, which converts a string to its hex representation.

**Managing extra text input:** Users can input additional text, which is managed by the extraText state variable. This extra text is included when generating the modified prompt.

**Updating the modified prompt when attributes are toggled:** The handleToggle function is called when a user toggles an attribute. This function updates the checkedAttributes state variable and calls the onToggle prop function with the attribute and its new toggled state.

The Switchboard component's layout consists of a wrapper <div> element containing the following elements:

* A header displaying "AI-UNIVERSE SIGNAL ENCODER"
* A hex-prompt section, which includes an input field for extra text and a display area for the hex-encoded modified prompt
* A plaintext display area for the modified prompt
* A "Submit" button that triggers the generation of the modified prompt
* A switchboard-attribute-container div that lists the available attributes, each wrapped in a switchboard-attribute div element, which can be toggled on and off by the user
    
  ## DescriptionPanel  
    
The DescriptionPanel is a React functional component that provides a user interface for displaying, navigating, and scanning descriptions. The component takes several props, including scanning, handleScanning, travelStatus, interplanetaryStatusReport, description, selectedDescriptionIndex, handleDescribeClick, onDescriptionIndexChange, and selectedTokenId.

Key features of the DescriptionPanel component include:

Managing focused state: The focused state variable is used to keep track of whether the component is focused or not. The handleClick function toggles the focused state when the user clicks on the component.

Managing description index: The descriptionIndex state variable stores the currently displayed description index. The handleButtonClick function is used to increment the description index in a circular manner when the user clicks the button to navigate between descriptions.

Synchronizing description index with parent component: The useEffect hook is used to call the onDescriptionIndexChange prop function when the descriptionIndex state variable changes, ensuring that the parent component is aware of the updated description index.

Handling scan status: The scanStatus state variable keeps track of whether the component is currently scanning or idle. The handleScanClick function sets the scan status to "scanning" and calls the handleScanning and handleDescribeClick prop functions when the user initiates a scan.

Updating the component based on travel status and interplanetary status report: A useEffect hook is used to update the component when the travelStatus and interplanetaryStatusReport prop values change.

The DescriptionPanel component's layout consists of a wrapper <div> element that contains the following elements:

* A button for toggling the focused state of the component
* A button for initiating a scan, which calls the handleScanClick function
* A button for navigating between descriptions, which calls the handleButtonClick function
* A display area for the current description based on the descriptionIndex state variable
    
Overall, the DescriptionPanel component provides a user interface for interacting with descriptions and updating the parent component with any changes made by the user.
    

## Travel Status Management:

The ReadAIU component, travelStatus is used in the handleButton function to determine the appropriate action to take when the button is clicked. Here is the grid indicating the different states and actions for each state:

![](https://i.imgur.com/cH3bvtN.png)

In the ReadAIU component, the handleButton function checks the travelStatus and other states, such as engaged and scanning, to determine the appropriate action to perform. For example, when travelStatus is "AcquiringTarget" and engaged is false, it sets warping to false and engaged to true. When travelStatus is "TargetAcquired" and scanning is true, it sets travelStatus to "TargetAcquired" and warping to true while stopping scanning.

In addition to these actions, the ReadAIU component also uses the travelStatus prop in a useEffect hook to update the button classes, which helps to visually indicate the current status of the application.

the travelStatus state variable is used to control different stages of the interplanetary travel process. The travelStatus can have one of the three values: "NoTarget", "AcquiringTarget", or "TargetAcquired". Here's how travelStatus is used throughout the code:

*  When the submitPrompt function is called with the "background" type, it sets the travelStatus to "TargetAcquired".
*  When the handleButtonClick function is called with the "U1" button and "background" type, it sets the travelStatus to "NoTarget".
*  In the useEffect hook that has travelStatus as a dependency, if the travelStatus is "TargetAcquired", it calls the fetchInterplanetaryStatusReport function, which sends a request to the "/api/generate_report" API route and updates the interplanetaryStatusReport state variable with the response data.
    
Here's a brief description of the travel process based on the code:

1. When the user submits a prompt with the type "background", the travelStatus is set to "TargetAcquired".
2. The app then fetches an interplanetary status report for the acquired target.
3. If the scanning process is complete (scanning state is set to false) and the travelStatus is "TargetAcquired", the app calls the handleButtonClick function with "U1" and "background" parameters.
4. The handleButtonClick function sets the travelStatus to "NoTarget", and the process is complete.
 In summary, the travelStatus state variable is used to control the different stages of the interplanetary travel process, and it helps in coordinating various API calls and state updates required to complete the process.
    
    The switchboard in the provided code generates a modified prompt using the generatePrompt function. This function takes several parameters, including the type of prompt ("character" or "background"), source URL, various attributes (level, powers, alignments), description, flags, side, and interplanetary status report. Based on these inputs, the function constructs a prompt string.

* In the case of a "background" type prompt, the function constructs the prompt by concatenating the provided information along with certain keywords. The nijiFlag and vFlag are conditionally included based on their boolean values. The final prompt is returned as a trimmed string.

* For the "character" type prompt, the modified prompt is set to the modifiedPrompt state variable. When the submitPrompt function is called with the "character" type, it sets the warping state to true and uses the modifiedPrompt as the actual prompt.

The different routes available in the app, following the travelStatus cycle, can be described as follows:

1. "NoTarget" - This is the initial state. The user can submit a new prompt with the type "background" or "character". Submitting a "background" type prompt sets the travelStatus to "TargetAcquired".

2. "TargetAcquired" - In this state, the app fetches the interplanetary status report for the acquired target. If the scanning process is complete (scanning state is set to false), the app calls the handleButtonClick function with "U1" and "background" parameters.

3. "AcquiringTarget" - This state is not explicitly set in the provided code, but it is part of the travelStatus union type. If implemented, this state could be used to handle intermediate steps between "NoTarget" and "TargetAcquired" or to show a loading indicator while acquiring a target.

4. The app returns to the "NoTarget" state once the handleButtonClick function is called, and the travel process is completed. This cycle can be repeated for new prompts or target acquisitions.
    
    
## SCanning pannel lifecycle

The description panel in the provided code allows users to generate scans for an image. The scanning cycle in the app begins with the handleDescribeClick function. When this function is called, it sets the loading state to true, indicating that a scanning process is in progress.

Before making a request, the function checks if the waitingForWebhook state is true. If it is, it logs a message asking the user to wait for the current webhook response before proceeding. If not, it sets waitingForWebhook to true and sends a POST request to the /api/postDescription endpoint with the srcUrl parameter.

Once the response is received, it logs the response and messageId. It then enters a polling loop to fetch the description from the cache. If the description is not available, it waits for 1 second before polling again.

When the description is finally fetched, the first grapheme (emoji) is removed from each string in the description array using the GraphemeSplitter library. The cleaned description array is then set as the description state.

The loading and waitingForWebhook states are set to false once the description fetching process is complete. The user can now interact with the description panel and make further selections.

The scanning cycle is closely tied to the travelStatus cycle, as it influences the app's behavior. For instance, when the scanning state is set to false, the app calls the handleButtonClick function with "U1" and "background" parameters in the useEffect hook that has scanning as a dependency. This initiates the subsequent steps in the travelStatus cycle.
