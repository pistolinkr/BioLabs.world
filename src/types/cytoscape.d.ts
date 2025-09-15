declare module 'cytoscape' {
  interface CytoscapeOptions {
    container: HTMLElement;
    elements?: any;
    style?: any;
    layout?: any;
    [key: string]: any;
  }

  interface CytoscapeInstance {
    on(event: string, selector: string, handler: (evt: any) => void): void;
    on(event: string, handler: (evt: any) => void): void;
    off(event: string, selector: string, handler: (evt: any) => void): void;
    off(event: string, handler: (evt: any) => void): void;
    add(elements: any): any;
    remove(elements: any): void;
    elements(): any;
    nodes(): any;
    edges(): any;
    layout(options: any): any;
    fit(): void;
    center(): void;
    destroy(): void;
    zoom(options: any): void;
    width(): number;
    height(): number;
    [key: string]: any;
  }

  interface CytoscapeStatic {
    (options: CytoscapeOptions): CytoscapeInstance;
    use(plugin: any): void;
  }

  const cytoscape: CytoscapeStatic;
  export = cytoscape;
}

declare module 'cytoscape-cose-bilkent' {
  const coseBilkent: any;
  export = coseBilkent;
}
