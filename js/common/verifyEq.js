// import { simData } from "./simData"

export function verifyEq( elementTheta,elementVelocity,model ){
let t = testT(elementTheta,model)
let v = testV(elementVelocity,model)
 return t && v
}

function testV(element,model ){
  // console.log(model.velocityEQ)
  if (model.velocityEQ === ''){
    if (Object.hasOwn(element, 'domElement')) {
      element.domElement.classList.remove('error');
      console.log("NO ERROR")
    } else{
      element.classList.remove('error');
      console.log("NO ERROR")
  
    }
    return true;
  }
  let omega = model.omega
  let g = model.gravity
  let k  = model.friction
  let angle =  model.angle
  let velocity = model.velocity
  let radius = model.radius
  let result;
  let result2;
  try{
    // const processedEquation = model.velocityEQ.replaceAll('\\pi', 'p').replaceAll('\\theta', 't').replaceAll('\\omega', 'o');
    const eq = globalThis.window.evaluatex(model.velocityEQ, {k:k,r:radius,g:g,o:omega, p: Math.PI, e:Math.E}, {latex:true});
    result = eq({v:velocity,t:angle});
    

  } catch (err){
    console.log(err)
    // element.innerHTML="[BAD OR NO EQUATION INPUTED]";
    // element.text = "[BAD OR NO EQUATION INPUTED]";
    if (Object.hasOwn(element, 'domElement')){ // change to just be velocity elemnt
      console.log("ERROR")
      element.domElement.classList.add('error');
    } else{
      element.classList.add('error');
    }
    // model.graphDataTest = new simData(.05)

    return false;
  }
  if (Object.hasOwn(element, 'domElement')) {
    element.domElement.classList.remove('error');
    console.log("NO ERROR")
  } else{
    element.classList.remove('error');
    console.log("NO ERROR")

  }
  return true;// change to just be velocity elemnt
}
function testT(element,model ){
  if (model.thetaEQ === ''){
    console.log("NO ERRORbjkdfsbdfgkjsfdg")
    if (Object.hasOwn(element, 'domElement')) {
      element.domElement.classList.remove('error');// change to just be theta elemnt
      console.log("NO ERROR")
    } else{
      element.classList.remove('error');
      console.log("NO ERROR")
  
    }
    return true;
  }
  let omega = model.omega
  let g = model.gravity
  let k  = model.friction
  let angle =  model.angle
  let velocity = model.velocity
  let radius = model.radius
  let result;
  let result2;
  try{

    // const processedEquation2 = model.velocityEQ.replaceAll('\\pi', 'p').replaceAll('\\theta', 't').replaceAll('\\omega', 'o');
    const eq2 = globalThis.window.evaluatex(model.thetaEQ, {k:k,r:radius,g:g,o:omega, p: Math.PI, e:Math.E}, {latex:true});
    result2 = eq2({v:velocity,t:angle});

    
    

  } catch (err){
    console.log(err)
    // element.innerHTML="[BAD OR NO EQUATION INPUTED]";
    // element.text = "[BAD OR NO EQUATION INPUTED]";
    if (Object.hasOwn(element, 'domElement')){
      console.log("ERROR")// change to just be theta elemnt
      element.domElement.classList.add('error');
    } else{
      element.classList.add('error');
    }
    // model.graphDataTest = new simData(.05)

    return false;
  }
  if (Object.hasOwn(element, 'domElement')) {
    console.log("NO ERRORbjkdfsbdfgkjsfdg")
    element.domElement.classList.remove('error');// change to just be theta elemnt
    console.log("NO ERROR")
  } else{
    console.log("NO ERRORbjkdfsbdfgkjsfdg2")
    element.classList.remove('error');
    console.log("NO ERROR")

  }
  return true;
}











