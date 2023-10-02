import {simulation, transformControls} from "../main.js";

const settingsUi = document.getElementById("settings-box");

const highlightButton = (event) => {
    if (simulation.selectedModeElement) {
        // Deselect previous button
        simulation.selectedModeElement.classList.remove("Button-Selected");

        if (simulation.selectedModeElement !== event.target) {
            // If not the same button then select new button
            event.target.classList.add("Button-Selected");
            simulation.selectedModeElement = event.target;

            transformControls.mode = event.target.id.split("-")[0];
        } else {
            // If it's the same button then just detach transform controls
            transformControls.detach();
            simulation.selectedModeElement = null;
        }
    } else {
        // No button is selected, select this button
        event.target.classList.add("Button-Selected");
        simulation.selectedModeElement = event.target;

        transformControls.mode = event.target.id.split("-")[0];
    }
}

const collapseSettings = () => {
    settingsUi.classList.add("collapsed")
    leftRoundedCorner.classList.remove("extended");
    document.onclick = undefined;
    settingsUi.ontransitionend = undefined;
}

document.getElementById("settings-button").onclick = () => {
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

const timelineUi = document.getElementById("timeline-box");
const leftRoundedCorner = document.getElementById("rounded-corner-left");

const collapseTimeline = () => {
    timelineUi.classList.add("collapsed");
    leftRoundedCorner.classList.remove("double-extended");
    document.onclick = undefined;
    timelineUi.ontransitionend = undefined;
}

document.getElementById("timeline-button").onclick = () => {
    if (!document.getElementById("settings-button").classList.contains("collapsed")) {
        collapseSettings();
    }
    if (timelineUi.classList.contains("collapsed")) {
        timelineUi.classList.remove("collapsed");
        leftRoundedCorner.classList.add("double-extended");
    } else {
        collapseTimeline();
    }
}

/* Selection modes buttons */
document.getElementById("translate-button").onclick = (event) => {
    highlightButton(event)
}

document.getElementById("scale-button").onclick = (event) => {
    highlightButton(event);
}

document.getElementById("rotate-button").onclick = (event) => {
    highlightButton(event);
}

/* Create object buttons */
document.getElementById("add-cube-button").onclick = simulation.createBox.bind(simulation);
document.getElementById("add-sphere-button").onclick = simulation.createSphere.bind(simulation);


export {collapseSettings, collapseTimeline};