class Graph { // Rail system/Map
  constructor() {
    this.vertices = []; // of Vertex
  }
}

class Vertex { // Station
  constructor() {
    this.edges = []; // of Edge
  }
}

class Edge { // Track
  constructor() {
    this.vertexA;
    this.vertexB;
    this.weigth;
  }
}
