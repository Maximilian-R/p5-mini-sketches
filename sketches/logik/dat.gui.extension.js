dat.GUI.prototype.hide = function() {
    this.domElement.setAttribute("hidden", true);
};

dat.GUI.prototype.show = function() {
    this.domElement.removeAttribute("hidden");
};

dat.GUI.prototype.toggleHide = function() {
    if(this.domElement.hasAttribute("hidden")) {
        this.domElement.removeAttribute("hidden");
    } else {
        this.domElement.setAttribute("hidden", true);
    }
};
