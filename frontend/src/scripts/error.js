
function createPlaceholderDiv() {
    const div = document.createElement("div");
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.backgroundColor = "black";
    div.textContent = "Failed to load image";
    div.style.color = "white";
    return div;
}

function createPlaceholder() { //called as a function set to onerror
    const div = createPlaceholderDiv();
    this.replaceWith(div); //this is set to the onerror's element
}

function getPlaceholder() {
    return createPlaceholderDiv();
}

export {
    createPlaceholder,
    getPlaceholder,
};