
function createPlaceholderDiv() {
    const div = document.createElement("div");
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.backgroundColor = "black";
    div.textContent = "Failed to load image";
    div.style.color = "white";
    return div;
}

function createPlaceholder() {
    const div = createPlaceholderDiv();
    this.replaceWith(div);
}

function getPlaceholder() {
    return createPlaceholderDiv();
}

export {
    createPlaceholder,
    getPlaceholder,
};