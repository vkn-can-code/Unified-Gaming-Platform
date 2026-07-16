import Matter from 'matter-js';

// Aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Constraint = Matter.Constraint,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Body = Matter.Body,
      Bodies = Matter.Bodies,
      Vector = Matter.Vector;

export function initGame(canvas, setDistance) {
  // create engine
  const engine = Engine.create();
  const world = engine.world;
  
  // create renderer
  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: 'transparent',
      pixelRatio: window.devicePixelRatio
    }
  });

  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // Terrain generation
  const terrainBlocks = [];
  const startX = 0;
  const numBlocks = 300;
  const blockWidth = 50;
  let currentY = 500;
  
  for (let i = 0; i < numBlocks; i++) {
    // Generate some hills using sine waves
    const noise = Math.sin(i * 0.1) * 30 + Math.sin(i * 0.05) * 50 + Math.sin(i * 0.02) * 100;
    currentY = 600 - noise;
    
    // Add flat start
    if (i < 10) currentY = 500;

    const block = Bodies.rectangle(startX + i * blockWidth, currentY, blockWidth + 2, 600, { 
      isStatic: true,
      render: { fillStyle: '#4b0082', strokeStyle: '#ffd700', lineWidth: 1 } 
    });
    terrainBlocks.push(block);
  }
  Composite.add(world, terrainBlocks);

  // Create Vehicle
  const group = Body.nextGroup(true);
  
  const chassisWidth = 120;
  const chassisHeight = 30;
  const chassisX = 300;
  const chassisY = 300;

  const chassis = Bodies.rectangle(chassisX, chassisY, chassisWidth, chassisHeight, { 
    collisionFilter: { group: group },
    density: 0.002,
    render: { fillStyle: '#8a2be2' }
  });

  const wheelA = Bodies.circle(chassisX - 40, chassisY + 20, 25, { 
    collisionFilter: { group: group },
    friction: 0.9,
    render: { fillStyle: '#ffd700' }
  });

  const wheelB = Bodies.circle(chassisX + 40, chassisY + 20, 25, { 
    collisionFilter: { group: group },
    friction: 0.9,
    render: { fillStyle: '#ffd700' }
  });

  const axelA = Constraint.create({
    bodyA: chassis,
    pointA: { x: -40, y: 15 },
    bodyB: wheelA,
    stiffness: 0.2,
    damping: 0.1,
    length: 15,
    render: { visible: false }
  });

  const axelB = Constraint.create({
    bodyA: chassis,
    pointA: { x: 40, y: 15 },
    bodyB: wheelB,
    stiffness: 0.2,
    damping: 0.1,
    length: 15,
    render: { visible: false }
  });

  Composite.add(world, [chassis, wheelA, wheelB, axelA, axelB]);

  // Controls state
  const keys = {
    ArrowRight: false,
    ArrowLeft: false,
    KeyD: false,
    KeyA: false
  };

  const handleKeyDown = (e) => { if(keys[e.code] !== undefined) keys[e.code] = true; };
  const handleKeyUp = (e) => { if(keys[e.code] !== undefined) keys[e.code] = false; };
  
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Update loop for camera & controls
  Matter.Events.on(engine, 'beforeUpdate', () => {
    // Controls
    const maxTorque = 0.04;
    const chassisTorque = 0.02;

    const isGas = keys.ArrowRight || keys.KeyD || window.isGasPressed;
    const isBrake = keys.ArrowLeft || keys.KeyA || window.isBrakePressed;

    if (isGas) {
      Body.setAngularVelocity(wheelB, wheelB.angularVelocity + 0.01);
      Body.setAngularVelocity(wheelA, wheelA.angularVelocity + 0.01);
      // airborne rotation
      if (chassis.velocity.y > 2 || chassis.velocity.y < -2) {
         Body.applyForce(chassis, chassis.position, { x: 0, y: -0.005 }); // tiny lift
         Body.setAngularVelocity(chassis, chassis.angularVelocity - 0.001); // rotate backwards
      }
    }
    
    if (isBrake) {
      Body.setAngularVelocity(wheelB, wheelB.angularVelocity - 0.01);
      Body.setAngularVelocity(wheelA, wheelA.angularVelocity - 0.01);
      if (chassis.velocity.y > 2 || chassis.velocity.y < -2) {
         Body.setAngularVelocity(chassis, chassis.angularVelocity + 0.001); // rotate forwards
      }
    }

    // Camera follow (LookAt)
    Render.lookAt(render, {
      min: { x: chassis.position.x - window.innerWidth / 3, y: chassis.position.y - window.innerHeight / 2 },
      max: { x: chassis.position.x + window.innerWidth * 2 / 3, y: chassis.position.y + window.innerHeight / 2 }
    });

    // Update distance score
    const dist = Math.max(0, Math.floor((chassis.position.x - 300) / 100));
    setDistance(dist);
  });

  // Handle window resize
  const handleResize = () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    render.options.width = window.innerWidth;
    render.options.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('resize', handleResize);
    Render.stop(render);
    Runner.stop(runner);
    Engine.clear(engine);
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
    render.textures = {};
  };
}
