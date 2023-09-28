import {
    changeTimeStep,
    isObject, orthographicCamera, renderer, setBackgroundWithTheme, setTransformControlsEnabled,
    simulation, transformControls,
} from "./main.js";

const rightUiToggle = document.getElementById("collapse-right-ui-button")
const rightUi = document.getElementById("right-ui")
const canvas = document.getElementById("viewportCanvas")
const settingsUiToggle = document.getElementById("settings-button")
const settingsUi = document.getElementById("settings-box")
const timeScaleSlider = document.getElementById("time-scale-slider");
const timeScaleSliderContainer = document.getElementById("time-scale-container")
const timeScaleValue = document.getElementById("time-scale-slider-value");
const closeSettingsButton = document.getElementById("close-settings-button");
const leftRoundedCorner = document.getElementById("rounded-corner-left");
const rightRoundedCorner = document.getElementById("rounded-corner-right")
const lightThemeRadio = document.getElementById("light-theme-radio");
const darkThemeRadio = document.getElementById("dark-theme-radio");
const midnightThemeRadio = document.getElementById("midnight-theme-radio");
const cameraFovSlider = document.getElementById("camera-fov-slider");
const cameraFovContainer = document.getElementById("camera-fov-container");
const cameraFovValue = document.getElementById("camera-fov-slider-value");
const timelineUi = document.getElementById("timeline-box");
const timelineUiToggle = document.getElementById("timeline-button");
const closeTimelineButton = document.getElementById("close-timeline-button");

rightUiToggle.onclick = () => {
    if (rightUi.classList.contains("collapsed")) {
        rightUi.classList.remove("collapsed")
        rightUiToggle.classList.remove("collapsed")
        rightRoundedCorner.classList.remove("collapsed")
    } else {
        rightUi.classList.add("collapsed")
        rightUiToggle.classList.add("collapsed")
        rightRoundedCorner.classList.add("collapsed")
    }
}

const collapseSettings = () => {
    settingsUi.classList.add("collapsed")
    leftRoundedCorner.classList.remove("extended");
    document.onclick = undefined;
    settingsUi.ontransitionend = undefined;
}

settingsUiToggle.onclick = () => {
    if (!timelineUi.classList.contains("collapsed")) {
        collapseTimeline();
    }
    if (settingsUi.classList.contains("collapsed")) {
        settingsUi.classList.remove("collapsed");
        leftRoundedCorner.classList.add("extended");
    } else {
        collapseSettings();
    }
}

closeSettingsButton.onclick = () => {
    collapseSettings();
}

const collapseTimeline = () => {
    timelineUi.classList.add("collapsed");
    leftRoundedCorner.classList.remove("double-extended");
    document.onclick = undefined;
    timelineUi.ontransitionend = undefined;
}

timelineUiToggle.onclick = () => {
    if (!settingsUi.classList.contains("collapsed")) {
        collapseSettings();
    }
    if (timelineUi.classList.contains("collapsed")) {
        timelineUi.classList.remove("collapsed");
        leftRoundedCorner.classList.add("double-extended");
    } else {
        collapseTimeline();
    }
}

closeTimelineButton.onclick = () => {
    collapseTimeline();
}

const updateTimeScaleSliderValue = (value) => {
    const percentage = ((value - 0.25) / 2.75) * 100

    timeScaleValue.innerText = `${value} x`
    timeScaleValue.style.left = `calc(${percentage}% - ${percentage / 100 * 3.5}em)`
}

timeScaleSlider.addEventListener("input", (event) => {
    updateTimeScaleSliderValue(event.target.value);
    changeTimeStep(event.target.value)
});

timeScaleSliderContainer.onwheel = (event) => {
    if (event.deltaY > 0) {
        timeScaleSlider.value -= 0.25;
        updateTimeScaleSliderValue(timeScaleSlider.value);
    } else if (event.deltaY < 0) {
        timeScaleSlider.value = parseFloat(timeScaleSlider.value) + 0.25;
        updateTimeScaleSliderValue(timeScaleSlider.value);
    }

    changeTimeStep(timeScaleSlider.value);
}

lightThemeRadio.onchange = () => {
    if (document.body.className !== "light-theme") {
        document.body.className = "light-theme";
        setBackgroundWithTheme();
    }
}

darkThemeRadio.onchange = () => {
    if (document.body.className !== "dark-theme") {
        document.body.className = "dark-theme";
        setBackgroundWithTheme();
    }
}

midnightThemeRadio.onchange = () => {
    if (document.body.className !== "midnight-theme") {
        document.body.className = "midnight-theme";
        setBackgroundWithTheme();
    }
}

const updateCameraFovSliderValue = (value) => {
    const percentage = ((value - 20) / 90) * 100

    cameraFovValue.innerText = `${value}`
    cameraFovValue.style.left = `calc(${percentage}% - ${percentage / 100 * 3.5}em)`
}

cameraFovSlider.addEventListener("input", (event) => {
    updateCameraFovSliderValue(event.target.value)
});

cameraFovContainer.onwheel = (event) => {
    if (event.deltaY > 0) {
        cameraFovSlider.value -= 1;
        updateCameraFovSliderValue(cameraFovSlider.value);
    } else if (event.deltaY < 0) {
        cameraFovSlider.value = parseInt(cameraFovSlider.value) + 1;
        updateCameraFovSliderValue(cameraFovSlider.value);
    }
}

document.getElementById("top-play").onclick = (event) => {
    if (simulation.isPaused) {
        // Save object position and rotation
        for (const object of simulation.objects) {
            const savedObject = {
                id: object.mesh.id,
                position: {x: null, y: null, z: null},
                quaternion: {x: null, y: null, z: null},
                velocity: {x: null, y: null, z: null},
                angularVelocity: {x: null, y: null, z: null}
            };

            savedObject.position.x = object.mesh.position.x;
            savedObject.position.y = object.mesh.position.y;
            savedObject.position.z = object.mesh.position.z;
            savedObject.quaternion.x = object.mesh.quaternion.x;
            savedObject.quaternion.y = object.mesh.quaternion.y;
            savedObject.quaternion.z = object.mesh.quaternion.z;

            savedObject.velocity.x = object.body.velocity.x;
            savedObject.velocity.y = object.body.velocity.y;
            savedObject.velocity.z = object.body.velocity.z;
            savedObject.angularVelocity.x = object.body.angularVelocity.x;
            savedObject.angularVelocity.y = object.body.angularVelocity.y;
            savedObject.angularVelocity.z = object.body.angularVelocity.z;

            simulation.savedState.push(savedObject);
        }

        // Resume simulation
        event.target.innerText = "pause";
        simulation.isPaused = false;

        // Disable inputs if object selected
        if (simulation.selectedObject) {
            simulation.setPropertiesDisabled(true);
        }

        // Disable buttons
        document.getElementById("add-cube-button").disabled = true;
        document.getElementById("add-sphere-button").disabled = true;
        document.getElementById("translate-button").disabled = true;
        document.getElementById("scale-button").disabled = true;
        document.getElementById("rotate-button").disabled = true;

        if (simulation.selectedModeElement) {
            transformControls.detach();
            setTransformControlsEnabled(false);
            simulation.selectedModeElement.classList.remove("Button-Selected");
            simulation.selectedModeElement = null;
        }
    } else {
        // Pause simulation
        event.target.innerText = "play_arrow";
        simulation.isPaused = true;
    }
}

document.getElementById("top-replay").onclick = (event) => {
    // Pause simulation
    document.getElementById("top-play").innerText = "play_arrow";
    simulation.isPaused = true;

    // Rewind simulation to previous state
    simulation.rewindState();
}

document.getElementById("item-color-picker").onclick = (event) => {
    simulation.selectedObject.mesh.material.color.set(`${event.target.value}`);
}

window.onresize = () => {
    const emSize = parseInt(getComputedStyle(canvas).fontSize);

    renderer.setSize(window.innerWidth - 3 * emSize, window.innerHeight - 3 * emSize);

    const aspectRatio = parseInt(window.innerWidth - 3 * emSize) / parseInt(window.innerHeight - 3 * emSize);

    orthographicCamera.left = 40 * aspectRatio / -2;
    orthographicCamera.right = 40 * aspectRatio / 2;
    orthographicCamera.top = 40 / 2;
    orthographicCamera.bottom = 40 / -2;

    orthographicCamera.updateProjectionMatrix();
}