/* All handling of mosue and keys should be handled in inputHandler */

class Editor {
  constructor() {
    this.connection;
    this.inventoryItem;
  }

  keyPressed() {
    // if (keyCode == 192) {
    //   /* Cancel palcement of connection or delete something */
    //   if(this.clickedNode != null && this.clickedNode.canManualRemove()) {
    //     this.clickedNode.remove();
    //     this.clickedNode = null;
    //   }
    // }
  }


  /* Open & Close GUI of logics */
  mouseClicked(nodesClicked) {

    /* Close open GUI */
    if (this.nodeWithOpenGUI != null) {
      this.nodeWithOpenGUI.gui.hide();
      this.nodeWithOpenGUI = null;
    }

    /* Open GUI for clicked logic */
    for (var i = 0; i < nodesClicked.length; i++) {
      if (nodesClicked[i] instanceof Logic) {
        nodesClicked[i].gui.show();
        this.nodeWithOpenGUI = nodesClicked[i];
        break;
      }
    }
  }

  /* Create and Move connection */
  mousePressed(nodesAtMouse) {

    for (var i = 0; i < nodesAtMouse.length; i++) {
      var node = nodesAtMouse[i];

      /* Create new connection */
      if (node instanceof OutputSocket) {
        this.connection = new Connection(node);
      }

      /* Remove existing connection, create a new */
      if (node instanceof InputSocket && node.hasConnection()) {
        /* Disconnect from InputSocket */
        this.connection = node.connections.pop();
        this.connection.output = null;
      }

      /* Select InventoryItem */
      if (node instanceof InventoryItem) {
        this.inventoryItem = node;
      }
    }
  }

  /* Create or drop connection */
  mouseReleased(nodesAtMouse) {
    for (var i = 0; i < nodesAtMouse.length; i++) {
      var nodeAtMouse = nodesAtMouse[i];

      /* Complete or Delete Connection */
      if(this.connection != null) {
        if(nodeAtMouse instanceof InputSocket) {
          this.connection.setOutput(nodeAtMouse);
          this.connection = null;
        } else {
          this.connection.remove();
          this.connection = null;
        }
      }

      /* Create InventoryItem item */
      if (this.inventoryItem != null & nodeAtMouse instanceof InventoryItem) {
        this.inventoryItem.createItem();
      }
    }
  }

  mouseDragged() {
    if(this.connection == null) { return; }
    this.connection.pos = createVector(mouseX, mouseY);
  }

  mouseMoved() {}

}
