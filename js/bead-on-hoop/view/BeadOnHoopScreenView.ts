// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Kaden Hart
 * @author Sadra Jafari Ghalehkohneh
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import beadOnHoop from '../../beadOnHoop.js';
// import BeadOnHoopModel from '../model/BeadOnHoopModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';

import Color from '../../../../scenery/js/util/Color.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Range from '../../../../dot/js/Range.js';

// import { BoxGeometry, Group, Event, Object3D } from '../../../../chipper/node_modules/@types/three/index.js';


import ThreeIsometricNode from '../../../../mobius/js/ThreeIsometricNode.ts';
// import ThreeUtils from '../../../../mobius/js/ThreeUtils.ts';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
// // import { animatedPanZoomSingleton } from '../../../../scenery/js/imports.js';
// // import NodeTexture from '../../../../mobius/js/NodeTexture.js';

// // import TextureQuad from '../../../../mobius/js/TextureQuad.js';
// import Bounds2 from '../../../../dot/js/Bounds2.js';
import Text from '../../../../scenery/js/nodes/Text.ts';
import RoundToggleButton from '../../../../sun/js/buttons/RoundToggleButton.js';
import { drawTheta, drawVelocity } from '../../common/makeGraphs.js';
import { verifyEq } from '../../common/verifyEq.js';
import EquationInput from './EquationInput.js';
import Panel from '../../../../sun/js/Panel.js';
import RectangularToggleButton from '../../../../sun/js/buttons/RectangularToggleButton.js';
import post from "../../common/postData.js"

type SelfOptions = {
  //TODO add options that are specific to BeadOnHoopScreenView here
};

type BeadOnHoopScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class BeadOnHoopScreenView extends ScreenView {

  // public readonly sceneNoder!: Thre;
  public readonly sceneNode!: any | ThreeIsometricNode;
  public readonly sceneNodeTest!: any | ThreeIsometricNode;
  private readonly cubeMesh!: THREE.Mesh;
  private readonly cubeMeshTest!: THREE.Mesh;
  private readonly hoop!: THREE.Mesh;
  private readonly hoopTest!: THREE.Mesh;
  private readonly ball!: THREE.Mesh;
  private readonly ballTest!: THREE.Mesh;
  private omega: Property<number>;
  private model: BeadOnHoopModel;
  private refThetaGraph!: any;
  private testThetaGraph!: any;
  private refVelocityGraph!: any;
  private testVelocityGraph!: any;
  private buttonAddThetaDOM!: any;
  private buttonAddOmegaDOM!: any;
  private thetaFieldDOM!: any;
  private velocityFieldDOM!: any;
  private focusedEq!: any;
  private rootNode!: any;
  private thetaBox: any;
  private velBox: any;
  private balls: any;
  private prevCords: any;
  private ballsCords: any;
  private ballsTest: any;
  private prevCordsTest: any;
  private ballsCordsTest: any;
  private trailLen: number;
  private project: boolean;
  private projectTemp: boolean;
  private graphSize: number;
  private box: BoxGeometry;
  // private focusedSlider: number;
  private changing: any;
  testGroup: Group;
  testGroupTotal: Group;
  new_div: Group;
  referenceGroup: any;
  helperNode: any;
  beadOnCharts: boolean;
  showBead: boolean;
  domNode: any;
  x: number;
  y: number
  public constructor(model: BeadOnHoopModel, providedOptions: BeadOnHoopScreenViewOptions) {

    const options = optionize<BeadOnHoopScreenViewOptions, SelfOptions, ScreenViewOptions>()({

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions);

    super(options);


    // Create a full-screen node
    // this.layoutBounds.maxX = window.innerWidth;
    // this.layoutBounds.maxY = window.innerHeight;
    window.addEventListener('resize', () => {
      this.x = window.innerWidth
      this.y = window.innerHeight
      // this.layoutBounds.maxX = window.innerWidth;
      // this.layoutBounds.maxY = window.innerHeight;
      // console.log(this.layoutBounds.maxX)
    })
    const handleWheel = function (e: { ctrlKey: any; metaKey: any; preventDefault: () => void; }) {
      if (e.ctrlKey || e.metaKey)
        e.preventDefault();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    // let fontSize = window.innerWidth / 220 + window.innerHeight / 150 + 5;
    let fontSize = 18.5
    let currentWidth = window.innerWidth;
    let currentheight = window.innerHeight;
    let speedRatio = model.simSpeedProp.value;
    this.beadOnCharts = model.velocityEQ && model.thetaEQ ? true : false

    post(model.name, "start", model.radius, model.gravity, model.friction, model.omega, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id)


    const resetAllButton = new ResetAllButton({
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress


        post(this.model.name, "reset", this.model.radius, this.model.gravity, this.model.friction, this.model.omega, this.model.thetaProp.value, this.model.velocityProp.value, this.model.velocityEQ, this.model.thetaEQ, this.model.id)


        model.reset();
        this.reset();
        update = true;
        if (model.thetaEQ != "" && model.velocityEQ != "" && (thetaPrevious != model.thetaEQ || velocityPrevious != model.velocityEQ)) {
          this.showBead = true;
          this.beadOnCharts = model.velocityEQ && model.thetaEQ ? true : false

          thetaPrevious = model.thetaEQ;
          velocityPrevious = model.velocityEQ;

        }
        if (model.thetaEQ.length == 0 || model.velocityEQ.length === 0 || model.velocityEQ === "" || model.thetaEQ === "") {
          this.showBead = false;
          this.beadOnCharts = false;

        }


      },

      tandem: options.tandem.createTandem('resetAllButton'),

    });
    let update = true;
    const reset = (value_changed = "") => {


      model.reset(value_changed !== "" ? value_changed : "")
      this.reset()
      update = true;

      if (model.thetaEQ != "" && model.velocityEQ != "" && (thetaPrevious != model.thetaEQ || velocityPrevious != model.velocityEQ)) {
        this.showBead = true;
        this.beadOnCharts = model.velocityEQ && model.thetaEQ ? true : false

        thetaPrevious = model.thetaEQ;
        velocityPrevious = model.velocityEQ;

      }
      if (model.thetaEQ.length == 0 || model.velocityEQ.length === 0 || model.velocityEQ === "" || model.thetaEQ === "") {
        this.showBead = false;
        this.beadOnCharts = false;

      }
      // pause.set(false);
      // resume.set(false)


    }

    const pause = new Property<boolean>(false);
    const resume = new Property<boolean>(false);
    const resetInitials = new Property<boolean>(false);

    this.showBead = model.velocityEQ && model.thetaEQ ? true : false;

    var toggleRadius = 11;
    let spacePressed = false;
    const pauseButton = new RectangularToggleButton(pause, false, true, { minWidth: 140, maxHeight: 20, content: new RichText('▐▐'), baseColor: "#f44949" })
    const ResumeButton = new RectangularToggleButton(resume, false, true, { minWidth: 140, maxHeight: 20, content: new RichText('▶'), baseColor: "#41b3d5" })
    this.addChild(pauseButton)
    this.addChild(ResumeButton)



    ResumeButton.visible = false




    resetInitials.lazyLink(e => {
      this.model.radiusProp.value = 0.5;
      this.model.gravityProp.value = 10;
      this.model.frictionProp.value = 5;
      this.model.omegaRadsProp.value = 17.45;
      this.model.omegaProp.value = 1000;
      this.model.thetaProp.value = 5;
      this.model.velocityProp.value = 0.6;
      reset("reset to initials")
    })
    const resteInitials = new RichText("Reset to initials")
    const resetInitialsButton = new RectangularToggleButton(resetInitials, false, true, { minWidth: 140, maxHeight: 25, content: resteInitials, baseColor: "#41b3d5" })
    this.addChild(resetInitialsButton)


    pause.lazyLink(e => {
      this.model.paused = !this.model.paused
      post(model.name, this.model.paused ? "paused" : "resume", model.radius, model.gravity, model.friction, model.omega, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id)

      pauseButton.visible = !pauseButton.visible
      ResumeButton.visible = !ResumeButton.visible
    })
    resume.lazyLink(e => {
      this.model.paused = !this.model.paused
      post(model.name, this.model.paused ? "paused" : "resume", model.radius, model.gravity, model.friction, model.omega, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id)


      pauseButton.visible = !pauseButton.visible
      ResumeButton.visible = !ResumeButton.visible
    })

    window.addEventListener('keypress', (event) => {
      if (event.key == " ") {
        spacePressed = !spacePressed
        this.model.paused = !this.model.paused
        post(model.name, this.model.paused ? "paused" : "resume", model.radius, model.gravity, model.friction, model.omega, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id)
        pauseButton.visible = !pauseButton.visible
        ResumeButton.visible = !ResumeButton.visible

      }

    })





    // graphsize may be deleted
    // this.graphSize = window.innerWidth / 4;
    this.graphSize = this.layoutBounds.maxX / 3.8
    this.model = model;
    this.omega = model.omegaProp
    this.rotation = 0;


    const refThetaGraph = document.createElement('div');
    document.body.appendChild(refThetaGraph);
    const testThetaGraph = document.createElement('div');
    document.body.appendChild(testThetaGraph);
    let refVelocityGraph = document.createElement('div');
    document.body.appendChild(refVelocityGraph);
    const testVelocityGraph = document.createElement('div');
    document.body.appendChild(testVelocityGraph);

    this.rootNode = new phet.scenery.Node();

    const plotDis = new phet.scenery.Display(this.rootNode);


    plotDis.updateOnRequestAnimationFrame();
    plotDis.resizeOnWindowResize()


    const rootNode = new phet.scenery.Node();
    const display = new phet.scenery.Display(rootNode);

    document.body.appendChild(display.domElement);
    display.updateOnRequestAnimationFrame();
    display.resizeOnWindowResize();


    const splitLine = document.createElement("div");


    // window.addEventListener("resize", () => {

    //   splitLine.style.width = this.testVelocityGraph.leftBottom.x;
    // })


    // document.body.appendChild(splitLine);


    refVelocityGraph.id = 'staticSim-velocity';
    this.refVelocityGraph = drawVelocity(model.graphData, model.graphLen, 'staticSim-velocity', 'reference', this.graphSize);
    // refVelocityGraph = drawVelocity(model.graphData, model.graphLen, 'staticSim-velocity', 'reference', this.graphSize);
    this.refVelocityGraph.style.transformOrigin = 'left top 0px';
    console.log(this.refVelocityGraph.style)
    // this.refVelocityGraph = refVelocityGraph
    this.refVelocityGraph = new phet.scenery.DOM(this.refVelocityGraph);
    // this.refVelocityGraph = new phet.scenery.DOM(refVelocityGraph);
    // this.graphSize = this.layoutBounds.maxX / 4

    // this.rootNode.addChild(this.refVelocityGraph);
    this.addChild(this.refVelocityGraph);
    this.refVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight / 2.2 - 20);

    // window.addEventListener('resize', () => {
    //   this.refVelocityGraph.centerBottom = new phet.dot.Vector2(this.domNode.rightTop.x, 0);

    // })


    this.refVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight / 2.2 - 20);



    testVelocityGraph.id = 'variableSim-velocity';
    this.testVelocityGraph = drawVelocity(model.graphDataTest, model.graphLen, 'variableSim-velocity', 'test', this.graphSize, this.beadOnCharts);
    this.testVelocityGraph = new phet.scenery.DOM(this.testVelocityGraph);

    // this.rootNode.addChild(this.testVelocityGraph);
    this.addChild(this.testVelocityGraph);
    // rootNode.addChild(this.testVelocityGraph)
    this.testVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight * 1.8 / 2.2 - 20);



    refThetaGraph.id = 'staticSim-theta';
    this.refThetaGraph = drawTheta(model.graphData, model.graphLen, 'staticSim-theta', 'reference', this.graphSize);
    this.refThetaGraph = new phet.scenery.DOM(this.refThetaGraph);

    // this.rootNode.addChild(this.refThetaGraph);
    this.addChild(this.refThetaGraph);
    this.refThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight / 2.2 - 20);



    testThetaGraph.id = 'variableSim-theta';
    this.testThetaGraph = drawTheta(model.graphDataTest, model.graphLen, 'variableSim-theta', 'test', this.graphSize, this.beadOnCharts);
    this.testThetaGraph = new phet.scenery.DOM(this.testThetaGraph);

    // this.rootNode.addChild(this.testThetaGraph);
    this.addChild(this.testThetaGraph);
    this.testThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight * 1.8 / 2.2 - 20);



    let gsize = this.graphSize
    // window.addEventListener('resize', () => {
    //   gsize = window.innerWidth / 5;
    //   this.refVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight / 2.2 - 20);
    // })
    // this.addChild(this.rootNode)
    let oldWidth = window.innerWidth;
    let oldHeight = window.innerHeight;
    // setInterval(() => {
    //   if (gsize != this.graphSize) {
    //     this.graphSize = gsize;


    //     this.testVelocityGraph.detach()
    //     this.testThetaGraph.detach()
    //     this.refThetaGraph.detach()
    //     this.refVelocityGraph.detach()

    //     refVelocityGraph.id = 'staticSim-velocity';
    //     this.refVelocityGraph = drawVelocity(model.graphData, model.graphLen, 'staticSim-velocity', 'reference', this.graphSize);
    //     this.refVelocityGraph = new phet.scenery.DOM(this.refVelocityGraph);

    //     // this.rootNode.addChild(this.refVelocityGraph);
    //     this.addChild(this.refVelocityGraph);
    //     // this.refVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight / 2.2 - 20);
    //     this.refVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.leftTop.x, 0);
    //     console.log(this.domNode.leftTop)

    //     testVelocityGraph.id = 'variableSim-velocity';
    //     this.testVelocityGraph = drawVelocity(model.graphDataTest, model.graphLen, 'variableSim-velocity', 'test', this.graphSize, this.beadOnCharts);
    //     this.testVelocityGraph = new phet.scenery.DOM(this.testVelocityGraph);

    //     // this.rootNode.addChild(this.testVelocityGraph);
    //     this.addChild(this.testVelocityGraph);
    //     this.testVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight * 1.8 / 2.2 - 20);

    //     refThetaGraph.id = 'staticSim-theta';
    //     this.refThetaGraph = drawTheta(model.graphData, model.graphLen, 'staticSim-theta', 'reference', this.graphSize);
    //     this.refThetaGraph = new phet.scenery.DOM(this.refThetaGraph);

    //     // this.rootNode.addChild(this.refThetaGraph);
    //     this.addChild(this.refThetaGraph);
    //     this.refThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight / 2.2 - 20);

    //     testThetaGraph.id = 'variableSim-theta';
    //     this.testThetaGraph = drawTheta(model.graphDataTest, model.graphLen, 'variableSim-theta', 'test', this.graphSize, this.beadOnCharts);
    //     this.testThetaGraph = new phet.scenery.DOM(this.testThetaGraph);

    //     // this.rootNode.addChild(this.testThetaGraph);
    //     this.addChild(this.testThetaGraph);
    //     this.testThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight * 1.8 / 2.2 - 20);


    //   }
    //   if (window.innerWidth !== oldWidth || window.innerHeight !== oldHeight) {
    //     // Update the centerBottom property of each graph
    //     this.refVelocityGraph.centerBottom = new phet.dot.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    //     console.log(this.domNode.leftTop)
    //     this.testVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight * 1.8 / 2.2 - 20);
    //     this.refThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight / 2.2 - 20);
    //     this.testThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight * 1.8 / 2.2 - 20);
    //     // this.refVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight / 2.2 - 20);
    //     // this.testVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight * 1.8 / 2.2 - 20);
    //     // this.refThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight / 2.2 - 20);
    //     // this.testThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight * 1.8 / 2.2 - 20);

    //     oldWidth = window.innerWidth;
    //     oldHeight = window.innerHeight;
    //   }
    // }, 300)




    // setInterval(() => {
    //   if (window.innerWidth !== oldWidth || window.innerHeight !== oldHeight) {
    //     // Update the centerBottom property of each graph
    //     this.refVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight / 2.2 - 20);
    //     this.testVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight * 1.8 / 2.2 - 20);
    //     this.refThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight / 2.2 - 20);
    //     this.testThetaGraph.centerBottom = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight * 1.8 / 2.2 - 20);

    //     oldWidth = window.innerWidth;
    //     oldHeight = window.innerHeight;
    //   }
    // }, 300);




    const buttonRadius = new Property<boolean>(false);
    const buttonGravity = new Property<boolean>(false);
    const buttonFriction = new Property<boolean>(false);
    const buttonOmega = new Property<boolean>(false);
    const buttonOmegaRads = new Property<boolean>(false);
    const buttonTheta = new Property<boolean>(false);
    const buttonVelocity = new Property<boolean>(false);
    const buttonSimSpeed = new Property<boolean>(false);


    var toggleRadius = 13;
    const exText = new phet.scenery.Text("radius", { fontSize: fontSize, textAlign: false });
    const exRichText = new RichText('✎');
    const simSpeedSlider = new HSlider(model.simSpeedProp, new Range(0.000, Number(0.5)), { helpText: 'Simulation Speed', maxWidth: 100 });


    const heightDiff = simSpeedSlider.height - exText.height;
    const exampleButton = new RoundToggleButton(buttonRadius, false, true, { radius: toggleRadius });
    const sliderGap = new Rectangle(0, 0, 0, 10);
    // fontSize = window.innerWidth/50;
    const radius = new RichText("radius (<i>r</i>)", { fontSize: fontSize, textAlign: 'left' })
    const gravity = new RichText("gravity (<i>g</i>)", { fontSize: fontSize, textAlign: 'left' })
    const friction = new RichText("friction (<i>k</i>)", { fontSize: fontSize, textAlign: 'left' })
    const ang = new RichText("ang. vel. (<i>ω</i>)", { fontSize: fontSize, textAlign: 'left' })
    const ang1 = new RichText("ang. vel. (<i>ω</i>)", { fontSize: fontSize, textAlign: 'left' })
    const angP = new RichText("ang. pos. (<i>θ₀</i>)", { fontSize: fontSize, textAlign: 'left' })
    const velocity = new RichText("velocity (<i>v₀</i>)", { fontSize: fontSize, textAlign: 'left' })

    var textVBoxConstants = new VBox({
      align: 'center', children: [
        // new Rectangle(0,0,0,exampleSlider.height-exText.height),
        // new Rectangle(0, 0, angP.width + 10, 0),
        new Rectangle(0, 0, 120, 0),
        new Rectangle(0, 0, 0, simSpeedSlider.height - radius.height + sliderGap.height),
        // new phet.scenery.Text("radius (r)", { fontSize: fontSize, textAlign: 'left' }),
        radius,
        new Rectangle(0, 0, 0, simSpeedSlider.height - radius.height + sliderGap.height),
        // new phet.scenery.Text("gravity (g)", { fontSize: fontSize, textAlign: 'left' }),
        gravity,
        new Rectangle(0, 0, 0, simSpeedSlider.height - radius.height + sliderGap.height),
        // new phet.scenery.Text("friction (k)", { fontSize: fontSize, textAlign: 'left' }),
        friction,
        new Rectangle(0, 0, 0, simSpeedSlider.height - radius.height + sliderGap.height),
        // new phet.scenery.Text("ang. vel. (ω)", { fontSize: fontSize, textAlign: 'left' }),
        ang,
        new Rectangle(0, 0, 0, simSpeedSlider.height - radius.height + sliderGap.height),
        // new phet.scenery.Text("ang. vel. (ω)", { fontSize: fontSize, textAlign: 'left' }),
        ang1,
        new Rectangle(0, 0, 0, simSpeedSlider.height - radius.height + sliderGap.height),

      ]
    })




    var textVBoxInitial = new VBox({
      align: 'center', children: [

        new Rectangle(0, 0, 120, simSpeedSlider.height - radius.height + sliderGap.height),

        angP,
        new Rectangle(0, 0, 0, simSpeedSlider.height - radius.height + sliderGap.height),

        velocity,
        new Rectangle(0, 0, 0, simSpeedSlider.height - radius.height + sliderGap.height),

      ]
    })

    var radiusSlider = new HSlider(model.radiusProp, new Range(0.1, Number(1)))

    var sliderVboxConstants = new VBox({
      children: [
        new Rectangle(0, 0, 0, 5),
        radiusSlider,
        // new HSlider(model.radiusProp, new Range(0.1, Number(100))),
        new Rectangle(0, 0, 0, 5),
        new HSlider(model.gravityProp, new Range(0, Number(25))),
        new Rectangle(0, 0, 0, 5),
        new HSlider(model.frictionProp, new Range(0, Number(100))),
        new Rectangle(0, 0, 0, 5),
        new HSlider(model.omegaRadsProp, new Range(0, Number(20))),
        new Rectangle(0, 0, 0, 5),
        new HSlider(model.omegaProp, new Range(0, Number(1145.92))),
        new Rectangle(0, 0, 0, 5),
      ]
    })

    var sliderVboxInitial = new VBox({
      children: [
        new Rectangle(0, 0, 0, 5),
        new HSlider(model.thetaProp, new Range(0, Number(360))),
        new Rectangle(0, 0, 0, 5),
        new HSlider(model.velocityProp, new Range(0, Number(10))),
        new Rectangle(0, 0, 0, 5),

      ]
    })





    var buttonVBoxConstants = new VBox({
      children: [
        new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height - 2),
        new RoundToggleButton(buttonRadius, false, true, { radius: toggleRadius, content: new phet.scenery.Text('✎', { fontSize: 120, maxWidth: 15 }) }),

        new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),
        new RoundToggleButton(buttonGravity, false, true, { radius: toggleRadius, content: new phet.scenery.Text('✎', { fontSize: 20, maxWidth: 15 }) }),

        new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),
        new RoundToggleButton(buttonFriction, false, true, { radius: toggleRadius, content: new phet.scenery.Text('✎', { fontSize: 20, maxWidth: 15 }) }),

        new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),
        new RoundToggleButton(buttonOmegaRads, false, true, { radius: toggleRadius, content: new phet.scenery.Text('✎', { fontSize: 20, maxWidth: 15 }) }),

        new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),
        new RoundToggleButton(buttonOmega, false, true, { radius: toggleRadius, content: new phet.scenery.Text('✎', { fontSize: 20, maxWidth: 15 }) }),

        new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height),

      ]
    })

    var buttonVBoxInitial = new VBox({
      children: [
        new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 2),
        new RoundToggleButton(buttonTheta, false, true, { radius: toggleRadius, content: new phet.scenery.Text('✎', { fontSize: 20, maxWidth: 15 }) }),

        new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),
        new RoundToggleButton(buttonVelocity, false, true, { radius: toggleRadius, content: new phet.scenery.Text('✎', { fontSize: 20, maxWidth: 15 }) }),

        new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),


      ]
    })

    var dynamicTextVBoxConstants = new VBox({
      align: 'left', children: [
        new Rectangle(0, 0, 120, 0),
        new HBox({
          children: [
            new Rectangle(0, 0, 10, 0),
            // new RichText(new DerivedProperty([model.radiusProp], (value) => { return String(Number(value).toFixed(2)) })),
            new phet.scenery.Text(new DerivedProperty([model.radiusProp], (value) => { return String(Number(value).toFixed(2)) }), { fontSize: fontSize, textAlign: 'left' }),
            new phet.scenery.Text(" m", { fontSize: fontSize, textAlign: 'left' })
          ]
        }),
        new Rectangle(0, 0, 0, simSpeedSlider.height - exText.height + sliderGap.height),
        new HBox({
          children: [
            new Rectangle(0, 0, 10, 0),
            // new RichText(new DerivedProperty([model.gravityProp], (value) => { return String(Number(value).toFixed(2)) })),
            new phet.scenery.Text(new DerivedProperty([model.gravityProp], (value) => { return String(Number(value).toFixed(2)) }), { fontSize: fontSize, textAlign: 'left' }),
            new phet.scenery.Text(" m/s²", { fontSize: fontSize, textAlign: 'left' }),

          ]
        }),
        new Rectangle(0, 0, 0, simSpeedSlider.height - exText.height + sliderGap.height),
        new HBox({
          children: [
            new Rectangle(0, 0, 10, 0),
            // new RichText(new DerivedProperty([model.frictionProp], (value) => { return String(Number(value).toFixed(2)) })),
            new phet.scenery.Text(new DerivedProperty([model.frictionProp], (value) => { return String(Number(value).toFixed(2)) }), { fontSize: fontSize, textAlign: 'left' }),
            new phet.scenery.Text(" 1/s", { fontSize: fontSize, textAlign: 'left' })
          ]
        }),
        new Rectangle(0, 0, 0, simSpeedSlider.height - exText.height + sliderGap.height),
        new HBox({
          children: [
            new Rectangle(0, 0, 10, 0),
            // new RichText(new DerivedProperty([model.omegaRadsProp], (value) => { return String(Number(value).toFixed(2)) })),
            new phet.scenery.Text(new DerivedProperty([model.omegaRadsProp], (value) => { return String(Number(value).toFixed(2)) }), { fontSize: fontSize, textAlign: 'left' }),
            new phet.scenery.Text(" rad/s", { fontSize: fontSize, textAlign: 'left' })
          ]
        }),
        new Rectangle(0, 0, 0, simSpeedSlider.height - exText.height + sliderGap.height),
        new HBox({
          children: [
            new Rectangle(0, 0, 10, 0),
            // new RichText(new DerivedProperty([model.omegaProp], (value) => { return String(Number(value).toFixed(2)) })),
            new phet.scenery.Text(new DerivedProperty([model.omegaProp], (value) => { return String(Number(value).toFixed(2)) }), { fontSize: fontSize, textAlign: 'left' }),
            new phet.scenery.Text(" °/s", { fontSize: fontSize, textAlign: 'left' })
          ]
        }),

      ]
    });
    var dynamicTextVBoxInitial = new VBox({
      align: 'left', children: [
        new Rectangle(0, 0, 85, 0),
        new HBox({
          children: [
            new Rectangle(0, 0, 3, 0),
            // new RichText(new DerivedProperty([model.thetaProp], (value) => { return String(Number(value).toFixed(2)) })),
            new phet.scenery.Text(new DerivedProperty([model.thetaProp], (value) => { return String(Number(value).toFixed(2)) }), { fontSize: fontSize, textAlign: 'left' }),
            new phet.scenery.Text(" °", { fontSize: fontSize, textAlign: 'left' })
          ]
        }),
        new Rectangle(0, 0, 0, simSpeedSlider.height - exText.height + sliderGap.height),
        new HBox({
          children: [
            new Rectangle(0, 0, 3, 0),
            // new RichText(new DerivedProperty([model.velocityProp], (value) => { return String(Number(value).toFixed(2)) })),
            new phet.scenery.Text(new DerivedProperty([model.velocityProp], (value) => { return String(Number(value).toFixed(2)) }), { fontSize: fontSize, textAlign: 'left' }),
            new phet.scenery.Text(" m/s", { fontSize: fontSize, textAlign: 'left' })
          ]
        }),



      ]
    });
    const panelWidth = new HBox({ children: [textVBoxConstants, sliderVboxConstants, buttonVBoxConstants, dynamicTextVBoxConstants] }).width

    const titleInitial = new phet.scenery.Text(" Initial Conditions", { fontSize: fontSize });


    const titleConstants = new phet.scenery.Text(" Constants", { fontSize: fontSize })

    const panelConstants = new Panel(new VBox({ align: 'center', children: [titleConstants, new HBox({ children: [textVBoxConstants, sliderVboxConstants, buttonVBoxConstants, (dynamicTextVBoxConstants)] })] }), {
      fill: new Color(210, 210, 210)

    })
    const panelInitial = new Panel(new VBox({ align: 'center', children: [titleInitial, new HBox({ children: [textVBoxInitial, sliderVboxInitial, new HBox({ children: [buttonVBoxInitial] }), new Rectangle(0, 0, 10, 0), dynamicTextVBoxInitial] }), new Rectangle(0, 0, panelWidth, 0)] }), { fill: new Color(210, 210, 210), maxWidth: panelConstants.width, minHeight: window.innerHeight / 20, minWidth: panelConstants.width })
    this.addChild(panelInitial)

    this.addChild(panelConstants)
    const totalWidth = (panelInitial.width)

    panelConstants.leftTop = new phet.dot.Vector2(0, 0);






    // window.addEventListener('resize', () => {

    //   panelConstants.leftTop = new phet.dot.Vector2(0, 0)
    //   panelInitial.leftTop = new phet.dot.Vector2(0, panelConstants.centerBottom.y + 10)
    //   equationPanel.leftTop = new phet.dot.Vector2(0, panelInitial.centerBottom.y + 10);
    //   visualBox.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + 10);
    //   resetAllButton.leftTop = new phet.dot.Vector2(0, visualBox.center.y + 10);


    // })

    panelInitial.maxWidth = this.layoutBounds.maxX / 3.5;
    panelConstants.maxWidth = this.layoutBounds.maxX / 3.5;











    const velocityDOM = document.createElement('span');
    const thetaDOM = document.createElement('span');
    velocityDOM.classList.add("my-mathquill-input");
    thetaDOM.classList.add("my-mathquill-input");

    const velocityField = new EquationInput(this.sceneNode, velocityDOM,
      {
        initialText: model.velocityEQ,
        model: model,
        equation: 'velocityEQ',
        verifyEq: verifyEq,
        thetaElement: thetaDOM,
        velocityElement: velocityDOM,
        dom: velocityDOM,
        focusedEq: this.focusedEq
      }


    );

    const thetaField = new EquationInput(this.sceneNode, thetaDOM,
      {
        initialText: model.thetaEQ,
        model: model,
        equation: 'thetaEQ',
        verifyEq: verifyEq,
        thetaElement: thetaDOM,
        velocityElement: velocityDOM,
        dom: thetaDOM,
        focusedEq: this.focusedEq
      }


    );



    this.focusedEq = [model.velocityEQ, velocityField, velocityField.writeToEquation];
    const focusedEq = [this.focusedEq]
    const velBox = new HBox({ preferredWidth: 30, children: [velocityField] })


    velBox.addInputListener({ // try making it just to size of mathquil inputs? and using that?


      down: function (event: any) {
        // Check if the click was inside your node
        velocityField.mathField.focus();
        focusedEq[0][0] = model.velocityEQ
        focusedEq[0][1] = velocityField


      }
    });
    const thetaBox = new HBox({ children: [thetaField] })
    thetaBox.addInputListener({ // try making it just to size of mathquil inputs? and using that?
      down: function (event: any) {
        // Check if the click was inside your node
        thetaField.mathField.focus();
        focusedEq[0][0] = model.thetaEQ
        focusedEq[0][1] = thetaField


      }
    });

    var thetadot = document.createElement('span');
    // thetadot.innerHTML = '<span>θ&#x307;</span>=  ';
    thetadot.innerHTML = `<span style="position: relative; display: inline-block;">
    <span>θ</span>
    <span style="position: absolute; top: -0.8em; left: 45%; transform: translateX(-50%);">.</span>
  </span>=  `;
    thetadot.style.fontSize = `${fontSize + 5}px`
    const thetadotDOM = new phet.scenery.DOM((thetadot));


    var vdot = document.createElement('span');
    vdot.innerHTML = '<span>v&#x307;</span>=  ';
    vdot.style.fontSize = `${fontSize + 5}px`
    const vdotDOM = new phet.scenery.DOM((vdot));


    const buttonAddTheta = new Property<boolean>(false);
    buttonAddTheta.lazyLink(() => {

      this.focusedEq[1].writeToEquation('\\theta'); this.focusedEq[0] = this.focusedEq[1].getElementValue().replaceAll('\\theta', ' t').replaceAll('\\omega', ' o');

      this.focusedEq[1].mathField.focus()
    })

    const buttonAddOmega = new Property<boolean>(false);
    buttonAddOmega.lazyLink(() => {
      this.focusedEq[1].writeToEquation('\\omega'); this.focusedEq[0] = this.focusedEq[1].getElementValue().replaceAll('\\theta', ' t').replaceAll('\\omega', ' o');

      this.focusedEq[1].mathField.focus()
    })

    const buttonAddThetaDOM = new RectangularToggleButton(buttonAddTheta, false, true, { minWidth: 300, minHeight: 20, content: new RichText('insert (θ) into equation') })

    const buttonAddOmegaDOM = new RectangularToggleButton(buttonAddOmega, false, true, { minWidth: 300, minHeight: 20, content: new RichText('insert (ω) into equation') })
    const testEquation = new phet.scenery.Text("Test Equations", { fontSize: fontSize, textAlign: 'left' })
    const equationPanel = new Panel(new VBox({
      minimumWidth: 400,
      align: 'center', children: [
        new HBox({ align: "center", children: [testEquation] }),
        new Rectangle(0, 0, 10, 10),
        new VBox({ align: "right", children: [buttonAddThetaDOM, new Rectangle(0, 0, 50, 5), buttonAddOmegaDOM,] }),
        new Rectangle(0, 0, 0, 10),
        new HBox({ children: [vdotDOM, velBox] }),
        new Rectangle(0, 0, 0, 10),
        new HBox({ children: [thetadotDOM, thetaBox] }),
        new Rectangle(0, 0, panelWidth, 0),


      ]

    }), { fill: new Color(210, 210, 210), maxHeight: 400, align: "center", minHeight: 100, maxWidth: panelInitial.rightTop.x, minWidth: panelInitial.width });
    this.addChild(equationPanel);

    panelInitial.centerTop = new phet.dot.Vector2(panelConstants.centerBottom.x, panelConstants.centerBottom.y + 10)
    panelInitial.centerTop = new phet.dot.Vector2(panelConstants.centerBottom.x, panelConstants.centerBottom.y + 10);
    panelInitial.centerTop = new phet.dot.Vector2(panelConstants.centerBottom.x, panelConstants.centerBottom.y + 10);


    this.project = true;
    this.projectTemp = this.project;
    const projectSwitch = new Property<boolean>(this.project);
    projectSwitch.lazyLink(() => { this.projectTemp = !this.projectTemp })
    const simSpeedTitle = new phet.scenery.Text("simSpeed", { fontSize: fontSize, textAlign: 'left' })

    let speedRate = new phet.scenery.Text(new DerivedProperty([model.simSpeedProp], (value) => { return String(Number(Math.abs(value)).toFixed(3)) }), { fontSize: fontSize, textAlign: 'left' })
    window.addEventListener("keypress", (e) => {
      if (e.key == " ") {
        speedRate = new phet.scenery.Text(("d"), { fontSize: fontSize, textAlign: 'left' })

      }
    })
    const measuresign = new phet.scenery.Text("x", { fontSize: fontSize, textAlign: 'left' })
    const visualBox = new VBox({
      align: 'center', children: [
        new HBox({
          children: [
            simSpeedTitle,
            simSpeedSlider,
            new RoundToggleButton(buttonSimSpeed, false, true, { radius: 12, content: new phet.scenery.Text('✎', { fontSize: 20, maxWidth: 15 }) }),

            // new phet.scenery.Text('✎', { fontSize: 20, textAlign: 'center' }),
            new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height),
            new HBox({
              children: [
                new Rectangle(0, 0, 10, 0),
                // new RichText(new DerivedProperty([model.simSpeedProp], (value) => { return String(Number(value).toFixed(2)) })),
                speedRate,
                measuresign
              ]
            }),]
        }),

      ]
    });

    const referenceLabel = new phet.scenery.Text('Reference:', { fontSize: fontSize });
    const testLabel = new phet.scenery.Text('Test:', { fontSize: fontSize });

    visualBox.leftTop = new phet.dot.Vector2(0, equationPanel.centerY + 10)
    // this.addChild(resetAllButton)
    resetAllButton.leftTop = new phet.dot.Vector2(0, equationPanel.rightBottom.y + 10)



    referenceLabel.leftCenter = new phet.dot.Vector2(panelConstants.rightCenter.x + 10, 20);

    // testLabel.leftCenter = new phet.dot.Vector2(panelConstants.rightCenter.x + window.innerWidth / 80, window.innerHeight / 2 + window.innerHeight / 50)


    // const lineRect = new Rectangle(0, 0, window.innerWidth / 3.5, 2, { fill: new Color("black") });
    const lineRect = new Rectangle(0, 0, this.layoutBounds.maxX / 3.5, 2, { fill: new Color("black") });
    // const lineRect = new Rectangle(0, 0, this.layoutBounds.maxX / 4, { fill: new Color("black") });

    // lineRect.leftCenter = new phet.dot.Vector2(testLabel.leftBottom.x, testLabel.leftBottom.y - testLabel.height - 10)
    // lineRect.leftCenter = new phet.dot.Vector2(this.domNode.leftBottom.x, testLabel.leftBottom.y - testLabel.height - 10)
    this.addChild(lineRect)

    this.addChild(referenceLabel);

    this.addChild(testLabel);

    // if (!ThreeUtils.isWebGLEnabled()) {
    //   ThreeUtils.showWebGLWarning(this);
    //   this.enabled = false;
    //   return;
    // }






    // this.addChild(this.rootNode)


    const testGroup = new THREE.Group()
    const refGroup = new THREE.Group()

    // 


    // 
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    const camera = new THREE.PerspectiveCamera(30, this.layoutBounds.maxX / this.layoutBounds.maxY, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    // renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
    renderer.setSize(this.layoutBounds.maxX / 3.5, this.layoutBounds.maxY / 3.5);

    document.body.appendChild(renderer.domElement)
    const domNode = new phet.scenery.DOM(renderer.domElement);
    this.domNode = domNode;
    // this.addChild(domNode);
    this.addChild(this.domNode);
    // this.addChild(domNode);
    // this.addChild(rootNode);

    const scene2 = new THREE.Scene();
    const camera2 = new THREE.PerspectiveCamera(30, this.layoutBounds.maxX / this.layoutBounds.maxY, 0.1, 1000);
    const renderer2 = new THREE.WebGLRenderer({ alpha: true });
    // renderer2.setSize(window.innerWidth / 3, window.innerHeight / 3);
    renderer2.setSize(this.layoutBounds.maxX / 3.5, this.layoutBounds.maxY / 3.5);


    window.addEventListener('resize', () => {
      // renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
      renderer.setSize(this.layoutBounds.maxX / 3.5, this.layoutBounds.maxY / 3.5);
      renderer.setPixelRatio(window.devicePixelRatio);
      // renderer2.setSize(window.innerWidth / 3, window.innerHeight / 3);
      renderer2.setSize(this.layoutBounds.maxX / 3.5, this.layoutBounds.maxY / 3.5);
      renderer2.setPixelRatio(window.devicePixelRatio);
      // renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
      // renderer.setPixelRatio(window.devicePixelRatio);
      // renderer2.setSize(window.innerWidth / 3, window.innerHeight / 3);
      // renderer2.setPixelRatio(window.devicePixelRatio);

    })

    const domNode2 = new phet.scenery.DOM(renderer2.domElement)
    this.addChild(domNode2)
    // this.addChild(rootNode)
    scene.add(camera)
    scene2.add(camera2)


    camera2.position.z = 5;




    // Resize the display to always fill the window
    display.resizeOnWindowResize();




    // Lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    const ambientLight2 = new THREE.AmbientLight(0x333333);




    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    const sunLight2 = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(-1, 1.5, .8);
    sunLight2.position.set(-6, 1.5, .8);

    const moonLight = new THREE.DirectionalLight(0xffffff, 0.3);
    const moonLight2 = new THREE.DirectionalLight(0xffffff, 0.3);


    moonLight.position.set(2.0, 1.0, 2.5);
    moonLight2.position.set(2.0, 1.0, 2.5);




    const geometryHoop = new THREE.TorusGeometry(1.5, .07, 16, 50, 2 * Math.PI);
    const materialHoop = new THREE.MeshLambertMaterial({ color: 0x44aa88, lightMapIntensity: .5 });

    testGroup.position.set(5, 2, 0)

    refGroup.position.set(5, 2, 0)




    camera.position.set(-5, 1.5, 0)

    camera2.position.set(-5, 1.5, 5)



    refGroup.add(ambientLight);
    refGroup.add(sunLight);
    refGroup.add(moonLight);
    testGroup.add(ambientLight2)
    testGroup.add(sunLight2)
    testGroup.add(moonLight2)



    scene.add(refGroup)
    scene2.add(testGroup)





    this.hoop = new THREE.Mesh(geometryHoop, materialHoop);


    refGroup.position.set(0, 0, 0)
    this.hoop.position.set(-5, 1.5, 0);


    const geometryBall = new THREE.SphereGeometry(.12, 8, 8);
    const materialBall = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    this.ball = new THREE.Mesh(geometryBall, materialBall);

    this.ball.position.set(1.5, 1.5, 0);

    refGroup.add(this.ball)
    refGroup.add(this.hoop)


    this.balls = [];
    this.ballsCords = [];
    this.trailLen = 40;
    for (let i = 0; i < this.trailLen; i++) {
      this.balls.push(new THREE.Mesh(new THREE.SphereGeometry(i / this.trailLen * .12 + .01, 5, 5), new THREE.MeshLambertMaterial({ color: 0xff0000, transparent: true, opacity: 0 + i / this.trailLen, lightMapIntensity: .5 })));
      this.ballsCords.push(999);
    }

    this.balls.forEach((e: Object3D<Event>) => { refGroup.add(e); e.position.set(99, 0, 0) });
    this.prevCords = [];
    this.prevCords.length = this.trailLen;
    this.prevCords.fill(999);

    this.ballsTest = [];
    this.ballsCordsTest = [];

    for (let i = 0; i < this.trailLen; i++) {
      this.ballsTest.push(new THREE.Mesh(new THREE.SphereGeometry(i / this.trailLen * .12 + .01, 5, 5), new THREE.MeshLambertMaterial({ color: 0xff0000, transparent: true, opacity: 0 + i / this.trailLen, lightMapIntensity: .5 })));

      this.ballsCordsTest.push(999);
    }
    // 


    let thetaPrevious = model.thetaEQ;
    let velocityPrevious = model.velocityEQ;

    setInterval(() => {
      if (update) {
        this.ballsTest.forEach((e: Object3D<Event>) => { testGroup.add(e); e.position.set(99, 0, 0); e.visible = this.showBead ? true : false });
        this.ballTest.visible = this.showBead ? true : false
        update = false;
      }
      // this.x = this.domNode.leftTop.x
      // this.y = this.domNode.leftTop.y

    }, 100)




    this.prevCordsTest = [];
    this.prevCordsTest.length = this.trailLen;
    this.prevCordsTest.fill(999);
    // -------------------------------------------------------------------TEST sim threejs






    const geometryHoopTest = new THREE.TorusGeometry(1.5, .07, 16, 50, 2 * Math.PI);
    const materialHoopTest = new THREE.MeshLambertMaterial({ color: 0x44aa88, lightMapIntensity: .5 });
    this.hoopTest = new THREE.Mesh(geometryHoopTest, materialHoopTest);
    this.hoopTest.position.set(-5, -2.0, 0);
    testGroup.add(this.hoopTest)


    const geometryBallTest = new THREE.SphereGeometry(.12, 8, 8);
    const materialBallTest = new THREE.MeshLambertMaterial({ color: 0xff0000, lightMapIntensity: .5 });
    this.ballTest = new THREE.Mesh(geometryBallTest, materialBallTest);
    this.ballTest.position.set(10, 10, 10);
    this.showBead ? testGroup.add(this.ballTest) : null;
    this.ballTest.visible = this.showBead ? true : false
    const rootNodeClone = this.rootNode;

    // let changing = false;

    camera.position.z = 15
    camera.zoom = 2.1;
    camera.updateProjectionMatrix()
    camera2.position.z = 15

    testGroup.position.set(0, 3.5, 0)


    camera2.zoom = 2.1;
    camera2.updateProjectionMatrix()
    camera.near = 0.1;
    camera2.near = 0.1;
    camera.far = 1000;
    camera2.far = 1000;

    display.updateOnRequestAnimationFrame(() => {

      renderer.render(scene, camera);
      renderer2.render(scene2, camera2)
    });






    document.addEventListener('keydown', function (event) {

      if (event.key === "ArrowUp" && model.simSpeedProp.value < .499) {
        model.simSpeedProp.value += .001;
        speedRatio += .01;
      }
      if (event.key === "ArrowDown" && model.simSpeedProp.value > .000) {
        model.simSpeedProp.value -= .001;
        speedRatio -= .01
      }
      if (event.key === "r") {



        if (focusedEq[0][1].mathField.__controller.blurred) {
          post(model.name, "reset", model.radius, model.gravity, model.friction, model.omega, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id)
          reset()
          console.log("reset345345345")
        }
      }

    });

    var changing = false
    var changingWhileOut = false;
    var changingWithId = [false, -1]


    for (var slider of sliderVboxConstants._children.concat(sliderVboxInitial._children)) {


      if (slider !== simSpeedSlider) {
        slider.addInputListener({

          mousedown: function (event: { target: { _id: any; }; }) {


            console.log("mousedown flkjjhdsfkjlsdajklsljkdsfdjkdshf")
            console.log(event.target._id)

            changing = true
            changingWithId[0] = true;
            changingWithId[1] = event.target._id

            // rootNodeClone.setVisible(false)

            // console.log('Sliders mouse down');

          },
          // out: function (even) {

          //   changing ? changingWhileOut = true : null


          // },
          // mouseup: function (event: { target: { _id: number; }; }) {
          //   // Check if the click was inside your node
          //   mouseup = true

          //   if (changing && !changingWhileOut) {

          //     if (event.target._id === 145 || event.target._id === 153) {

          //       reset("radius changed")
          //     }
          //     else if (event.target._id === 161 || event.target._id === 169) {

          //       reset("gravity changed")
          //     }
          //     else if (event.target._id === 176 || event.target._id === 184) {

          //       reset("friction changed")
          //     }
          //     else if (event.target._id === 191 || event.target._id === 206 || event.target._id === 199 || event.target._id === 214) {

          //       reset("ang. vel. changed")
          //     }
          //     else if (event.target._id === 223 || event.target._id === 231) {

          //       reset("ang. pos. changed")
          //     }
          //     else if (event.target._id === 238 || event.target._id === 246) {
          //       reset("velocity changed")
          //     }


          //     changing = false
          //     changingWhileOut = false
          //   }


          //   if (changing && changingWhileOut) {
          //     console.log("hey")
          //     if (event.target._id === 145 || event.target._id === 153) {

          //       reset("radius changed")
          //       changingWithId[0] = false
          //       changingWithId[1] = -1
          //     }
          //     else if (event.target._id === 161 || event.target._id === 169) {

          //       reset("gravity changed")
          //       changingWithId[0] = false
          //       changingWithId[1] = -1
          //     }
          //     else if (event.target._id === 176 || event.target._id === 184) {

          //       reset("friction changed")
          //       changingWithId[0] = false
          //       changingWithId[1] = -1
          //     }
          //     else if (event.target._id === 191 || event.target._id === 206 || event.target._id === 199 || event.target._id === 214) {

          //       reset("ang. vel. changed")
          //       changingWithId[0] = false
          //       changingWithId[1] = -1
          //     }
          //     else if (event.target._id === 223 || event.target._id === 231) {

          //       reset("ang. pos. changed")
          //       changingWithId[0] = false
          //       changingWithId[1] = -1
          //     }
          //     else if (event.target._id === 238 || event.target._id === 246) {
          //       reset("velocity changed")
          //       changingWithId[0] = false
          //       changingWithId[1] = -1
          //     }

          //     changing = false
          //     changingWhileOut = false
          //   }

          // },




        })
      }
    }
    window.addEventListener("pointerup", () => {
      if (changingWithId[0]) {
        if (changingWithId[1] === 145 || changingWithId[1] === 153) {

          reset("radius changed")
          changingWithId[0] = false
          changingWithId[1] = -1
        }
        else if (changingWithId[1] === 161 || changingWithId[1] === 169) {

          reset("gravity changed")
          changingWithId[0] = false
          changingWithId[1] = -1
        }
        else if (changingWithId[1] === 176 || changingWithId[1] === 184) {

          reset("friction changed")
          changingWithId[0] = false
          changingWithId[1] = -1
        }
        else if (changingWithId[1] === 191 || changingWithId[1] === 206 || changingWithId[1] === 199 || changingWithId[1] === 214) {

          reset("ang. vel. changed")
          changingWithId[0] = false
          changingWithId[1] = -1
        }
        else if (changingWithId[1] === 223 || changingWithId[1] === 231) {

          reset("ang. pos. changed")
          changingWithId[0] = false
          changingWithId[1] = -1
        }
        else if (changingWithId[1] === 238 || changingWithId[1] === 246) {
          reset("velocity changed")
          changingWithId[0] = false
          changingWithId[1] = -1
        }
      }
    })
    // window.addEventListener("mouseup", () => {
    //   if (changingWithId[0]) {
    //     if (changingWithId[1] === 145 || changingWithId[1] === 153) {

    //       reset("radius changed")
    //       changingWithId[0] = false
    //       changingWithId[1] = -1
    //     }
    //     else if (changingWithId[1] === 161 || changingWithId[1] === 169) {

    //       reset("gravity changed")
    //       changingWithId[0] = false
    //       changingWithId[1] = -1
    //     }
    //     else if (changingWithId[1] === 176 || changingWithId[1] === 184) {

    //       reset("friction changed")
    //       changingWithId[0] = false
    //       changingWithId[1] = -1
    //     }
    //     else if (changingWithId[1] === 191 || changingWithId[1] === 206 || changingWithId[1] === 199 || changingWithId[1] === 214) {

    //       reset("ang. vel. changed")
    //       changingWithId[0] = false
    //       changingWithId[1] = -1
    //     }
    //     else if (changingWithId[1] === 223 || changingWithId[1] === 231) {

    //       reset("ang. pos. changed")
    //       changingWithId[0] = false
    //       changingWithId[1] = -1
    //     }
    //     else if (changingWithId[1] === 238 || changingWithId[1] === 246) {
    //       reset("velocity changed")
    //       changingWithId[0] = false
    //       changingWithId[1] = -1
    //     }
    //   }
    // })

    // panelInitial.addInputListener({
    // sliderVboxInitial.addInputListener({
    //   mouseup: function (event: { target: { _id: number; }; }){

    //     if (changing[0][0]) {

    //       if (changing[0][1] === 145 || changing[0][1] === 153) {

    //         reset("radius changed")
    //       }
    //       else if (changing[0][1] === 161 || changing[0][1] === 169) {

    //         reset("gravity changed")
    //       }
    //       else if (changing[0][1] === 176 || changing[0][1] === 184) {

    //         reset("friction changed")
    //       }
    //       else if (changing[0][1] === 191 || changing[0][1] === 206 || changing[0][1] === 199 || changing[0][1] === 214) {

    //         reset("ang. vel. changed")
    //       }
    //       else if (changing[0][1] === 223 || changing[0][1] === 231) {

    //         reset("ang. pos. changed")
    //       }
    //       else if (changing[0][1] === 238 || changing[0][1] === 246) {
    //         // slider.lazyLink
    //         reset("velocity changed")
    //       }
    //       // rootNodeClone.setVisible(true)

    //       // console.log('Sliders sliders mouse up');
    //       changing[0] = [false, null, false]
    //     }
    //   },

    // })
    // panelConstants.addInputListener({
    //   // sliderVboxConstants.addInputListener({
    //   mouseup: function (event: any) {
    //     if (changing) {
    //       console.log(event.target._id)
    //       if (event.target._id === 145 || event.target._id === 153) {
    //         reset("radius changed")
    //       }

    //     }
    //     // if (changing[0][0]) {

    //     //   if (changing[0][1] === 145 || changing[0][1] === 153) {

    //     //     reset("radius changed")
    //     //   }
    //     //   else if (changing[0][1] === 161 || changing[0][1] === 169) {

    //     //     reset("gravity changed")
    //     //   }
    //     //   else if (changing[0][1] === 176 || changing[0][1] === 184) {

    //     //     reset("friction changed")
    //     //   }
    //     //   else if (changing[0][1] === 191 || changing[0][1] === 206 || changing[0][1] === 199 || changing[0][1] === 214) {

    //     //     reset("ang. vel. changed")
    //     //   }
    //     //   else if (changing[0][1] === 223 || changing[0][1] === 231) {

    //     //     reset("ang. pos. changed")
    //     //   }
    //     //   else if (changing[0][1] === 238 || changing[0][1] === 246) {
    //     //     // slider.lazyLink
    //     //     reset("velocity changed")
    //     //   }
    //     //   // rootNodeClone.setVisible(true)

    //     //   // console.log('Sliders sliders mouse up');
    //     //   changing[0] = [false, null, false]
    //     // }
    //   },

    // })

    buttonRadius.lazyLink(() => { model.radiusProp.value = Number(window.prompt("Enter value for radius:")); post(model.name, "radius changed", model.radiusProp.value, model.gravityProp.value, model.frictionProp.value, model.omegaProp.value, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id); reset(); })
    buttonGravity.lazyLink(() => { model.gravityProp.value = Number(window.prompt("Enter value for gravity:")); post(model.name, "gravity changed", model.radiusProp.value, model.gravityProp.value, model.frictionProp.value, model.omegaProp.value, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id); reset(); })
    buttonFriction.lazyLink(() => { model.frictionProp.value = Number(window.prompt("Enter value for friction:")); post(model.name, "friction changed", model.radiusProp.value, model.gravityProp.value, model.frictionProp.value, model.omegaProp.value, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id); reset(); })
    buttonOmega.lazyLink(() => { model.omegaProp.value = Number(window.prompt("Enter value for omega in degrees:")); post(model.name, "omega changed", model.radiusProp.value, model.gravityProp.value, model.frictionProp.value, model.omegaProp.value, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id); reset(); })
    buttonOmegaRads.lazyLink(() => { model.omegaRadsProp.value = Number(window.prompt("Enter value for omega in radians:")); post(model.name, "omega changed", model.radiusProp.value, model.gravityProp.value, model.frictionProp.value, model.omegaProp.value, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id); reset(); })
    buttonTheta.lazyLink(() => { model.thetaProp.value = Number(window.prompt("Enter value for theta:")); post(model.name, "ang. pos. changed", model.radiusProp.value, model.gravityProp.value, model.frictionProp.value, model.omegaProp.value, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id); reset(); })
    buttonVelocity.lazyLink(() => { model.velocityProp.value = Number(window.prompt("Enter value for velocity:")); post(model.name, "velocity changed", model.radiusProp.value, model.gravityProp.value, model.frictionProp.value, model.omegaProp.value, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id); reset(); })
    buttonSimSpeed.lazyLink(() => { model.simSpeedProp.value = Number(window.prompt("Enter value for simulation speed:")); })

    equationPanel.leftTop = new phet.dot.Vector2(0, panelInitial.leftBottom.y + 10);
    visualBox.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + 10)
    resetAllButton.leftTop = new phet.dot.Vector2(0, visualBox.centerBottom.y + 10)
    // window.addEventListener('resize', () => {
    //   visualBox.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + 10)
    //   resetAllButton.leftTop = new phet.dot.Vector2(0, visualBox.centerBottom.y + 10)
    //   titleInitial.fontSize = window.innerWidth / 120 + window.innerHeight / 140;
    //   titleConstants.fontSize = window.innerWidth / 120 + window.innerHeight / 140;
    //   testEquation.fontSize = window.innerWidth / 120 + window.innerHeight / 140;
    //   panelInitial.maxWidth = window.innerWidth / 4;
    //   panelConstants.maxWidth = window.innerWidth / 4;
    //   panelInitial.minimumWidth = window.innerWidth / 4;
    //   panelConstants.minimumWidth = window.innerWidth / 4;
    //   equationPanel.minimumWidth = window.innerWidth / 4;


    // })
    // window.addEventListener('resize', () => {

    //   titleInitial.fontSize = window.innerWidth / 120 + window.innerHeight / 140;
    //   titleConstants.fontSize = window.innerWidth / 120 + window.innerHeight / 140;
    //   testEquation.fontSize = window.innerWidth / 120 + window.innerHeight / 140;
    //   panelInitial.maxWidth = window.innerWidth / 4;
    //   panelConstants.maxWidth = window.innerWidth / 4;
    //   panelInitial.minimumWidth = window.innerWidth / 4;
    //   panelConstants.minimumWidth = window.innerWidth / 4;
    //   equationPanel.minimumWidth = window.innerWidth / 4;
    // })
    // window.addEventListener('resize', () => {

    //   panelConstants.leftTop = new phet.dot.Vector2(0, 0)
    //   panelInitial.leftTop = new phet.dot.Vector2(0, panelConstants.centerBottom.y + 10)
    //   equationPanel.leftTop = new phet.dot.Vector2(0, panelInitial.centerBottom.y + 10);


    // })


    // window.addEventListener('resize', () => {

    //   referenceLabel.fontSize = window.innerWidth / 120 + window.innerHeight / 150
    //   testLabel.fontSize = window.innerWidth / 120 + window.innerHeight / 150
    //   simSpeedTitle.fontSize = window.innerWidth / 120 + window.innerHeight / 150
    //   exText.fontSize = window.innerWidth / 120 + window.innerHeight / 150

    //   speedRate.fontSize = window.innerWidth / 120 + window.innerHeight / 150;
    //   measuresign.fontSize = window.innerWidth / 120 + window.innerHeight / 150;

    //   panelConstants.leftTop = new phet.dot.Vector2(0, 0)
    //   panelInitial.leftTop = new phet.dot.Vector2(0, panelConstants.rightBottom.y + 10)
    //   equationPanel.leftTop = new phet.dot.Vector2(0, panelInitial.rightBottom.y + 10)

    //   referenceLabel.leftCenter = new phet.dot.Vector2(panelConstants.rightCenter.x + window.innerWidth / 80, 20);


    // })

    const speedController = visualBox
    speedController.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + 10)
    const speedPanel = new Panel(new VBox({ align: 'center', children: [new HBox({ align: "center", children: [speedController, new Rectangle(0, 0, 40, 0), new VBox({ align: 'right', children: [resetAllButton] })] })] }), { minWidth: equationPanel.width, maxWidth: equationPanel.width, fill: new Color(210, 210, 210) })
    this.addChild(speedPanel)
    ResumeButton.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + speedPanel.height + 15)
    pauseButton.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + speedPanel.height + 15)
    resetInitialsButton.leftTop = new phet.dot.Vector2(0, pauseButton.centerBottom.y + 20)


    // resetInitialsButton.maxWidth = window.innerWidth / 13
    // pauseButton.maxWidth = window.innerWidth / 15
    // ResumeButton.maxWidth = window.innerWidth / 15
    // window.addEventListener('resize', () => {


    //   // here to change
    //   titleInitial.fontSize = window.innerWidth / 120 + window.innerHeight / 140;
    //   titleConstants.fontSize = window.innerWidth / 120 + window.innerHeight / 140;
    //   panelConstants.maxWidth = window.innerWidth / 4;
    //   panelInitial.maxWidth = panelConstants.width;
    //   // equationPanel.maxWidth = window.innerWidth / 5 - 10;
    //   equationPanel.maxWidth = panelInitial.rightTop.x;
    //   panelInitial.minimumWidth = window.innerWidth / 4;
    //   panelConstants.minimumWidth = window.innerWidth / 4;
    //   equationPanel.minimumWidth = window.innerWidth / 4;
    //   thetadot.style.fontSize = `${window.innerWidth / 120 + window.innerHeight / 140 + 5}px`
    //   vdot.style.fontSize = `${window.innerWidth / 120 + window.innerHeight / 140 + 5}px`
    // })



    speedPanel.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + 10)
    // window.addEventListener('resize', () => {
    //   speedController.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + 10)
    //   resetAllButton.leftTop = new phet.dot.Vector2(0, speedController.centerBottom.y + 10)
    //   speedPanel.maxWidth = equationPanel.rightTop.x
    //   speedPanel.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + 10)



    //   testLabel.leftCenter = new phet.dot.Vector2(panelConstants.rightCenter.x + window.innerWidth / 80, window.innerHeight / 2 + window.innerHeight / 50)

    //   ResumeButton.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + speedPanel.height + 15)
    //   pauseButton.leftTop = new phet.dot.Vector2(0, equationPanel.centerBottom.y + speedPanel.height + 15)
    //   resetInitialsButton.leftTop = new phet.dot.Vector2(0, pauseButton.centerBottom.y + 20)
    //   resetInitialsButton.maxWidth = window.innerWidth / 13
    //   pauseButton.maxWidth = window.innerWidth / 15
    //   ResumeButton.maxWidth = window.innerWidth / 15
    //   visualBox.leftBottom = new phet.dot.Vector2(0, equationPanel.leftCenter.y + 10)
    //   resetAllButton.leftBottom = new phet.dot.Vector2(0, visualBox.centerBottom.y + 10)



    // })
    // window.addEventListener("resize", () => {
    //   lineRect.leftCenter = new phet.dot.Vector2(testLabel.leftBottom.x, testLabel.leftBottom.y - testLabel.height - 10)
    //   lineRect.maxWidth = window.innerWidth / 3.5;
    //   lineRect.minimumWidth = window.innerWidth / 3.5;
    // })

    // this.rootNode.leftTop = new phet.dot.Vector2(referenceLabel.rightCenter.x - referenceLabel.width, referenceLabel.rightCenter.y + window.innerHeight / 20)
    // this.rootNode.addChild(this.domNode)
    // this.x = this.domNode.rightTop.x
    // this.y = this.domNode.rightTop.y
    this.domNode.leftTop = new phet.dot.Vector2(referenceLabel.rightCenter.x - referenceLabel.width, referenceLabel.rightCenter.y + window.innerHeight / 20);
    const resizeListener = () => {
      //   this.x = this.domNode.rightTop.x
      // this.y = this.domNode.rightTop.y

      // this.refVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x, referenceLabel.rightCenter.y + window.innerHeight / 20);
      // this.refVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x, referenceLabel.rightCenter.y);


      // camera.aspect = window.innerWidth / window.innerHeight
      camera.aspect = this.layoutBounds.maxX / this.layoutBounds.maxY
      // domNode.leftTop = new phet.dot.Vector2(referenceLabel.rightCenter.x - referenceLabel.width, referenceLabel.rightCenter.y + window.innerHeight / 20);
      camera.updateProjectionMatrix()

    };

    window.addEventListener('resize', () => {
      resizeListener();
    });
    resizeListener();
    domNode2.leftTop = new phet.dot.Vector2(referenceLabel.rightCenter.x - referenceLabel.width, testLabel.rightCenter.y);
    const resizeListener2 = () => {

      // camera2.aspect = window.innerWidth / window.innerHeight
      camera2.aspect = this.layoutBounds.maxX / this.layoutBounds.maxY
      camera2.updateProjectionMatrix()

    };

    window.addEventListener('resize', () => {
      resizeListener2();
    });
    resizeListener2();
    this.refVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x - 40, 30)
    this.refThetaGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x + this.graphSize - 50, 30)
    this.testVelocityGraph.leftTop = new phet.dot.Vector2(this.refVelocityGraph.leftBottom.x, this.refVelocityGraph.leftBottom.y + 10)
    this.testThetaGraph.leftTop = new phet.dot.Vector2(this.refThetaGraph.leftBottom.x - 10, this.refThetaGraph.leftBottom.y + 10)
    this.domNode.leftTop = new phet.dot.Vector2(referenceLabel.rightCenter.x - referenceLabel.width, referenceLabel.leftBottom.y);
    lineRect.leftCenter = new phet.dot.Vector2(this.domNode.leftBottom.x, this.domNode.leftBottom.y + 70)
    testLabel.leftTop = new phet.dot.Vector2(panelConstants.rightCenter.x + 10, this.domNode.leftBottom.y + 80)
    domNode2.leftTop = new phet.dot.Vector2(referenceLabel.rightCenter.x - referenceLabel.width, testLabel.rightCenter.y);



    // Add resize listener to update position when window is resized
    // window.addEventListener('resize', updateDomNodePosition);

    // // Initialize position of domNode
    // updateDomNodePosition();


  }
  public updateDomNodePosition = () => {
    return { x: this.x, y: this.y }
  };



  public override layout(viewBounds: Bounds2): void {
    super.layout(viewBounds);



  }

  /**
   * Steps forward in time.
   */
  public reset(): void {


    if (this.model !== undefined) {
      if (this.model.validEqs) {
        this.ball.position.set(0, 0, 0)
        // this.sceneNode.render(undefined);
        this.project = this.projectTemp


        for (let i = 0; i < this.trailLen; i++) {
          this.balls[i].position.set(999, 999, 999)
          this.ballsTest[i].position.set(999, 999, 999)
          this.ballsCords[i] = 999
          this.ballsCordsTest[i] = 999
          this.prevCords[i] = 999
          this.prevCordsTest[i] = 999
        }

      }
    }
  }

  public override step(dt: number): void {
    // if (this.focusedEq[0][1].mathField.__controller.blurred) {
    //   // post(this.model.name, "reset", this.model.radius, this.model.gravity, model.friction, model.omega, model.thetaProp.value, model.velocityProp.value, model.velocityEQ, model.thetaEQ, model.id)
    //   this.reset()
    //   console.log("reset345345345")
    // }
    if (!this.model.paused) {
      // console.log(this.updateDomNodePosition())

      // let x = this.updateDomNodePosition().x
      // let y = this.updateDomNodePosition().y
      // console.log(this.updateDomNodePosition())

      // If the simulation was not able to load for WebGL, bail out
      // if (!this.sceneNode) {
      //   return;
      // }

      // groupBalls.add(this.ballsTest)
      // console.log(this.domNode.leftTop)

      this.hoop.rotation.y = this.model.rotation;
      this.hoopTest.rotation.y = this.model.rotation;
      // console.log(this.layoutBounds.maxY)
      // this.hoop.rotateY( dt*this.omega.value);

      const cords = this.getBallPos(3 * Math.PI / 2 + this.model.angle, 1.5)
      this.ball.position.set(cords[0] * Math.cos(this.model.rotation) - 5, cords[1] + 1.5, -cords[0] * Math.sin(this.model.rotation));
      const cordsTest = this.getBallPos(3 * Math.PI / 2 + this.model.angleTest, 1.5)
      // this.ballTest.position.set(cordsTest[0] * Math.cos(this.model.rotation) - 5, cordsTest[1] - 2, -cordsTest[0] * Math.sin(this.model.rotation));
      this.ballTest.position.set(cordsTest[0] * Math.cos(this.model.rotation) - 5, cordsTest[1] - 2, -cordsTest[0] * Math.sin(this.model.rotation));
      if (this.project) {
        this.ballsCords.push(this.model.angle);
        this.ballsCords.shift();
      }
      let xyz = { x: cords[0] * Math.cos(this.model.rotation) - 5, y: cords[1] + 1.5, z: -cords[0] * Math.sin(this.model.rotation) };
      // ball.position.set(xyz.x,xyz.y,xyz.z);
      this.prevCords.push([xyz.x, xyz.y, xyz.z]);
      this.prevCords.shift();
      for (let i = 0; i < this.trailLen; i++) {
        if (this.prevCords[i] != 999) {
          if (this.project) {
            let tempCord = this.getBallPos(this.ballsCords[i] + 3 * Math.PI / 2, 1.5);
            this.balls[i].position.set(tempCord[0] * Math.cos(this.model.rotation) - 5, tempCord[1] + 1.5, -tempCord[0] * Math.sin(this.model.rotation))
          } else {
            this.balls[i].position.set(this.prevCords[i][0], this.prevCords[i][1], this.prevCords[i][2])
          }
        }
      }

      if (this.project) {
        this.ballsCordsTest.push(this.model.angleTest);
        this.ballsCordsTest.shift();
      }
      let xyzTest = { x: cordsTest[0] * Math.cos(this.model.rotation) - 5, y: cordsTest[1] - 2, z: -cordsTest[0] * Math.sin(this.model.rotation) };
      // ball.position.set(xyz.x,xyz.y,xyz.z);
      this.prevCordsTest.push([xyzTest.x, xyzTest.y, xyzTest.z]);
      this.prevCordsTest.shift();
      for (let i = 0; i < this.trailLen; i++) {
        if (this.prevCordsTest[i] != 999) {
          if (this.project) {
            let tempCord = this.getBallPos(this.ballsCordsTest[i] + 3 * Math.PI / 2, 1.5);
            this.ballsTest[i].position.set(tempCord[0] * Math.cos(this.model.rotation) - 5, tempCord[1] - 2, -tempCord[0] * Math.sin(this.model.rotation))
          } else {
            this.ballsTest[i].position.set(this.prevCordsTest[i][0], this.prevCordsTest[i][1], this.prevCordsTest[i][2])
          }
        }
      }

      const margin = { top: this.graphSize / 35, right: 30, bottom: this.graphSize / (35 / 3), left: 60 };
      const width = this.graphSize - margin.left - margin.right;
      const height = this.graphSize - margin.top - margin.bottom;
      // const x = d3.scaleLinear()
      //   .domain([0,this.model.graphLen])
      //   .range([ 0, 310]);
      const xRef = d3.scaleLinear()
        .domain([0, this.model.graphLen])
        .range([margin.left, width + margin.left]);
      const xTest = d3.scaleLinear()
        .domain([0, this.model.graphLen])
        .range([margin.left, width + margin.left]);
      const minYTref = d3.min(this.model.graphData.data, (d: { theta: any; }) => d.theta)
      const maxYTref = d3.max(this.model.graphData.data, (d: { theta: any; }) => d.theta)
      const minYTtest = d3.min(this.model.graphDataTest.data, (d: { theta: any; }) => d.theta)
      const maxYTtest = d3.max(this.model.graphDataTest.data, (d: { theta: any; }) => d.theta)
      const minYVref = d3.min(this.model.graphData.data, (d: { velocity: any; }) => d.velocity)
      const maxYVref = d3.max(this.model.graphData.data, (d: { velocity: any; }) => d.velocity)
      const minYVtest = d3.min(this.model.graphDataTest.data, (d: { velocity: any; }) => d.velocity)
      const maxYVtest = d3.max(this.model.graphDataTest.data, (d: { velocity: any; }) => d.velocity)
      const yRef = d3.scaleLinear()
        .domain([maxYTref, minYTref])
        .range([margin.bottom, height - margin.bottom]);
      const yTest = d3.scaleLinear()
        .domain([maxYTtest, minYTtest])
        .range([margin.bottom, height - margin.bottom]);
      const yVref = d3.scaleLinear()
        .domain([maxYVref, minYVref])
        .range([margin.bottom, height - margin.bottom]);
      const yVtest = d3.scaleLinear()
        .domain([maxYVtest, minYVtest])
        .range([margin.bottom, height - margin.bottom]);
      this.refThetaGraph.element.children[6].setAttribute('cx', xRef(this.model.timer));
      this.refThetaGraph.element.children[6].setAttribute('cy', yRef(this.model.angle));
      this.testThetaGraph.element.children[6].setAttribute('cx', xTest(this.model.timer));
      this.testThetaGraph.element.children[6].setAttribute('cy', yTest(this.model.angleTest));

      this.refVelocityGraph.element.children[6].setAttribute('cx', xRef(this.model.timer));
      this.refVelocityGraph.element.children[6].setAttribute('cy', yVref(this.model.velocity));
      this.testVelocityGraph.element.children[6].setAttribute('cx', xTest(this.model.timer));
      this.testVelocityGraph.element.children[6].setAttribute('cy', yVtest(this.model.velocityTest));

      if (this.model.updateGraphs) {

        this.model.updateGraphs = false;


        // this.rootNode.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x, 0)
        // this.rootNode.leftTop = new phet.dot.Vector2(100, 100)
        // this.rootNode.addChild(new Rectangle(100, 100, 100, 100, {fill: new Color("blue")}))

        this.refVelocityGraph.detach()

        // this.refVelocityGraph = new phet.scenery.DOM(drawVelocity(this.model.graphData, this.model.graphLen, 'staticSim-velocity', 'reference', this.graphSize));
        this.refVelocityGraph = drawVelocity(this.model.graphData, this.model.graphLen, 'staticSim-velocity', 'reference', this.graphSize);
        // refVelocityGraph = drawVelocity(model.graphData, model.graphLen, 'staticSim-velocity', 'reference', this.graphSize);
        // this.refVelocityGraph.style.transformOrigin = 'left top 0px';
        // this.refVelocityGraph = refVelocityGraph
        this.refVelocityGraph = new phet.scenery.DOM(this.refVelocityGraph);
        this.refVelocityGraph._container.style.transformOrigin = 'left top 0px';

        // console.log(this.refVelocityGraph.element.children)




        this.addChild(this.refVelocityGraph);

        this.refThetaGraph.detach()
        this.refThetaGraph = new phet.scenery.DOM(drawTheta(this.model.graphData, this.model.graphLen, 'staticSim-theta', 'reference', this.graphSize));
        this.refThetaGraph._container.style.transformOrigin = 'left top 0px';
        // this.rootNode.addChild(this.refThetaGraph);
        this.addChild(this.refThetaGraph);

        this.testVelocityGraph.detach()
        this.testVelocityGraph = new phet.scenery.DOM(drawVelocity(this.model.graphDataTest, this.model.graphLen, 'staticSim-velocity', 'test', this.graphSize, this.beadOnCharts));
        this.testVelocityGraph._container.style.transformOrigin = 'left top 0px';
        this.addChild(this.testVelocityGraph);


        this.testThetaGraph.detach()
        this.testThetaGraph = new phet.scenery.DOM(drawTheta(this.model.graphDataTest, this.model.graphLen, 'variableSim-theta', 'test', this.graphSize, this.beadOnCharts));
        // this.rootNode.addChild(this.testThetaGraph);
        // this.rootNode.addChild(this.testThetaGraph);
        this.testThetaGraph._container.style.transformOrigin = 'left top 0px';
        this.addChild(this.testThetaGraph);

        // this.refVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x, 0)
        // this.refThetaGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x + this.graphSize, 0)
        // this.testVelocityGraph.leftTop = new phet.dot.Vector2(this.refVelocityGraph.leftBottom.x, this.refVelocityGraph.leftBottom.y + 10)
        // this.testThetaGraph.leftTop = new phet.dot.Vector2(this.refThetaGraph.leftBottom.x, this.refThetaGraph.leftBottom.y + 10)
        this.refVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x - 40, 30)
        this.refThetaGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x + this.graphSize - 50, 30)
        this.testVelocityGraph.leftTop = new phet.dot.Vector2(this.refVelocityGraph.leftBottom.x, this.refVelocityGraph.leftBottom.y + 10)
        this.testThetaGraph.leftTop = new phet.dot.Vector2(this.refThetaGraph.leftBottom.x - 10, this.refThetaGraph.leftBottom.y + 10)





        // this.refVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight / 2.2 - 20);
        // this.refVelocityGraph.centerBottom = new phet.dot.Vector2(850, 200);
        // window.addEventListener("resize", () => {

        // })
        // this.refVelocityGraph.centerBottom = new phet.dot.Vector2((window.innerWidth * 2.7) / 4, window.innerHeight / 2.2 - 20);
        // this.refVelocityGraph.leftTop = new phet.dot.Vector2(x,  0)





        // this.testVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x, 100);

        // this.refThetaGraph.leftTop = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight / 2.2 - 20);
        // this.testThetaGraph.leftTop = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight * 1.8 / 2.2 - 20);
        // window.addEventListener("resize", () => {
        //   this.refVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x + 100,  0)


        // this.testVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.rightTop.x, 100);

        // this.refThetaGraph.leftTop = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight / 2.2 - 20);
        // this.testThetaGraph.leftTop = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight * 1.8 / 2.2 - 20);
        // })

        // this.referenceGroup.detach()
        // this.referenceGroup = new phet.scenery.DOM(this.referenceGroup);
        // // this.rootNode.addChild(this.referenceGroup)
        // this.referenceGroup.leftCenter = new phet.dot.Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight * 1.8 / 2.2 - 20);


      }
      // this.addChild(this.rootNode)
      // window.addEventListener("resize", () => {
      //   // this.refVelocityGraph.leftTop = new phet.dot.Vector2(this.updateDomNodePosition().x,  0)
      //   this.refVelocityGraph.leftTop = new phet.dot.Vector2(this.domNode.leftTop.x,  0)
      //   console.log(this.updateDomNodePosition())
      //   console.log(this.domNode.leftTop.x)

      // })



      // this.sceneNode.render(undefined);
    }

  }

  getBallPos(angle: number, radius: number) {
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    return [x, y];
  }
}

beadOnHoop.register('BeadOnHoopScreenView', BeadOnHoopScreenView);























