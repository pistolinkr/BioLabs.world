declare global {
  interface Window {
    NGL: {
      Stage: new (container: HTMLElement) => NGLStage;
    };
  }
}

export interface NGLStage {
  setParameters: (params: any) => void;
  removeAllComponents: () => void;
  loadFile: (file: string | Blob, options?: any) => Promise<NGLComponent>;
  autoView: () => void;
  setSpin: (spin: boolean) => void;
  getSpin: () => boolean;
  handleResize: () => void;
  dispose: () => void;
  signals: {
    clicked: {
      add: (callback: (pickingProxy: any) => void) => void;
    };
  };
  compList: any[];
  mouseControls: {
    add: (type: string, callback: (pickingProxy: any) => void) => void;
    remove: (type: string) => void;
  };
  viewerControls: {
    reset: () => void;
    zoom: (factor: number) => void;
    rotate: (x: number, y: number) => void;
    orient: (x: [number, number, number], y: [number, number, number]) => void;
  };
  animationControls: {
    move: (center: NGLVector3, radius: number, duration: number) => void;
  };
  addComponentFromObject: (component: any) => void;
  removeComponent: (component: any) => void;
}

export interface NGLComponent {
  addRepresentation: (type: string, options?: any) => NGLRepresentation;
  removeRepresentation: (representation: NGLRepresentation) => void;
  removeAllRepresentations: () => void;
  reprList: NGLRepresentation[];
  structure: {
    eachAtom: (callback: (atom: NGLAtom) => void) => void;
  };
  rotation: {
    set: (x: number, y: number, z: number) => void;
  };
}

export interface NGLRepresentation {
  name: string;
  type: string;
  parameters: any;
  setParameters: (params: any) => void;
  setVisibility: (visible: boolean) => void;
  dispose: () => void;
}

export interface NGLAtom {
  resname: string;
  chainname: string;
  resno: number;
  atomname: string;
  x: number;
  y: number;
  z: number;
}

export interface NGLVector3 {
  x: number;
  y: number;
  z: number;
}

export interface NGLDistanceMeasure {
  new (stage: NGLStage, options?: any): NGLMeasureTool;
  add: (atom: NGLAtom) => void;
  setParameters: (params: any) => void;
  dispose: () => void;
}

export interface NGLAngleMeasure {
  new (stage: NGLStage, options?: any): NGLMeasureTool;
  add: (atom: NGLAtom) => void;
  setParameters: (params: any) => void;
  dispose: () => void;
}

export interface NGLDihedralMeasure {
  new (stage: NGLStage, options?: any): NGLMeasureTool;
  add: (atom: NGLAtom) => void;
  setParameters: (params: any) => void;
  dispose: () => void;
}

export interface NGLMeasureTool {
  add: (atom: NGLAtom) => void;
  setParameters: (params: any) => void;
  dispose: () => void;
}

export interface NGLPickingProxy {
  atom?: NGLAtom;
  bond?: any;
  closeAtom?: NGLAtom;
  closeBond?: any;
  instance?: any;
  picker?: any;
  position?: NGLVector3;
  shape?: any;
}

export interface NGLPickingData {
  pickingProxy: NGLPickingProxy;
  mouse: {
    x: number;
    y: number;
  };
}

declare module 'ngl' {
  export interface StageParameters {
    backgroundColor?: string;
    quality?: 'low' | 'medium' | 'high';
  }

  export interface LoadFileOptions {
    ext?: string;
    [key: string]: any;
  }

  export interface RepresentationOptions {
    color?: string;
    opacity?: number;
    side?: 'front' | 'back' | 'double';
    [key: string]: any;
  }

  export class Stage {
    constructor(container: HTMLElement);
    setParameters(params: StageParameters): void;
    setSize(width: number, height: number): void;
    loadFile(path: string | File, options?: LoadFileOptions): Promise<Component>;
    removeAllComponents(): void;
    autoView(): void;
    getImage(): HTMLCanvasElement;
    dispose(): void;
    mouseControls: {
      add(event: string, callback: (event: any) => void): void;
    };
    pick(event: any): any;
  }

  export class Component {
    addRepresentation(type: string, options?: RepresentationOptions): Representation;
    getRepresentations(): Representation[];
    dispose(): void;
  }

  export class Representation {
    setVisibility(visible: boolean): void;
    setColor(color: string): void;
  }
}
