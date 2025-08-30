import { Property } from 'scenerystack';
import BeadOnHoopConstants from '../../common/BeadOnHoopConstants.js';
import { simData } from '../../common/simData.js';
import { getGraphData } from '../../common/rk4functions.js'
import makeid from "../../common/randomStringGenerator.js"
import post from '../../common/postData.js';

export class SimModel {
  paramList: { [id: string]: any };
  // public angle: Property<number>;
  public radiusProp: Property<number>;
  public gravityProp: Property<number>;
  public frictionProp: Property<number>;
  public omegaProp: Property<number>;
  public omegaRadsProp: Property<number>;
  public thetaProp: Property<number>;
  public velocityProp: Property<number>;
  public simSpeedProp: Property<number>;
  public graphData: simData;
  public graphDataTest: simData;
  public ballsCords: number[];
  public prevCords: number[][];
  public project: boolean;
  public paused: boolean;
  public trailLen: number;
  public timer: number;
  public rotation: number;
  public graphLen: number;
  public originalLen: number;
  public graphUpdateInterval: number;
  public id: string;

  public angle: number;
  public velocity: number;
  public angleTest: number;
  public velocityTest: number;

  public omega: number; // making this because due to pregenerating data the changes wont show up until datachunk is exhausted and new data generated, will have to rework for it to work like that
  public radius: number;
  public gravity: number;
  public friction: number;

  public thetaEQ: string;
  public velocityEQ: string;
  public thetaFunc;
  public velocityFunc;
  // public 
  // public graphLen: Property<number>;
  public updateGraphs: boolean;
  public refBall: any;
  // public velocity: Number;
  public validEqs: boolean;
  public name: string | undefined | null;

  public storeVel: number;
  private updateOmega = false




  public constructor() {
    if (new URL(window.location.href).searchParams.get("name")) {
      this.name = new URL(window.location.href).searchParams.get("name");
    } else {
      this.name = ''
    }


    //check if have cookie
    
    if (document.cookie) {
      console.log()
    } else {
      document.cookie = `name=${this.name ? this.name : "unknown"}` + ` id=${makeid(20)}`
    }

    // this.paused = false
    this.validEqs = true;
    //TODO
    this.paramList = {};
    for (const obj of BeadOnHoopConstants.BEAD_CONFIG) {

      this.paramList[obj.id] = obj;
      // this.paramList[obj.id].prop = new Property(Number(obj.val));
    }
    // this.angle = new Property(Number(this.paramList["theta"].val))
    this.radiusProp = new Property(Number(this.paramList["radius"].val))
    this.gravityProp = new Property(Number(this.paramList["gravity"].val))
    this.frictionProp = new Property(Number(this.paramList["friction"].val))
    this.omegaProp = new Property(Number(this.paramList["omega"].val))
    this.omegaRadsProp = new Property(Number(this.paramList["omegaRads"].val))
    this.thetaProp = new Property(Number(this.paramList["theta"].val))
    this.velocityProp = new Property(Number(this.paramList["velocity"].val))
    this.simSpeedProp = new Property(Number(this.paramList["simSpeed"].val))

    // this.graphLen = new Property(Number(this.paramList["graphlen"].val))

    // this.omegaProp.link(((val) => {
    //   if (!this.updateOmega) {
    //     this.updateOmega = true;
    //     this.omegaRadsProp.value = val * Math.PI / 180
    //     this.updateOmega = false;
    //   }
    // }))
    this.omegaRadsProp.link(((val) => {
      if (!this.updateOmega) {
        this.updateOmega = true;
        this.omegaProp.value = val / Math.PI * 180
        this.updateOmega = false;
      }
      // this.omegaProp.value = val / Math.PI * 180
    }))
    this.graphUpdateInterval = .001;

    this.angle = this.thetaProp.value;
    this.storeVel = this.velocity = this.velocityProp.value;
    this.velocityProp.lazyLink(e => { this.storeVel = e })
    this.angleTest = this.thetaProp.value;
    this.velocityTest = this.velocityProp.value;

    this.omega = this.omegaProp.value;
    this.radius = this.radiusProp.value;
    this.gravity = this.gravityProp.value;
    this.friction = this.frictionProp.value;
    this.graphData = new simData(this.graphUpdateInterval)
    this.graphDataTest = new simData(this.graphUpdateInterval)
    this.ballsCords = [];
    this.prevCords = [];
    this.trailLen = 20;
    this.graphLen = 5;
    this.timer = 0;
    this.project = false;
    this.radiusProp.value = 0.5
    this.gravityProp.value = 10
    for (let i = 0; i < this.trailLen; i++) {
      this.ballsCords.push(0)
      this.prevCords.push([0])
    }

    this.rotation = 0;
    this.originalLen = this.graphLen;

    if (new URL(window.location.href).searchParams.get("formula") === 'true') {

      this.thetaEQ = '\\frac{v}{r}'
      this.velocityEQ = 'r\\cdot\\sin\\left(\\theta\\right)\\left(\\omega^2\\cdot\\cos\\left(\\theta\\right)-\\frac{g}{r}\\right)-k\\cdot v'
      // @ts-ignore
      // this.thetaFunc = globalThis.window.evaluatex(this.thetaEQ, { k: this.friction, r: this.radius, g: this.gravity, o: this.omega * Math.PI / 180, p: Math.PI, e: Math.E }, { latex: true });
      this.thetaFunc = globalThis.window.evaluatex(this.thetaEQ, { k: this.friction, r: this.radius, g: this.gravity, VariableForOmega: this.omega * Math.PI / 180, p: Math.PI, e: Math.E }, { latex: true });
      // @ts-ignore
      // this.velocityFunc = globalThis.window.evaluatex(this.velocityEQ, { k: this.friction, r: this.radius, g: this.gravity, o: this.omega * Math.PI / 180, p: Math.PI, e: Math.E }, { latex: true });
      this.velocityFunc = globalThis.window.evaluatex(this.velocityEQ, { k: this.friction, r: this.radius, g: this.gravity, VariableForOmega: this.omega * Math.PI / 180, p: Math.PI, e: Math.E }, { latex: true });
      
      this.graphDataTest = getGraphData(this.graphUpdateInterval, this.velocityTest, this.angleTest * Math.PI / 180, this.omega, this.radius, this.gravity, this.friction, { thetadot: this.thetaFunc, velocitydot: this.velocityFunc }, true, this.graphLen, this.graphDataTest, this.timer, this.project);
      

    } else {
      this.velocityEQ = ''
      this.thetaEQ = ''
      this.graphDataTest = new simData(this.graphUpdateInterval)
      this.graphDataTest.insert(0, 0, 0)

    }

    this.graphData = getGraphData(this.graphUpdateInterval, this.velocity, this.angle * Math.PI / 180, this.omega, this.radius, this.gravity, this.friction, {}, false, this.graphLen, this.graphData, this.timer, this.project);
    this.updateGraphs = false;
    this.refBall = { time: 0, velocity: 0, theta: 0 }
  }


  public reset(value_changed = ""): void {
    this.angle = this.thetaProp.value;
    this.storeVel = this.velocity = this.velocityProp.value;
    this.angleTest = this.thetaProp.value;
    this.velocityTest = this.velocityProp.value;
    this.omega = this.omegaProp.value;
    this.radius = this.radiusProp.value;
    this.gravity = this.gravityProp.value;
    this.friction = this.frictionProp.value;
    this.graphData = new simData(this.graphUpdateInterval)
    this.graphDataTest = new simData(this.graphUpdateInterval)
    this.ballsCords = [];
    this.prevCords = [];
    this.trailLen = 20;
    this.graphLen = 5;
    this.timer = 0;
    this.project = false;
    if (value_changed !== "") {
      setTimeout(() => post(this.name, value_changed, this.radiusProp.value, this.gravityProp.value, this.frictionProp.value, this.omegaProp.value, this.thetaProp.value, this.storeVel, this.velocityEQ, this.thetaEQ, this.id), 10)


    }

    for (let i = 0; i < this.trailLen; i++) {
      this.ballsCords.push(0)
      this.prevCords.push([0])
    }
    // this.thetaEQ = '\\frac{v}{r}'
    // this.velocityEQ = 'r\\sin\\left(\\theta\\right)\\left(\\omega^2\\cos\\left(\\theta\\right)-\\frac{g}{r}\\right)-k\\cdot v'
    
    // this.thetaFunc = globalThis.window.evaluatex(this.thetaEQ, {k:this.friction,r:this.radius,g:this.gravity,o:this.omega*Math.PI/180}, {latex:true});
    // this.velocityFunc = globalThis.window.evaluatex(this.velocityEQ, {k:this.friction,r:this.radius,g:this.gravity,o:this.omega*Math.PI/180}, {latex:true});
    // this.graphData = getGraphData(this.graphUpdateInterval, this.velocity, this.angle*Math.PI/180, this.omega, this.radius, this.gravity, this.friction, {}, false, this.graphLen, this.graphData, this.timer, this.project);
    this.graphData = getGraphData(this.graphUpdateInterval, this.velocity, this.angle * Math.PI / 180, this.omega, this.radius, this.gravity, this.friction, {}, false, this.graphLen, this.graphData, this.timer, this.project);
    this.rotation = 0;
    this.originalLen = this.graphLen;
    this.updateGraphs = true;
    this.refBall = { time: 0, velocity: 0, theta: 0 }
    if (this.validEqs) {
      if (this.thetaEQ === '' || this.velocityEQ === '') {
        this.graphDataTest = new simData(this.graphUpdateInterval)
        this.graphDataTest.insert(0, 0, 0)
      } else {
        // @ts-ignore
        // this.thetaFunc = globalThis.window.evaluatex(this.thetaEQ, { k: this.friction, r: this.radius, g: this.gravity, o: this.omega * Math.PI / 180, p: Math.PI, e: Math.E }, { latex: true });
        this.thetaFunc = globalThis.window.evaluatex(this.thetaEQ, { k: this.friction, r: this.radius, g: this.gravity, VariableForOmega: this.omega * Math.PI / 180, p: Math.PI, e: Math.E }, { latex: true });
        // @ts-ignore
        this.velocityFunc = globalThis.window.evaluatex(this.velocityEQ, { k: this.friction, r: this.radius, g: this.gravity, VariableForOmega: this.omega * Math.PI / 180, p: Math.PI, e: Math.E }, { latex: true });
        
        this.graphDataTest = getGraphData(this.graphUpdateInterval, this.velocityTest, this.angleTest * Math.PI / 180, this.omega, this.radius, this.gravity, this.friction, { thetadot: this.thetaFunc, velocitydot: this.velocityFunc }, true, this.graphLen, this.graphDataTest, this.timer, this.project);
      }
    } else {

      this.graphDataTest = new simData(this.graphUpdateInterval)
      this.graphDataTest.insert(0, 0, 0)
    }

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public step(dt: number): void {
    if (!this.paused) {

      this.timer += 0.01 * this.simSpeedProp.value;

      this.angle = this.graphData.getTheta(this.timer);
      if (this.project) {
        this.angle = this.angle % (2 * Math.PI);
        if (this.angle < 0) {
          this.angle = 2 * Math.PI - Math.abs(this.angle)
        }
      }
      this.angleTest = this.graphDataTest.getTheta(this.timer);
      if (this.project) {
        this.angleTest = this.angleTest % (2 * Math.PI);
        if (this.angleTest < 0) {
          this.angleTest = 2 * Math.PI - Math.abs(this.angleTest)
        }
      }

      this.velocity = this.graphData.getVelocity(this.timer);
      this.velocityTest = this.graphDataTest.getVelocity(this.timer);

      this.rotation += this.omega * dt * this.simSpeedProp.value * 0.0174533;
      if (this.timer < this.graphLen) {
        
        // updateBallGraph(timer, ballAngle, ballVelocity, graphLen, thetaGraph, velocityGraph, graphData);
      } else {
        this.graphLen = this.graphLen + this.originalLen;

        getGraphData(this.graphUpdateInterval, this.velocity, this.angle, this.omega, this.radius, this.gravity, this.friction, {}, false, this.graphLen, this.graphData, this.timer, this.project);
        getGraphData(this.graphUpdateInterval, this.velocityTest, this.angleTest, this.omega, this.radius, this.gravity, this.friction, { thetadot: this.thetaFunc, velocitydot: this.velocityFunc }, true, this.graphLen, this.graphDataTest, this.timer, this.project);
        this.refBall = { time: this.timer, velocity: this.velocity, theta: this.angle }
        this.updateGraphs = true;
      }


    }
  }
}
