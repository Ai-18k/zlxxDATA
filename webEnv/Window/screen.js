const {
    setPrivateProp,
} = require("../utility.js");
const {Screen,ScreenOrientation} = require("../CommonApi/api");

function createScreen() {
    const screen = new Screen();
    setPrivateProp(screen, 'availHeight', 728);
    setPrivateProp(screen, 'availWidth', 1366);
    setPrivateProp(screen, 'height', 768);
    setPrivateProp(screen, 'width', 1366);
    setPrivateProp(screen, 'availLeft', 0);
    setPrivateProp(screen, 'availTop', 0);
    setPrivateProp(screen, 'isExtended', false);
    setPrivateProp(screen, 'pixelDepth', 24);
    setPrivateProp(screen, 'colorDepth', 24);

    const orientation = new ScreenOrientation();
    setPrivateProp(orientation, 'angle', 0);
    setPrivateProp(orientation, 'type', 'landscape-primary');
    setPrivateProp(screen, 'orientation', orientation);

    return screen;
}

module.exports = createScreen;