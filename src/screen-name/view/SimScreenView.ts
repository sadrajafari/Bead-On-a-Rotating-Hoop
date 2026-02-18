import { ScreenView, ScreenViewOptions } from "scenerystack/sim";
import { SimModel } from "../model/SimModel.js";
import {
  InfoButton,
  QuestionBar,
  ResetAllButton,
} from "scenerystack/scenery-phet";
import {
  Rectangle,
  Color,
  HBox,
  RichText,
  VBox,
  Text,
  Circle,
} from "scenerystack/scenery";
import {
  HSlider,
  Range,
  Panel,
  RectangularToggleButton,
  Property,
  DerivedProperty,
  RoundToggleButton,
  Vector2,
  Node,
  Display,
  DOM,
  CarouselComboBox,
  RectangularPushButton,
} from "scenerystack";
// import ThreeIsometricNode from "../../../../mobius/js/ThreeIsometricNode.ts";
import { drawTheta, drawVelocity } from "../../common/makeGraphs.js";
import { verifyEq } from "../../common/verifyEq.js";
import EquationInput from "./EquationInput.js";
import post from "../../common/postData.js";
import * as THREE from "three";
import { questionButton } from "./questionSign.js";
import HelpDialog from "./HelpDialog.ts";

export class SimScreenView extends ScreenView {
  // public readonly sceneNoder!: Thre;
  public readonly sceneNode!: any;
  public readonly sceneNodeTest!: any;
  private readonly cubeMesh!: THREE.Mesh;
  private readonly cubeMeshTest!: THREE.Mesh;
  private readonly hoop!: THREE.Mesh;
  private readonly hoopTest!: THREE.Mesh;
  private readonly ball!: THREE.Mesh;
  private readonly ballTest!: THREE.Mesh;
  private omega: Property<number>;
  private model: SimModel;
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
  private box: THREE.BoxGeometry;
  // private focusedSlider: number;
  private changing: any;
  testGroup: THREE.Group;
  testGroupTotal: THREE.Group;
  new_div: THREE.Group;
  referenceGroup: any;
  helperNode: any;
  beadOnCharts: boolean = false;
  showBead: boolean;
  domNode: any;
  // x: number;
  // y: number
  selectedRunProperty: Property<string>;
  runHistory: {
    theta: any;
    velocity: any;
    r: number;
    g: number;
    k: number;
    omega: number;
    omegaRad: number;
    vdotLatex: string;
    thetadotLatex: string;
    vEQ: string;
    thetaEQ: string;
    // Add other properties as needed
  }[];
  updateComboBox: (runs: string[] | { name: string; index: number }[]) => void;
  vdotLatex: string;
  thetadotLatex: string;
  velocityField: any;
  thetaField: any;

  public constructor(model: SimModel, options?: ScreenViewOptions) {
    super(options);

    // this.layoutBounds.maxX = 1050;
    // Create a full-screen node
    // this.layoutBounds.maxX = window.innerWidth;
    // this.layoutBounds.maxY = window.innerHeight;
    // window.addEventListener('resize', () => {
    //   this.x = window.innerWidth
    //   this.y = window.innerHeight
    //   // this.layoutBounds.maxX = window.innerWidth;
    //   // this.layoutBounds.maxY = window.innerHeight;

    // })

    const pause = new Property<boolean>(false);
    const resume = new Property<boolean>(false);
    const resetInitials = new Property<boolean>(false);

    this.showBead = model.velocityEQ && model.thetaEQ ? true : false;

    const toggleRadius = 11;
    let spacePressed = false;
    // const pauseButton = new RectangularToggleButton(pause, false, true, { minWidth: 140, maxHeight: 20, content: new RichText('▐▐'), baseColor: "#f44949" })
    const pauseSign = new Text("⏸︎", { fontSize: 25, maxWidth: 40 });
    const pauseButton = new RectangularToggleButton(pause, false, true, {
      maxHeight: 100,
      minWidth: 35,
      scale: 1,
      xAlign: "center",
      yAlign: "center",
      content: pauseSign,
      baseColor: "#f44949",
    });
    // const ResumeButton = new RectangularToggleButton(resume, false, true, { minWidth: 140, maxHeight: 20, content: new RichText('▶'), baseColor: "#41b3d5" })
    const resumeSign = new Text("⏵︎", { fontSize: 25, maxWidth: 40 });
    // const ResumeButton = new RectangularToggleButton(resume, false, true, { minWidth: 140, maxHeight: 20, content: resumeSign, baseColor: "#41b3d5" })
    const ResumeButton = new RectangularToggleButton(resume, false, true, {
      maxHeight: 35,
      minWidth: 35,
      scale: 1,
      xAlign: "center",
      yAlign: "center",
      content: resumeSign,
      baseColor: "#41b3d5",
    });
    // this.addChild(pauseButton)
    // this.addChild(ResumeButton)

    ResumeButton.visible = false;

    const handleWheel = function (e: {
      ctrlKey: any;
      metaKey: any;
      preventDefault: () => void;
    }) {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    // let fontSize = window.innerWidth / 220 + window.innerHeight / 150 + 5;
    let fontSize = 18.5;
    let currentWidth = window.innerWidth;
    let currentheight = window.innerHeight;
    let speedRatio = model.simSpeedProp.value;
    this.beadOnCharts = model.velocityEQ && model.thetaEQ ? true : false;

    post(
      model.name,
      "start",
      model.radius,
      model.gravity,
      model.friction,
      model.omega,
      model.thetaProp.value,
      model.velocityProp.value,
      model.velocityEQ,
      model.thetaEQ,
      model.id,
    );

    // const resetAllButton = new ResetAllButton({
    //   listener: () => {
    //     this.interruptSubtreeInput(); // cancel interactions that may be in progress

    //     post(
    //       this.model.name,
    //       "reset",
    //       this.model.radius,
    //       this.model.gravity,
    //       this.model.friction,
    //       this.model.omega,
    //       this.model.thetaProp.value,
    //       this.model.velocityProp.value,
    //       this.model.velocityEQ,
    //       this.model.thetaEQ,
    //       this.model.id,
    //     );

    //     model.reset();
    //     this.reset();
    //     this.model.paused = false;
    //     pauseButton.visible = true;
    //     ResumeButton.visible = false;
    //     update = true;
    //     if (
    //       model.thetaEQ != "" &&
    //       model.velocityEQ != "" &&
    //       (thetaPrevious != model.thetaEQ ||
    //         velocityPrevious != model.velocityEQ)
    //     ) {
    //       this.showBead = true;
    //       this.beadOnCharts = model.velocityEQ && model.thetaEQ ? true : false;

    //       thetaPrevious = model.thetaEQ;
    //       velocityPrevious = model.velocityEQ;
    //     }
    //     if (
    //       model.thetaEQ.length == 0 ||
    //       model.velocityEQ.length === 0 ||
    //       model.velocityEQ === "" ||
    //       model.thetaEQ === ""
    //     ) {
    //       this.showBead = false;
    //       this.beadOnCharts = false;
    //     }
    //   },
    // });

    const resetAllButton = new RectangularPushButton({
      content: new Text("⏮", { fontSize: 20, fill: "black" }),
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress

        post(
          this.model.name,
          "reset",
          this.model.radius,
          this.model.gravity,
          this.model.friction,
          this.model.omega,
          this.model.thetaProp.value,
          this.model.velocityProp.value,
          this.model.velocityEQ,
          this.model.thetaEQ,
          this.model.id,
        );

        model.reset();
        this.reset();
        this.model.paused = false;
        pauseButton.visible = true;
        ResumeButton.visible = false;
        update = true;
        if (
          model.thetaEQ != "" &&
          model.velocityEQ != "" &&
          (thetaPrevious != model.thetaEQ ||
            velocityPrevious != model.velocityEQ)
        ) {
          this.showBead = true;
          this.beadOnCharts = model.velocityEQ && model.thetaEQ ? true : false;

          thetaPrevious = model.thetaEQ;
          velocityPrevious = model.velocityEQ;
        }
        if (
          model.thetaEQ.length == 0 ||
          model.velocityEQ.length === 0 ||
          model.velocityEQ === "" ||
          model.thetaEQ === ""
        ) {
          this.showBead = false;
          this.beadOnCharts = false;
        }
      },
      minWidth: 35,
      minHeight: 35,
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10,
    });

    let update = true;
    const reset = (value_changed = "") => {
      model.reset(value_changed !== "" ? value_changed : "");
      this.reset();
      update = true;

      if (
        model.thetaEQ != "" &&
        model.velocityEQ != "" &&
        (thetaPrevious != model.thetaEQ || velocityPrevious != model.velocityEQ)
      ) {
        this.showBead = true;
        this.beadOnCharts = model.velocityEQ && model.thetaEQ ? true : false;

        thetaPrevious = model.thetaEQ;
        velocityPrevious = model.velocityEQ;
      }
      if (
        model.thetaEQ.length == 0 ||
        model.velocityEQ.length === 0 ||
        model.velocityEQ === "" ||
        model.thetaEQ === ""
      ) {
        this.showBead = false;
        this.beadOnCharts = false;
      }
      // pause.set(false);
      // resume.set(false)
    };

    resetInitials.lazyLink((e) => {
      this.model.radiusProp.value = 0.5;
      this.model.gravityProp.value = 10;
      this.model.frictionProp.value = 5;
      this.model.omegaRadsProp.value = 4.45;
      // this.model.omegaProp.value = 1000;
      this.model.thetaProp.value = 5;
      this.model.velocityProp.value = 0.6;
      reset("reset to initials");
    });
    const resteInitials = new Text("Reset to initials", { fontSize: 15 });
    const resetInitialsButton = new RectangularToggleButton(
      resetInitials,
      false,
      true,
      {
        minWidth: 140,
        maxHeight: 20,
        content: resteInitials,
        baseColor: "#41b3d5",
      },
    );
    // this.addChild(resetInitialsButton)

    pause.lazyLink((e) => {
      this.model.paused = !this.model.paused;
      post(
        model.name,
        this.model.paused ? "paused" : "resume",
        model.radius,
        model.gravity,
        model.friction,
        model.omega,
        model.thetaProp.value,
        model.velocityProp.value,
        model.velocityEQ,
        model.thetaEQ,
        model.id,
      );

      pauseButton.visible = !pauseButton.visible;
      ResumeButton.visible = !ResumeButton.visible;
    });
    resume.lazyLink((e) => {
      this.model.paused = !this.model.paused;
      post(
        model.name,
        this.model.paused ? "paused" : "resume",
        model.radius,
        model.gravity,
        model.friction,
        model.omega,
        model.thetaProp.value,
        model.velocityProp.value,
        model.velocityEQ,
        model.thetaEQ,
        model.id,
      );

      pauseButton.visible = !pauseButton.visible;
      ResumeButton.visible = !ResumeButton.visible;
    });

    window.addEventListener("keypress", (event) => {
      if (event.key == " ") {
        spacePressed = !spacePressed;
        this.model.paused = !this.model.paused;
        post(
          model.name,
          this.model.paused ? "paused" : "resume",
          model.radius,
          model.gravity,
          model.friction,
          model.omega,
          model.thetaProp.value,
          model.velocityProp.value,
          model.velocityEQ,
          model.thetaEQ,
          model.id,
        );
        pauseButton.visible = !pauseButton.visible;
        ResumeButton.visible = !ResumeButton.visible;
      }
    });

    // graphsize may be deleted
    // this.graphSize = window.innerWidth / 4;
    // this.graphSize = this.layoutBounds.maxX / 3.8
    this.graphSize = this.layoutBounds.maxX / 3.7;
    this.model = model;
    this.omega = model.omegaProp;
    this.rotation = 0;

    const refThetaGraph = document.createElement("div");
    document.body.appendChild(refThetaGraph);
    const testThetaGraph = document.createElement("div");
    document.body.appendChild(testThetaGraph);
    const refVelocityGraph = document.createElement("div");
    document.body.appendChild(refVelocityGraph);
    const testVelocityGraph = document.createElement("div");
    document.body.appendChild(testVelocityGraph);

    this.rootNode = new Node();

    const plotDis = new Display(this.rootNode);

    plotDis.updateOnRequestAnimationFrame();
    plotDis.resizeOnWindowResize();

    const rootNode = new Node();
    const display = new Display(rootNode);

    document.body.appendChild(display.domElement);
    display.updateOnRequestAnimationFrame();
    display.resizeOnWindowResize();

    const splitLine = document.createElement("div");

    refVelocityGraph.id = "staticSim-velocity";
    this.refVelocityGraph = drawVelocity(
      model.graphData,
      model.graphDataTest,
      model.graphLen,
      "staticSim-velocity",
      "reference",
      this.graphSize,
      this.beadOnCharts,
    );
    // refVelocityGraph = drawVelocity(model.graphData, model.graphLen, 'staticSim-velocity', 'reference', this.graphSize);
    this.refVelocityGraph.style.transformOrigin = "left top 0px";

    this.refVelocityGraph.offsetWidth = 250;
    this.refVelocityGraph.offsetHeight = 250;
    this.refVelocityGraph = new DOM(this.refVelocityGraph);
    // this.refVelocityGraph = new DOM(refVelocityGraph);
    // this.graphSize = this.layoutBounds.maxX / 4

    // this.rootNode.addChild(this.refVelocityGraph);
    this.addChild(this.refVelocityGraph);
    this.refVelocityGraph.centerBottom = new Vector2(
      (window.innerWidth * 2.7) / 4,
      window.innerHeight / 2.2 - 20,
    );

    this.refVelocityGraph.centerBottom = new Vector2(
      (window.innerWidth * 2.7) / 4,
      window.innerHeight / 2.2 - 20,
    );

    refThetaGraph.id = "staticSim-theta";
    this.refThetaGraph = drawTheta(
      model.graphData,
      model.graphDataTest,
      model.graphLen,
      "staticSim-theta",
      "reference",
      this.graphSize,
      this.beadOnCharts,
    );
    this.refThetaGraph.offsetWidth = 250;
    this.refThetaGraph.offsetHeight = 250;
    this.refThetaGraph = new DOM(this.refThetaGraph);

    this.addChild(this.refThetaGraph);
    // HERE
    // this.refThetaGraph.centerBottom = new Vector2(this.testVelocityGraph.leftBottom.x + this.graphSize * 1.45, window.innerHeight / 2.2 - 20);
    this.refThetaGraph.centerBottom = new Vector2(
      this.refVelocityGraph.leftBottom.x + this.graphSize * 1.45,
      window.innerHeight / 2.2 - 20,
    );

    const buttonRadius = new Property<boolean>(false);
    const buttonGravity = new Property<boolean>(false);
    const buttonFriction = new Property<boolean>(false);
    const buttonOmega = new Property<boolean>(false);
    const buttonOmegaRads = new Property<boolean>(false);
    const buttonTheta = new Property<boolean>(false);
    const buttonVelocity = new Property<boolean>(false);
    const buttonSimSpeed = new Property<boolean>(false);

    // let toggleRadius = 13;
    const exText = new Text("radius", { fontSize: fontSize });
    const exRichText = new RichText("✎");
    const simSpeedSlider = new HSlider(
      model.simSpeedProp,
      new Range(0.1, Number(2)),
    );

    const sliderGap = new Rectangle(0, 0, 0, 10);
    // fontSize = window.innerWidth/50;
    const radius = new RichText("radius (<i>r</i>)");
    const gravity = new RichText("gravity (<i>g</i>)");
    const friction = new RichText("friction (<i>k</i>)");
    const ang = new RichText("ang. vel. (<i>ω</i>)");
    const ang1 = new RichText("ang. vel. (<i>ω</i>)");
    const angP = new RichText("ang. pos. (<i>θ₀</i>)");
    const velocity = new RichText("velocity (<i>v₀</i>)");

    const textVBoxConstants = new VBox({
      align: "center",
      children: [
        // new Rectangle(0, 0, 120, 0),
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - radius.height + sliderGap.height,
        ),

        radius,
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - radius.height + sliderGap.height,
        ),

        gravity,
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - radius.height + sliderGap.height,
        ),

        friction,
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - radius.height + sliderGap.height,
        ),

        ang,
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - radius.height + sliderGap.height,
        ),

        // ang1,
        // new Rectangle(0, 0, 0, simSpeedSlider.height - radius.height + sliderGap.height),
      ],
    });

    const textVBoxInitial = new VBox({
      align: "center",
      children: [
        new Rectangle(
          0,
          0,
          120,
          simSpeedSlider.height - radius.height + sliderGap.height,
        ),

        angP,
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - radius.height + sliderGap.height,
        ),

        velocity,
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - radius.height + sliderGap.height,
        ),
      ],
    });

    const radiusSlider = new HSlider(
      model.radiusProp,
      new Range(0.1, Number(1)),
    );

    const sliderVboxConstants = new VBox({
      children: [
        new Rectangle(0, 0, 0, 10),
        radiusSlider,
        // new HSlider(model.radiusProp, new Range(0.1, Number(100))),
        new Rectangle(0, 0, 0, 10),
        new HSlider(model.gravityProp, new Range(0, Number(25))),
        new Rectangle(0, 0, 0, 10),
        new HSlider(model.frictionProp, new Range(0, Number(100))),
        new Rectangle(0, 0, 0, 10),
        new HSlider(model.omegaRadsProp, new Range(0, Number(20))),
        new Rectangle(0, 0, 0, 10),
        // new HSlider(model.omegaProp, new Range(0, Number(1145.92))),
        // new Rectangle(0, 0, 0, 10),
      ],
    });

    const sliderVboxInitial = new VBox({
      children: [
        new Rectangle(0, 0, 0, 5),
        new HSlider(model.thetaProp, new Range(0, Number(360))),
        new Rectangle(0, 0, 0, 5),
        new HSlider(model.velocityProp, new Range(0, Number(10))),
        new Rectangle(0, 0, 0, 5),
      ],
    });

    const buttonVBoxConstants = new VBox({
      children: [
        // new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height - 2),
        new Rectangle(0, 0, 0, 20),
        new RoundToggleButton(buttonRadius, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 120, maxWidth: 15 }),
        }),

        // new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),
        new Rectangle(0, 0, 0, 22),
        new RoundToggleButton(buttonGravity, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 20, maxWidth: 15 }),
        }),

        // new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),
        new Rectangle(0, 0, 0, 22),
        new RoundToggleButton(buttonFriction, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 20, maxWidth: 15 }),
        }),

        // new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),
        new Rectangle(0, 0, 0, 22),
        new RoundToggleButton(buttonOmegaRads, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 20, maxWidth: 15 }),
        }),

        // new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height + sliderGap.height - 3),
        // new Rectangle(0, 0, 0, 22),
        // new RoundToggleButton(buttonOmega, false, true, { radius: toggleRadius, content: new Text('✎', { fontSize: 20, maxWidth: 15 }) }),

        new Rectangle(0, 0, 0, 20),
        // new Rectangle(0, 0, 0, simSpeedSlider.height - exRichText.height),
      ],
    });

    const buttonVBoxInitial = new VBox({
      children: [
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - exRichText.height + sliderGap.height - 2,
        ),
        new RoundToggleButton(buttonTheta, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 20, maxWidth: 15 }),
        }),

        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - exRichText.height + sliderGap.height - 3,
        ),
        new RoundToggleButton(buttonVelocity, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 20, maxWidth: 15 }),
        }),

        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - exRichText.height + sliderGap.height - 3,
        ),
      ],
    });

    const dynamicTextVBoxConstants = new VBox({
      align: "left",
      children: [
        new Rectangle(0, 0, 120, 0),
        new HBox({
          children: [
            new Rectangle(0, 0, 10, 0),
            // new RichText(new DerivedProperty([model.radiusProp], (value) => { return String(Number(value).toFixed(2)) })),
            new Text(
              new DerivedProperty([model.radiusProp], (value) => {
                return String(Number(value).toFixed(2));
              }),
              { fontSize: fontSize },
            ),
            new Rectangle(0, 0, 10, 0),

            new Text(" m", { fontSize: fontSize }),
          ],
        }),
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - exText.height + sliderGap.height,
        ),
        new HBox({
          children: [
            new Rectangle(0, 0, 10, 0),
            // new RichText(new DerivedProperty([model.gravityProp], (value) => { return String(Number(value).toFixed(2)) })),
            new Text(
              new DerivedProperty([model.gravityProp], (value) => {
                return String(Number(value).toFixed(2));
              }),
              { fontSize: fontSize },
            ),
            new Rectangle(0, 0, 10, 0),
            new Text(" m/s²", { fontSize: fontSize }),
          ],
        }),
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - exText.height + sliderGap.height,
        ),
        new HBox({
          children: [
            new Rectangle(0, 0, 10, 0),
            // new RichText(new DerivedProperty([model.frictionProp], (value) => { return String(Number(value).toFixed(2)) })),
            new Text(
              new DerivedProperty([model.frictionProp], (value) => {
                return String(Number(value).toFixed(2));
              }),
              { fontSize: fontSize },
            ),
            new Rectangle(0, 0, 10, 0),
            new Text(" 1/s", { fontSize: fontSize }),
          ],
        }),
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - exText.height + sliderGap.height,
        ),
        new HBox({
          children: [
            new Rectangle(0, 0, 10, 0),
            // new RichText(new DerivedProperty([model.omegaRadsProp], (value) => { return String(Number(value).toFixed(2)) })),
            new Text(
              new DerivedProperty([model.omegaRadsProp], (value) => {
                return String(Number(value).toFixed(2));
              }),
              { fontSize: fontSize },
            ),
            new Rectangle(0, 0, 10, 0),
            new Text(" rad/s", { fontSize: fontSize }),
          ],
        }),
        // new Rectangle(0, 0, 0, simSpeedSlider.height - exText.height + sliderGap.height),
        // new HBox({
        //   children: [
        //     new Rectangle(0, 0, 10, 0),
        //     // new RichText(new DerivedProperty([model.omegaProp], (value) => { return String(Number(value).toFixed(2)) })),
        //     new Text(new DerivedProperty([model.omegaProp], (value) => { return String(Number(value).toFixed(2)) }), { fontSize: fontSize }),
        //     new Rectangle(0, 0, 10, 0),
        //     new Text(" °/s", { fontSize: fontSize })
        //   ]
        // }),
      ],
    });
    const dynamicTextVBoxInitial = new VBox({
      align: "left",
      children: [
        new Rectangle(0, 0, 85, 0),
        new HBox({
          children: [
            new Rectangle(0, 0, 3, 0),
            // new RichText(new DerivedProperty([model.thetaProp], (value) => { return String(Number(value).toFixed(2)) })),
            new Text(
              new DerivedProperty([model.thetaProp], (value) => {
                return String(Number(value).toFixed(2));
              }),
              { fontSize: fontSize },
            ),
            new Text(" °", { fontSize: fontSize }),
          ],
        }),
        new Rectangle(
          0,
          0,
          0,
          simSpeedSlider.height - exText.height + sliderGap.height,
        ),
        new HBox({
          children: [
            new Rectangle(0, 0, 3, 0),
            // new RichText(new DerivedProperty([model.velocityProp], (value) => { return String(Number(value).toFixed(2)) })),
            new Text(
              new DerivedProperty([model.velocityProp], (value) => {
                return String(Number(value).toFixed(2));
              }),
              { fontSize: fontSize },
            ),
            new Text(" m/s", { fontSize: fontSize }),
          ],
        }),
      ],
    });
    // const panelWidth = new HBox({ children: [textVBoxConstants, sliderVboxConstants, buttonVBoxConstants, dynamicTextVBoxConstants] }).width

    const titleInitial = new Text("Initial Conditions", { fontSize: fontSize });

    const titleConstants = new Text("Constants", { fontSize: fontSize });

    const panelConstants = new Panel(
      new VBox({
        align: "center",
        children: [
          titleConstants,
          new HBox({
            children: [
              textVBoxConstants,
              sliderVboxConstants,
              buttonVBoxConstants,
              dynamicTextVBoxConstants,
            ],
          }),
        ],
      }),
      {
        fill: new Color(210, 210, 210),
      },
    );
    // const panelInitial = new Panel(new VBox({ align: 'center', children: [titleInitial, new HBox({ children: [textVBoxInitial, sliderVboxInitial, new HBox({ children: [buttonVBoxInitial] }), new Rectangle(0, 0, 10, 0), dynamicTextVBoxInitial] }), new Rectangle(0, 0, panelWidth, 0)] }), { fill: new Color(210, 210, 210), maxWidth: panelConstants.width, minHeight: window.innerHeight / 20, minWidth: panelConstants.width })
    const panelInitial = new Panel(
      new VBox({
        align: "center",
        children: [
          titleInitial,
          new HBox({
            children: [
              textVBoxInitial,
              sliderVboxInitial,
              new HBox({ children: [buttonVBoxInitial] }),
              new Rectangle(0, 0, 10, 0),
              dynamicTextVBoxInitial,
            ],
          }),
        ],
      }),
      {
        fill: new Color(210, 210, 210),
        maxWidth: panelConstants.width,
        minHeight: window.innerHeight / 20,
        minWidth: panelConstants.width,
      },
    );
    this.addChild(panelInitial);

    this.addChild(panelConstants);

    panelConstants.leftTop = new Vector2(0, 0);

    panelInitial.maxWidth = this.layoutBounds.maxX / 3.5;
    panelConstants.maxWidth = this.layoutBounds.maxX / 3.5;

    const velocityDOM = document.createElement("span");
    const thetaDOM = document.createElement("span");
    velocityDOM.classList.add("my-mathquill-input");
    thetaDOM.classList.add("my-mathquill-input");

    const velocityField = new EquationInput(this.sceneNode, velocityDOM, {
      initialText: model.velocityEQ,
      model: model,
      equation: "velocityEQ",
      verifyEq: verifyEq,
      thetaElement: thetaDOM,
      velocityElement: velocityDOM,
      dom: velocityDOM,
      focusedEq: this.focusedEq,
    });
    this.velocityField = velocityField;

    const thetaField = new EquationInput(this.sceneNode, thetaDOM, {
      initialText: model.thetaEQ,
      model: model,
      equation: "thetaEQ",
      verifyEq: verifyEq,
      thetaElement: thetaDOM,
      velocityElement: velocityDOM,
      dom: thetaDOM,
      focusedEq: this.focusedEq,
    });
    this.thetaField = thetaField;

    this.focusedEq = [
      model.velocityEQ,
      velocityField,
      velocityField.writeToEquation,
    ];
    const focusedEq = [this.focusedEq];
    const velBox = new HBox({ preferredWidth: 30, children: [velocityField] });

    velBox.addInputListener({
      // try making it just to size of mathquil inputs? and using that?

      down: function (event: any) {
        // Check if the click was inside your node
        velocityField.mathField.focus();
        focusedEq[0][0] = model.velocityEQ;
        focusedEq[0][1] = velocityField;
      },
    });
    const thetaBox = new HBox({ children: [thetaField] });
    thetaBox.addInputListener({
      // try making it just to size of mathquil inputs? and using that?
      down: function (event: any) {
        // Check if the click was inside your node
        thetaField.mathField.focus();
        focusedEq[0][0] = model.thetaEQ;
        focusedEq[0][1] = thetaField;
      },
    });

    const thetadot = document.createElement("span");
    // thetadot.innerHTML = '<span>θ&#x307;</span>=  ';
    thetadot.innerHTML = `<span style="position: relative; display: inline-block;">
    <span>θ</span>
    <span style="position: absolute; top: -0.8em; left: 50%; transform: translateX(-50%);">.</span>
    </span>=  `;
    thetadot.style.fontSize = `${fontSize + 5}px`;
    const thetadotDOM = new DOM(thetadot);

    const vdot = document.createElement("span");
    vdot.innerHTML = "<span>v&#x307;</span>=  ";
    vdot.style.fontSize = `${fontSize + 5}px`;
    const vdotDOM = new DOM(vdot);

    const buttonAddTheta = new Property<boolean>(false);
    buttonAddTheta.lazyLink(() => {
      this.focusedEq[1].writeToEquation("\\theta");
      this.focusedEq[0] = this.focusedEq[1]
        .getElementValue()
        .replaceAll("\\theta", " h")
        .replaceAll("\\omega", " o");

      this.focusedEq[1].mathField.focus();
    });

    const buttonAddOmega = new Property<boolean>(false);
    buttonAddOmega.lazyLink(() => {
      this.focusedEq[1].writeToEquation("\\omega");
      this.focusedEq[0] = this.focusedEq[1]
        .getElementValue()
        .replaceAll("\\theta", " h")
        .replaceAll("\\omega", " o");

      this.focusedEq[1].mathField.focus();
    });

    const buttonAddThetaDOM = new RectangularToggleButton(
      buttonAddTheta,
      false,
      true,
      {
        minWidth: 300,
        minHeight: 20,
        content: new RichText("insert (θ) into equation"),
      },
    );

    const buttonAddOmegaDOM = new RectangularToggleButton(
      buttonAddOmega,
      false,
      true,
      {
        minWidth: 300,
        minHeight: 20,
        content: new RichText("insert (ω) into equation"),
      },
    );
    // Info button for equation help
    const fillEquationsCallback = (equations: { v: string; theta: string }) => {
      // Update the velocity equation field
      this.velocityField.mathField.latex(equations.v);

      // Update the theta equation field
      this.thetaField.mathField.latex(equations.theta);

      // Update the model with the new equations
      this.model.velocityEQ = equations.v;
      this.model.thetaEQ = equations.theta;

    };

    const helpDialog = new HelpDialog(this.tandem, fillEquationsCallback);

    const questionNode = questionButton();

    // const helpDialog = new HelpDialog(undefined as any);

    questionNode.addInputListener({
      down: () => {
        helpDialog.show();
      },
    });

    // questionNode.rightTop = new Vector2(this.layoutBounds.maxX - 20, 20);

    // this.addChild(questionNode);
    // --------------------------------------------
    const testEquation = new Text("Test Equations", { fontSize: fontSize + 5 });
    const equationPanel = new Panel(
      new VBox({
        minimumWidth: 400,
        align: "center",
        children: [
          new HBox({
            align: "center",
            children: [testEquation, new Rectangle(0, 0, 10, 10), questionNode],
          }),
          new Rectangle(0, 0, 10, 10),
          new VBox({
            align: "right",
            children: [
              buttonAddThetaDOM,
              new Rectangle(0, 0, 50, 5),
              buttonAddOmegaDOM,
            ],
          }),
          new Rectangle(0, 0, 0, 10),
          new HBox({ children: [vdotDOM, velBox] }),
          new Rectangle(0, 0, 0, 10),
          new HBox({ children: [thetadotDOM, thetaBox] }),

          new Rectangle(0, 0, 450, 0),
        ],
      }),
      {
        fill: new Color(210, 210, 210),
        maxHeight: 400,
        align: "center",
        minHeight: 100,
        maxWidth: panelInitial.rightTop.x,
        minWidth: panelInitial.width,
      },
    );
    this.addChild(equationPanel);

    panelInitial.centerTop = new Vector2(
      panelConstants.centerBottom.x,
      panelConstants.centerBottom.y + 10,
    );
    panelInitial.centerTop = new Vector2(
      panelConstants.centerBottom.x,
      panelConstants.centerBottom.y + 10,
    );
    panelInitial.centerTop = new Vector2(
      panelConstants.centerBottom.x,
      panelConstants.centerBottom.y + 10,
    );

    this.project = true;
    this.projectTemp = this.project;
    const projectSwitch = new Property<boolean>(this.project);
    projectSwitch.lazyLink(() => {
      this.projectTemp = !this.projectTemp;
    });
    const simSpeedTitle = new Text("simSpeed", { fontSize: fontSize });

    let speedRate = new Text(
      new DerivedProperty([model.simSpeedProp], (value) => {
        return String(Number(Math.abs(value)).toFixed(2));
      }),
      { fontSize: fontSize },
    );
    window.addEventListener("keypress", (e) => {
      if (e.key == " ") {
        speedRate = new Text("d", { fontSize: fontSize });
      }
    });
    const measuresign = new Text("x", { fontSize: fontSize });
    const visualBox = new VBox({
      align: "center",
      children: [
        new HBox({
          children: [
            simSpeedTitle,
            simSpeedSlider,
            new RoundToggleButton(buttonSimSpeed, false, true, {
              radius: 12,
              content: new Text("✎", { fontSize: 20, maxWidth: 15 }),
            }),

            // new Text('✎', { fontSize: 20, textAlign: 'center' }),
            new Rectangle(
              0,
              0,
              0,
              simSpeedSlider.height - exRichText.height + sliderGap.height,
            ),
            new HBox({
              children: [new Rectangle(0, 0, 10, 0), speedRate, measuresign],
            }),
          ],
        }),
      ],
    });

    const referenceLabel = new Text("Reference:", { fontSize: fontSize });
    const redBall = new Circle(8, { fill: new Color(255, 0, 0) });
    this.addChild(redBall);

    const testLabel = new Text("Test:", { fontSize: fontSize });
    const blueBall = new Circle(8, { fill: new Color(0, 0, 255) });
    this.addChild(blueBall);

    // visualBox.leftTop = new Vector2(0, equationPanel.centerY + 10);

    resetAllButton.leftTop = new Vector2(0, equationPanel.rightBottom.y + 10);

    referenceLabel.leftCenter = new Vector2(
      panelConstants.rightCenter.x + 140,
      20,
    );
    redBall.leftCenter = new Vector2(panelConstants.rightCenter.x + 120, 20);

    const lineRect = new Rectangle(0, 0, this.layoutBounds.maxX / 3.5, 2, {
      fill: new Color("black"),
    });

    this.addChild(lineRect);

    this.addChild(referenceLabel);

    this.addChild(testLabel);

    const testGroup = new THREE.Group();
    const refGroup = new THREE.Group();

    //

    //
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    const camera = new THREE.PerspectiveCamera(
      30,
      this.layoutBounds.maxX / this.layoutBounds.maxY,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    // renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
    renderer.setSize(
      this.layoutBounds.maxX / 3.5,
      this.layoutBounds.maxY / 3.5,
    );

    document.body.appendChild(renderer.domElement);
    const domNode = new DOM(renderer.domElement);
    this.domNode = domNode;
    // this.addChild(domNode);
    this.addChild(this.domNode);

    const scene2 = new THREE.Scene();
    const camera2 = new THREE.PerspectiveCamera(
      30,
      this.layoutBounds.maxX / this.layoutBounds.maxY,
      0.1,
      1000,
    );
    const renderer2 = new THREE.WebGLRenderer({ alpha: true });
    // renderer2.setSize(window.innerWidth / 3, window.innerHeight / 3);
    renderer2.setSize(
      this.layoutBounds.maxX / 3.5,
      this.layoutBounds.maxY / 3.5,
    );

    window.addEventListener("resize", () => {
      // renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
      renderer.setSize(
        this.layoutBounds.maxX / 3.5,
        this.layoutBounds.maxY / 3.5,
      );
      renderer.setPixelRatio(window.devicePixelRatio);
      // renderer2.setSize(window.innerWidth / 3, window.innerHeight / 3);
      renderer2.setSize(
        this.layoutBounds.maxX / 3.5,
        this.layoutBounds.maxY / 3.5,
      );
      renderer2.setPixelRatio(window.devicePixelRatio);
    });

    const domNode2 = new DOM(renderer2.domElement);
    this.addChild(domNode2);
    // this.addChild(rootNode)
    scene.add(camera);
    scene2.add(camera2);

    camera2.position.z = 5;

    // Resize the display to always fill the window
    display.resizeOnWindowResize();

    // Lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    const ambientLight2 = new THREE.AmbientLight(0x333333);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    const sunLight2 = new THREE.DirectionalLight(0xffffff, 1);
    sunLight2.position.copy(sunLight.position);
    sunLight.position.set(-1, 1.5, 0.8);
    sunLight2.position.set(-6, 1.5, 0.8);

    const moonLight = new THREE.DirectionalLight(0xffffff, 0.3);
    const moonLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    moonLight2.position.copy(moonLight.position);

    moonLight.position.set(2.0, 1.0, 2.5);
    moonLight2.position.set(2.0, 1.0, 2.5);

    const geometryHoop = new THREE.TorusGeometry(
      1.5,
      0.07,
      16,
      50,
      2 * Math.PI,
    );
    // const geometryHoop = new THREE.TorusGeometry(1.5, .07, 64, 128, 2 * Math.PI);
    // const materialHoop = new THREE.MeshLambertMaterial({ color: 0x44aa88, lightMapIntensity: .5 });
    // const materialHoop = new THREE.MeshLambertMaterial({ color: "rgb(153, 153, 153)", lightMapIntensity: .5 });
    const materialHoop = new THREE.MeshLambertMaterial({
      color: "rgb(156, 156, 156) ",
      lightMapIntensity: 0.5,
    });

    testGroup.position.set(5, 2, 0);

    refGroup.position.set(5, 2, 0);

    camera.position.set(-5, 1.5, 0);

    camera2.position.set(-5, 1.5, 5);

    refGroup.add(ambientLight);
    refGroup.add(sunLight);
    refGroup.add(moonLight);
    testGroup.add(ambientLight2);
    testGroup.add(sunLight2);
    testGroup.add(moonLight2);

    scene.add(refGroup);
    scene2.add(testGroup);

    this.hoop = new THREE.Mesh(geometryHoop, materialHoop);

    refGroup.position.set(0, 0, 0);
    this.hoop.position.set(-5, 1.5, 0);

    const geometryBall = new THREE.SphereGeometry(0.12, 8, 8);
    const materialBall = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    this.ball = new THREE.Mesh(geometryBall, materialBall);

    this.ball.position.set(1.5, 1.5, 0);

    refGroup.add(this.ball);
    refGroup.add(this.hoop);

    this.balls = [];
    this.ballsCords = [];
    this.trailLen = 40;
    for (let i = 0; i < this.trailLen; i++) {
      this.balls.push(
        new THREE.Mesh(
          new THREE.SphereGeometry((i / this.trailLen) * 0.12 + 0.01, 5, 5),
          new THREE.MeshLambertMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0 + i / this.trailLen,
            lightMapIntensity: 0.5,
          }),
        ),
      );
      this.ballsCords.push(999);
    }
    // @ts-ignore
    this.balls.forEach((e: Object3D<Event>) => {
      refGroup.add(e);
      e.position.set(99, 0, 0);
    });
    this.prevCords = [];
    this.prevCords.length = this.trailLen;
    this.prevCords.fill(999);

    this.ballsTest = [];
    this.ballsCordsTest = [];

    for (let i = 0; i < this.trailLen; i++) {
      // this.ballsTest.push(new THREE.Mesh(new THREE.SphereGeometry(i / this.trailLen * .12 + .01, 5, 5), new THREE.MeshLambertMaterial({ color: 0xff0000, transparent: true, opacity: 0 + i / this.trailLen, lightMapIntensity: .5 })));
      this.ballsTest.push(
        new THREE.Mesh(
          new THREE.SphereGeometry((i / this.trailLen) * 0.12 + 0.01, 5, 5),
          new THREE.MeshLambertMaterial({
            color: "blue",
            transparent: true,
            opacity: 0 + i / this.trailLen,
            lightMapIntensity: 0.5,
          }),
        ),
      );

      this.ballsCordsTest.push(999);
    }
    //

    let thetaPrevious = model.thetaEQ;
    let velocityPrevious = model.velocityEQ;

    setInterval(() => {
      if (update) {
        // @ts-ignore
        this.ballsTest.forEach((e: Object3D<Event>) => {
          testGroup.add(e);
          e.position.set(99, 0, 0);
          e.visible = this.showBead ? true : false;
        });
        this.ballTest.visible = this.showBead ? true : false;
        update = false;
      }
      // this.x = this.domNode.leftTop.x
      // this.y = this.domNode.leftTop.y
    }, 100);

    this.prevCordsTest = [];
    this.prevCordsTest.length = this.trailLen;
    this.prevCordsTest.fill(999);
    // -------------------------------------------------------------------TEST sim threejs

    const geometryHoopTest = new THREE.TorusGeometry(
      1.5,
      0.07,
      16,
      50,
      2 * Math.PI,
    );
    // const materialHoopTest = new THREE.MeshLambertMaterial({ color: 0x44aa88, lightMapIntensity: .5 });
    // const materialHoopTest = new THREE.MeshLambertMaterial({ color: "rgb(153, 153, 153) ", lightMapIntensity: .5 });
    const materialHoopTest = new THREE.MeshLambertMaterial({
      color: "rgb(173, 173, 173)",
      lightMapIntensity: 0.5,
    });
    this.hoopTest = new THREE.Mesh(geometryHoopTest, materialHoopTest);
    this.hoopTest.position.set(-5, -2.0, 0);
    testGroup.add(this.hoopTest);

    const geometryBallTest = new THREE.SphereGeometry(0.12, 8, 8);
    // const materialBallTest = new THREE.MeshLambertMaterial({ color: 0xff0000, lightMapIntensity: .5 });
    const materialBallTest = new THREE.MeshLambertMaterial({
      color: "blue",
      lightMapIntensity: 0.5,
    });
    this.ballTest = new THREE.Mesh(geometryBallTest, materialBallTest);
    this.ballTest.position.set(10, 10, 10);

    this.showBead ? testGroup.add(this.ballTest) : null;
    this.ballTest.visible = this.showBead ? true : false;
    const rootNodeClone = this.rootNode;

    // let changing = false;

    camera.position.z = 15;
    camera.zoom = 2.1;
    camera.updateProjectionMatrix();
    camera2.position.z = 15;

    testGroup.position.set(0, 3.5, 0);

    camera2.zoom = 2.1;
    camera2.updateProjectionMatrix();
    camera.near = 0.1;
    camera2.near = 0.1;
    camera.far = 1000;
    camera2.far = 1000;

    display.updateOnRequestAnimationFrame(() => {
      renderer.render(scene, camera);
      renderer2.render(scene2, camera2);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowUp" && model.simSpeedProp.value < 0.499) {
        model.simSpeedProp.value += 0.001;
        speedRatio += 0.01;
      }
      if (event.key === "ArrowDown" && model.simSpeedProp.value > 0.0) {
        model.simSpeedProp.value -= 0.001;
        speedRatio -= 0.01;
      }
      if (event.key === "r") {
        if (focusedEq[0][1].mathField.__controller.blurred) {
          post(
            model.name,
            "reset",
            model.radius,
            model.gravity,
            model.friction,
            model.omega,
            model.thetaProp.value,
            model.velocityProp.value,
            model.velocityEQ,
            model.thetaEQ,
            model.id,
          );
          reset();
        }
      }
    });

    var changing = false;
    var changingWhileOut = false;
    var changingWithId = [false, -1];

    for (var slider of sliderVboxConstants._children.concat(
      sliderVboxInitial._children,
    )) {
      if (slider !== simSpeedSlider) {
        slider.addInputListener({
          mousedown: function (event: { target: { _id: any } }) {
            changing = true;
            changingWithId[0] = true;
            changingWithId[1] = event.target._id;
          },
        });
      }
    }
    window.addEventListener("pointerup", () => {
      if (changingWithId[0]) {
        if (
          changingWithId[1] === 145 ||
          changingWithId[1] === 153 ||
          changingWithId[1] === 449 ||
          changingWithId[1] === 457
        ) {
          reset("radius changed");
          changingWithId[0] = false;
          changingWithId[1] = -1;
        } else if (
          changingWithId[1] === 161 ||
          changingWithId[1] === 169 ||
          changingWithId[1] === 465 ||
          changingWithId[1] === 473
        ) {
          reset("gravity changed");
          changingWithId[0] = false;
          changingWithId[1] = -1;
        } else if (
          changingWithId[1] === 176 ||
          changingWithId[1] === 184 ||
          changingWithId[1] === 480 ||
          changingWithId[1] === 488
        ) {
          reset("friction changed");
          changingWithId[0] = false;
          changingWithId[1] = -1;
        } else if (
          changingWithId[1] === 191 ||
          changingWithId[1] === 206 ||
          changingWithId[1] === 199 ||
          changingWithId[1] === 214 ||
          changingWithId[1] === 495 ||
          changingWithId[1] === 503
        ) {
          reset("ang. vel. changed");
          changingWithId[0] = false;
          changingWithId[1] = -1;
        } else if (
          changingWithId[1] === 223 ||
          changingWithId[1] === 231 ||
          changingWithId[1] === 512 ||
          changingWithId[1] === 520
        ) {
          reset("ang. pos. changed");
          changingWithId[0] = false;
          changingWithId[1] = -1;
        } else if (
          changingWithId[1] === 238 ||
          changingWithId[1] === 246 ||
          changingWithId[1] === 527 ||
          changingWithId[1] === 535
        ) {
          reset("velocity changed");
          changingWithId[0] = false;
          changingWithId[1] = -1;
        }
      }
    });

    buttonRadius.lazyLink(() => {
      model.radiusProp.value = Number(window.prompt("Enter value for radius:"));
      post(
        model.name,
        "radius changed",
        model.radiusProp.value,
        model.gravityProp.value,
        model.frictionProp.value,
        model.omegaProp.value,
        model.thetaProp.value,
        model.velocityProp.value,
        model.velocityEQ,
        model.thetaEQ,
        model.id,
      );
      reset();
    });
    buttonGravity.lazyLink(() => {
      model.gravityProp.value = Number(
        window.prompt("Enter value for gravity:"),
      );
      post(
        model.name,
        "gravity changed",
        model.radiusProp.value,
        model.gravityProp.value,
        model.frictionProp.value,
        model.omegaProp.value,
        model.thetaProp.value,
        model.velocityProp.value,
        model.velocityEQ,
        model.thetaEQ,
        model.id,
      );
      reset();
    });
    buttonFriction.lazyLink(() => {
      model.frictionProp.value = Number(
        window.prompt("Enter value for friction:"),
      );
      post(
        model.name,
        "friction changed",
        model.radiusProp.value,
        model.gravityProp.value,
        model.frictionProp.value,
        model.omegaProp.value,
        model.thetaProp.value,
        model.velocityProp.value,
        model.velocityEQ,
        model.thetaEQ,
        model.id,
      );
      reset();
    });
    buttonOmega.lazyLink(() => {
      model.omegaProp.value = Number(
        window.prompt("Enter value for omega in degrees:"),
      );
      post(
        model.name,
        "omega changed",
        model.radiusProp.value,
        model.gravityProp.value,
        model.frictionProp.value,
        model.omegaProp.value,
        model.thetaProp.value,
        model.velocityProp.value,
        model.velocityEQ,
        model.thetaEQ,
        model.id,
      );
      reset();
    });
    buttonOmegaRads.lazyLink(() => {
      model.omegaRadsProp.value = Number(
        window.prompt("Enter value for omega in radians:"),
      );
      post(
        model.name,
        "omega changed",
        model.radiusProp.value,
        model.gravityProp.value,
        model.frictionProp.value,
        model.omegaProp.value,
        model.thetaProp.value,
        model.velocityProp.value,
        model.velocityEQ,
        model.thetaEQ,
        model.id,
      );
      reset();
    });
    buttonTheta.lazyLink(() => {
      model.thetaProp.value = Number(window.prompt("Enter value for theta:"));
      post(
        model.name,
        "ang. pos. changed",
        model.radiusProp.value,
        model.gravityProp.value,
        model.frictionProp.value,
        model.omegaProp.value,
        model.thetaProp.value,
        model.velocityProp.value,
        model.velocityEQ,
        model.thetaEQ,
        model.id,
      );
      reset();
    });
    buttonVelocity.lazyLink(() => {
      model.velocityProp.value = Number(
        window.prompt("Enter value for velocity:"),
      );
      post(
        model.name,
        "velocity changed",
        model.radiusProp.value,
        model.gravityProp.value,
        model.frictionProp.value,
        model.omegaProp.value,
        model.thetaProp.value,
        model.velocityProp.value,
        model.velocityEQ,
        model.thetaEQ,
        model.id,
      );
      reset();
    });
    buttonSimSpeed.lazyLink(() => {
      model.simSpeedProp.value = Number(
        window.prompt("Enter value for simulation speed:"),
      );
    });

    equationPanel.leftTop = new Vector2(0, panelInitial.leftBottom.y + 10);
    // visualBox.leftTop = new Vector2(0, equationPanel.centerBottom.y + 10);
    // resetAllButton.leftTop = new Vector2(0, visualBox.centerBottom.y + 10);

    const speedController = visualBox;
    // speedController.leftTop = new Vector2(0, equationPanel.centerBottom.y + 10);
    const speedPanel = new Panel(
      new VBox({
        align: "center",
        children: [
          new HBox({
            align: "center",
            children: [
              speedController,
              new Rectangle(0, 0, 20, 0),
              new VBox({
                align: "right",
                children: [
                  new HBox({
                    children: [
                      resetAllButton,
                      new Rectangle(0, 0, 10, 0),
                      pauseButton,
                      ResumeButton,
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      {
        minWidth: equationPanel.width,
        maxWidth: equationPanel.width,
        fill: new Color(210, 210, 210),
      },
    );
    this.addChild(speedPanel);
    // ResumeButton.leftTop = new Vector2(0, equationPanel.centerBottom.y + speedPanel.height + 15)
    // pauseButton.leftTop = new Vector2(0, equationPanel.centerBottom.y + speedPanel.height + 15)
    // resetInitialsButton.leftTop = new Vector2(185, pauseButton.centerBottom.y - 20)

    speedPanel.leftTop = new Vector2(0, equationPanel.centerBottom.y + 10);

    this.domNode.leftTop = new Vector2(
      referenceLabel.rightCenter.x - referenceLabel.width,
      referenceLabel.rightCenter.y + window.innerHeight / 20,
    );
    const resizeListener = () => {
      camera.aspect = this.layoutBounds.maxX / this.layoutBounds.maxY;
      // domNode.leftTop = new Vector2(referenceLabel.rightCenter.x - referenceLabel.width, referenceLabel.rightCenter.y + window.innerHeight / 20);
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", () => {
      resizeListener();
    });
    resizeListener();
    // domNode2.leftTop = new Vector2(referenceLabel.rightCenter.x - referenceLabel.width, testLabel.rightCenter.y);
    domNode2.leftTop = new Vector2(
      referenceLabel.rightCenter.x + 100,
      testLabel.rightCenter.y,
    );

    const resizeListener2 = () => {
      // camera2.aspect = window.innerWidth / window.innerHeight
      camera2.aspect = this.layoutBounds.maxX / this.layoutBounds.maxY;
      camera2.updateProjectionMatrix();
    };

    window.addEventListener("resize", () => {
      resizeListener2();
    });
    resizeListener2();
    // this.refVelocityGraph.leftTop = new Vector2(this.domNode.rightTop.x - 40, 30)
    this.refVelocityGraph.leftTop = new Vector2(
      this.domNode.rightTop.x + 10,
      20,
    );
    // this.refThetaGraph.leftTop = new Vector2(this.domNode.rightTop.x + this.graphSize - 50, 30)
    this.refThetaGraph.leftTop = new Vector2(
      this.refVelocityGraph.leftTop.x,
      300,
    );
    // HERE
    // this.testVelocityGraph.leftTop = new Vector2(this.refVelocityGraph.leftBottom.x, this.refVelocityGraph.leftBottom.y + 10)
    // this.testThetaGraph.leftTop = new Vector2(this.refThetaGraph.leftBottom.x - 10, this.refThetaGraph.leftBottom.y + 10)
    // this.domNode.leftTop = new Vector2(referenceLabel.rightCenter.x - referenceLabel.width, referenceLabel.leftBottom.y);
    this.domNode.leftTop = new Vector2(
      referenceLabel.rightCenter.x - 80,
      referenceLabel.leftBottom.y,
    );
    lineRect.leftCenter = new Vector2(
      this.domNode.leftBottom.x - 30,
      this.domNode.leftBottom.y + 70,
    );
    testLabel.leftTop = new Vector2(
      panelConstants.rightCenter.x + 140,
      this.domNode.leftBottom.y + 80,
    );
    blueBall.leftTop = new Vector2(
      panelConstants.rightCenter.x + 120,
      this.domNode.leftBottom.y + 83,
    );
    domNode2.leftTop = new Vector2(
      referenceLabel.rightCenter.x - 80,
      testLabel.rightCenter.y + 20,
    );

    //

    this.selectedRunProperty = new Property("History"); // This will persist even after rebuilding

    const listParent = new Node(); // Parent for the combo box
    let currentComboBox: Node | null = null; // To keep track of the current combo box
    this.runHistory = []; // Initialize run history
    function updateComboBox(
      this: SimScreenView,
      runs: Array<{ name: string; index: number }> | string[],
    ) {
      if (currentComboBox) {
        listParent.removeChild(currentComboBox);
        currentComboBox.dispose();
      }

      // Support both array of objects and array of strings for runs
      const items = [
        {
          value: "History",
          createNode: () => new Text("History"),
          accessibleName: "History run",
        },
        ...(Array.isArray(runs) && typeof runs[0] === "object"
          ? (runs as Array<{ name: string; index: number }>).map((run) => ({
              value: `Run ${run.index + 1}`,
              createNode: () => new Text(`Run ${run.index + 1}`),
              accessibleName: `Run ${run.index + 1}`,
            }))
          : (runs as string[]).map((run, idx) => ({
              value: run,
              createNode: () => new Text(run),
              accessibleName: run,
            }))),
      ];

      currentComboBox = new CarouselComboBox<string>(
        this.selectedRunProperty,
        items,
        {
          scale: 1.5,
        },
      );

      listParent.addChild(currentComboBox);
    }

    this.addChild(listParent);
    this.updateComboBox = updateComboBox.bind(this);
    this.updateComboBox([]);

    this.selectedRunProperty.link((selected) => {
      if (selected.startsWith("Run ")) {
        const index = parseInt(selected.replace("Run ", "")) - 1;
        const run = this.runHistory[index];
        if (run) {
          this.model.radiusProp.value = run.r;
          this.model.gravityProp.value = run.g;
          this.model.frictionProp.value = run.k;
          this.model.omegaProp.value = run.omega;
          this.model.omegaRadsProp.value = run.omegaRad;
          this.model.velocityProp.value = run.velocity;
          this.model.thetaProp.value = run.theta;

          this.vdotLatex = run.vdotLatex;
          this.thetadotLatex = run.thetadotLatex;

          this.model.velocityEQ = run.vEQ;
          this.model.thetaEQ = run.thetaEQ;

          // this.restoreRun();  // Add this method next
          // this.restoringRun = true;
          this.restoreRun();
          // this.reset();  // Add this method next
        }
      }
    });

    listParent.leftTop = new Vector2(
      panelConstants.rightCenter.x + 10,
      panelConstants.leftTop.y + 10,
    );

    reset();
  }

  public restoreRun(): void {
    // Reset simulation without saving to history
    // this.pause = true

    this.model.radius = this.model.radiusProp.value;
    this.model.gravity = this.model.gravityProp.value;
    this.model.friction = this.model.frictionProp.value;
    this.model.omega = this.model.omegaProp.value;
    //@ts-ignore
    this.model.omegaRads = this.model.omegaRadsProp.value;
    this.velocityField.updateText(this.vdotLatex);
    this.thetaField.updateText(this.thetadotLatex);

    if (this.model.thetaEQ != "" && this.model.velocityEQ != "") {
      this.showBead = true;
      this.beadOnCharts =
        this.model.velocityEQ && this.model.thetaEQ ? true : false;
    }
    if (
      this.model.thetaEQ.length == 0 ||
      this.model.velocityEQ.length === 0 ||
      this.model.velocityEQ === "" ||
      this.model.thetaEQ === ""
    ) {
      this.showBead = false;
      this.beadOnCharts = false;
    }

    this.model.reset();
  }

  public reset(): void {
    // this.xEQLatex = this.vdotxInput.mathField.latex();
    // this.yEQLatex = this.xdotInput.mathField.latex();
    this.vdotLatex = this.velocityField.mathField.latex();
    this.thetadotLatex = this.thetaField.mathField.latex();

    // this.pause = false

    const currentSettings = {
      r: this.model.radiusProp.value,
      g: this.model.gravityProp.value,
      k: this.model.frictionProp.value,
      omega: this.model.omegaProp.value,
      omegaRad: this.model.omegaRadsProp.value,
      velocity: this.model.velocityProp.value,
      theta: this.model.thetaProp.value,

      vdotLatex: this.vdotLatex,
      thetadotLatex: this.thetadotLatex,

      // @ts-ignore
      vdotEQ: this.model.vdotEQ,
      thetaEQ: this.model.thetaEQ,
    };

    // Check if settings are different from last run
    const lastRun = this.runHistory[this.runHistory.length - 1];
    const isDifferent =
      !lastRun ||
      Object.keys(currentSettings).some(
        (key) =>
          // @ts-ignore
          lastRun[key as keyof typeof currentSettings] !==
          currentSettings[key as keyof typeof currentSettings],
      );

    // Only add to history if settings are different
    if (isDifferent) {
      // @ts-ignore
      this.runHistory.push(currentSettings);

      // Update ComboBox with new history

      this.updateComboBox(
        this.runHistory.map((_, index: number) => ({
          name: `Run ${index + 1}`,
          index,
        })),
      );

      // Update selected run to newest

      const currentRunNumber = this.runHistory.length;
      this.selectedRunProperty.value = `Run ${currentRunNumber}`;
    }

    // Called when the user presses the reset-all button
    if (this.model !== undefined) {
      if (this.model.validEqs) {
        this.ball.position.set(0, 0, 0);
        // this.sceneNode.render(undefined);
        this.project = this.projectTemp;

        for (let i = 0; i < this.trailLen; i++) {
          this.balls[i].position.set(999, 999, 999);
          this.ballsTest[i].position.set(999, 999, 999);
          this.ballsCords[i] = 999;
          this.ballsCordsTest[i] = 999;
          this.prevCords[i] = 999;
          this.prevCordsTest[i] = 999;
        }
      }
    }
    if (this.model.velocityEQ !== null && this.model.thetaEQ !== null) {
      this.beadOnCharts = true;
    } else {
      this.beadOnCharts = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public step(dt: number): void {
    if (this.model.velocityEQ !== null && this.model.thetaEQ !== null) {
      this.beadOnCharts = true;
    } else {
      this.beadOnCharts = false;
    }
    if (!this.model.paused) {
      this.hoop.rotation.y = this.model.rotation;
      this.hoopTest.rotation.y = this.model.rotation;

      const cords = this.getBallPos((3 * Math.PI) / 2 + this.model.angle, 1.5);
      this.ball.position.set(
        cords[0] * Math.cos(this.model.rotation) - 5,
        cords[1] + 1.5,
        -cords[0] * Math.sin(this.model.rotation),
      );
      const cordsTest = this.getBallPos(
        (3 * Math.PI) / 2 + this.model.angleTest,
        1.5,
      );
      // this.ballTest.position.set(cordsTest[0] * Math.cos(this.model.rotation) - 5, cordsTest[1] - 2, -cordsTest[0] * Math.sin(this.model.rotation));
      this.ballTest.position.set(
        cordsTest[0] * Math.cos(this.model.rotation) - 5,
        cordsTest[1] - 2,
        -cordsTest[0] * Math.sin(this.model.rotation),
      );
      if (this.project) {
        this.ballsCords.push(this.model.angle);
        this.ballsCords.shift();
      }
      const xyz = {
        x: cords[0] * Math.cos(this.model.rotation) - 5,
        y: cords[1] + 1.5,
        z: -cords[0] * Math.sin(this.model.rotation),
      };
      // ball.position.set(xyz.x,xyz.y,xyz.z);
      this.prevCords.push([xyz.x, xyz.y, xyz.z]);
      this.prevCords.shift();
      for (let i = 0; i < this.trailLen; i++) {
        if (this.prevCords[i] != 999) {
          if (this.project) {
            const tempCord = this.getBallPos(
              this.ballsCords[i] + (3 * Math.PI) / 2,
              1.5,
            );
            this.balls[i].position.set(
              tempCord[0] * Math.cos(this.model.rotation) - 5,
              tempCord[1] + 1.5,
              -tempCord[0] * Math.sin(this.model.rotation),
            );
          } else {
            this.balls[i].position.set(
              this.prevCords[i][0],
              this.prevCords[i][1],
              this.prevCords[i][2],
            );
          }
        }
      }

      if (this.project) {
        this.ballsCordsTest.push(this.model.angleTest);
        this.ballsCordsTest.shift();
      }
      const xyzTest = {
        x: cordsTest[0] * Math.cos(this.model.rotation) - 5,
        y: cordsTest[1] - 2,
        z: -cordsTest[0] * Math.sin(this.model.rotation),
      };
      // ball.position.set(xyz.x,xyz.y,xyz.z);
      this.prevCordsTest.push([xyzTest.x, xyzTest.y, xyzTest.z]);
      this.prevCordsTest.shift();
      for (let i = 0; i < this.trailLen; i++) {
        if (this.prevCordsTest[i] != 999) {
          if (this.project) {
            const tempCord = this.getBallPos(
              this.ballsCordsTest[i] + (3 * Math.PI) / 2,
              1.5,
            );
            this.ballsTest[i].position.set(
              tempCord[0] * Math.cos(this.model.rotation) - 5,
              tempCord[1] - 2,
              -tempCord[0] * Math.sin(this.model.rotation),
            );
          } else {
            this.ballsTest[i].position.set(
              this.prevCordsTest[i][0],
              this.prevCordsTest[i][1],
              this.prevCordsTest[i][2],
            );
          }
        }
      }

      const margin = {
        top: this.graphSize / 35,
        right: 30,
        bottom: this.graphSize / (35 / 3),
        left: 60,
      };
      const width = this.graphSize - margin.left - margin.right;
      const height = this.graphSize - margin.top - margin.bottom;
      // @ts-ignore
      const xRef = d3
        .scaleLinear()
        .domain([0, this.model.graphLen])
        .range([margin.left, width + margin.left]);
      // @ts-ignore
      const xTest = d3
        .scaleLinear()
        .domain([0, this.model.graphLen])
        .range([margin.left, width + margin.left]);
      // @ts-ignore
      const minYTref = d3.min(
        this.model.graphData.data,
        (d: { theta: unknown }) => d.theta,
      );
      // @ts-ignore
      const maxYTref = d3.max(
        this.model.graphData.data,
        (d: { theta: any }) => d.theta,
      );

      // @ts-ignore
      const minYTtest = d3.min(
        this.model.graphDataTest.data,
        (d: { theta: any }) => d.theta,
      );
      // @ts-ignore
      const maxYTtest = d3.max(
        this.model.graphDataTest.data,
        (d: { theta: any }) => d.theta,
      );
      // @ts-ignore
      const minYVref = d3.min(
        this.model.graphData.data,
        (d: { velocity: any }) => d.velocity,
      );
      // @ts-ignore
      const maxYVref = d3.max(
        this.model.graphData.data,
        (d: { velocity: any }) => d.velocity,
      );
      // @ts-ignore
      const minYVtest = d3.min(
        this.model.graphDataTest.data,
        (d: { velocity: any }) => d.velocity,
      );
      // @ts-ignore
      const maxYVtest = d3.max(
        this.model.graphDataTest.data,
        (d: { velocity: any }) => d.velocity,
      );
      // @ts-ignore
      const yRef = d3
        .scaleLinear()
        .domain([maxYTref, minYTref])
        .range([margin.bottom, height - margin.bottom]);
      // @ts-ignore
      const yTest = d3
        .scaleLinear()
        .domain([maxYTtest, minYTtest])
        .range([margin.bottom, height - margin.bottom]);
      // @ts-ignore
      const yVref = d3
        .scaleLinear()
        .domain([maxYVref, minYVref])
        .range([margin.bottom, height - margin.bottom]);
      // @ts-ignore
      const yVtest = d3
        .scaleLinear()
        .domain([maxYVtest, minYVtest])
        .range([margin.bottom, height - margin.bottom]);
      this.refThetaGraph.element.children[6].setAttribute(
        "cx",
        xRef(this.model.timer),
      );
      this.refThetaGraph.element.children[6].setAttribute(
        "cy",
        yRef(this.model.angle),
      );
      // HERE
      // this.testThetaGraph.element.children[6].setAttribute('cx', xTest(this.model.timer));
      // this.testThetaGraph.element.children[6].setAttribute('cy', yTest(this.model.angleTest));

      this.refVelocityGraph.element.children[6].setAttribute(
        "cx",
        xRef(this.model.timer),
      );
      this.refVelocityGraph.element.children[6].setAttribute(
        "cy",
        yVref(this.model.velocity),
      );
      // HERE
      // this.testVelocityGraph.element.children[6].setAttribute('cx', xTest(this.model.timer));
      // this.testVelocityGraph.element.children[6].setAttribute('cy', yVtest(this.model.velocityTest));
      // Update theta dots
      const thetaSvg = this.refThetaGraph.element;
      // @ts-ignore
      const xTheta = d3
        .scaleLinear()
        .domain([0, this.model.graphLen])
        .range([margin.left, width + margin.left]);
      // @ts-ignore
      const yTheta = d3
        .scaleLinear()
        .domain([
          Math.min(
            // @ts-ignore
            d3.min(
              this.model.graphData.data,
              (d: any) => (d.theta * 180) / Math.PI,
            ),
            // @ts-ignore
            d3.min(
              this.model.graphDataTest.data,
              (d: any) => (d.theta * 180) / Math.PI,
            ),
          ),
          Math.max(
            // @ts-ignore
            d3.max(
              this.model.graphData.data,
              (d: any) => (d.theta * 180) / Math.PI,
            ),
            // @ts-ignore
            d3.max(
              this.model.graphDataTest.data,
              (d: any) => (d.theta * 180) / Math.PI,
            ),
          ),
        ])
        .range([height - margin.bottom, margin.bottom]);

      thetaSvg
        .querySelector("#dot-ref-theta")
        ?.setAttribute("cx", xTheta(this.model.timer));
      thetaSvg
        .querySelector("#dot-ref-theta")
        ?.setAttribute("cy", yTheta((this.model.angle * 180) / Math.PI));
      thetaSvg
        .querySelector("#dot-test-theta")
        ?.setAttribute("cx", xTheta(this.model.timer));
      thetaSvg
        .querySelector("#dot-test-theta")
        ?.setAttribute("cy", yTheta((this.model.angleTest * 180) / Math.PI));

      // Update velocity dots
      const velocitySvg = this.refVelocityGraph.element;
      // @ts-ignore
      const xVel = d3
        .scaleLinear()
        .domain([0, this.model.graphLen])
        .range([margin.left, width + margin.left]);
      // @ts-ignore
      const yVel = d3
        .scaleLinear()
        .domain([
          Math.min(
            // @ts-ignore
            d3.min(this.model.graphData.data, (d: any) => d.velocity),
            // @ts-ignore
            d3.min(this.model.graphDataTest.data, (d: any) => d.velocity),
          ),
          Math.max(
            // @ts-ignore
            d3.max(this.model.graphData.data, (d: any) => d.velocity),
            // @ts-ignore
            d3.max(this.model.graphDataTest.data, (d: any) => d.velocity),
          ),
        ])
        .range([height - margin.bottom, margin.bottom]);

      velocitySvg
        .querySelector("#dot-ref-velocity")
        ?.setAttribute("cx", xVel(this.model.timer));
      velocitySvg
        .querySelector("#dot-ref-velocity")
        ?.setAttribute("cy", yVel(this.model.velocity));
      velocitySvg
        .querySelector("#dot-test-velocity")
        ?.setAttribute("cx", xVel(this.model.timer));
      velocitySvg
        .querySelector("#dot-test-velocity")
        ?.setAttribute("cy", yVel(this.model.velocityTest));

      if (this.model.updateGraphs) {
        this.model.updateGraphs = false;

        this.refVelocityGraph.detach();

        this.refVelocityGraph = drawVelocity(
          this.model.graphData,
          this.model.graphDataTest,
          this.model.graphLen,
          "staticSim-velocity",
          "reference",
          this.graphSize,
          this.showBead ? true : false,
        );
        this.refVelocityGraph.offsetWidth = 250;
        this.refVelocityGraph.offsetHeight = 250;
        this.refVelocityGraph = new DOM(this.refVelocityGraph);
        this.refVelocityGraph._container.style.transformOrigin = "left top 0px";

        this.addChild(this.refVelocityGraph);

        this.refThetaGraph.detach();
        this.refThetaGraph = drawTheta(
          this.model.graphData,
          this.model.graphDataTest,
          this.model.graphLen,
          "staticSim-theta",
          "reference",
          this.graphSize,
          this.showBead ? true : false,
        );
        this.refThetaGraph.offsetWidth = 250;
        this.refThetaGraph.offsetHeight = 250;
        this.refThetaGraph = new DOM(this.refThetaGraph);
        // this.refThetaGraph = new DOM(drawTheta(this.model.graphData, this.model.graphLen, 'staticSim-theta', 'reference', this.graphSize));
        this.refThetaGraph._container.style.transformOrigin = "left top 0px";

        this.addChild(this.refThetaGraph);

        this.refVelocityGraph.leftTop = new Vector2(
          this.domNode.rightTop.x + 10,
          20,
        );
        this.refThetaGraph.leftTop = new Vector2(
          this.refVelocityGraph.leftTop.x,
          300,
        );
      }
    }
  }
  getBallPos(angle: number, radius: number) {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return [x, y];
  }
}
