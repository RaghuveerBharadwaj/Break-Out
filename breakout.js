const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Events = Matter.Events;

const engine = Engine.create();

const custWidth = window.innerWidth;
const custHeight = window.innerHeight;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: custWidth,
    height: custHeight,
    wireframes: false,
  },
});

const topWall = Bodies.rectangle(custWidth / 2, -200, custWidth, 400, {
  isStatic: true,
  density: 10000,
  restitution: 1,
});
const leftWall = Bodies.rectangle(-20, custHeight / 2, 20, custHeight, {
  isStatic: true,
  density: 10000,
});
const rightWall = Bodies.rectangle(
  custWidth + 20,
  custHeight / 2,
  20,
  custHeight,
  { isStatic: true, density: 10000 }
);
const bottomWall = Bodies.rectangle(
  custWidth / 2,
  custHeight + 20,
  custWidth,
  20,
  { isStatic: true, density: 10000, restitution: 1 }
);

const slider = Bodies.rectangle(
  custWidth / 2,
  custHeight - 50,
  custWidth / 7,
  20,
  {
    restitution: 1,
    isStatic: true,
    render: { fillStyle: "skyblue" },
    chamfer: { radius: 10 },
  }
);

const ball = Bodies.circle(custWidth / 2, custHeight / 2, 20, {
  inertia: Infinity,
  restitution: 1,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
  render: { sprite: { texture: "./ball.png", xScale: 0.2, yScale: 0.2 } },
});

const Life = [0, 50, 100].map((life) =>
  Bodies.circle(custWidth - 50 - life, 60, 10, {
    isStatic: true,
    render: { sprite: { texture: "./life.png", xScale: 0.1, yScale: 0.1 } },
  })
);

const Bricks1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((brick) =>
  Bodies.rectangle((custWidth - 1100) / 2 + brick * 100, 100, 100, 25, {
    restitution: 1,
    isStatic: true,
    render: { fillStyle: "pink", strokeStyle: "brown", lineWidth: 3 },
    id: brick,
    chamfer: { radius: 2 },
  })
);
const Bricks2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((brick) =>
  Bodies.rectangle((custWidth - 1000) / 2 + brick * 100, 130, 100, 25, {
    restitution: 1,
    isStatic: true,
    render: { fillStyle: "pink", strokeStyle: "brown", lineWidth: 3 },
    id: brick + 11,
    chamfer: { radius: 2 },
  })
);
const Bricks3 = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((brick) =>
  Bodies.rectangle((custWidth - 900) / 2 + brick * 100, 160, 100, 25, {
    restitution: 1,
    isStatic: true,
    render: { fillStyle: "pink", strokeStyle: "brown", lineWidth: 3 },
    id: brick + 21,
    chamfer: { radius: 2 },
  })
);
const Bricks4 = [1, 2, 3, 4, 5, 6, 7, 8].map((brick) =>
  Bodies.rectangle((custWidth - 800) / 2 + brick * 100, 190, 100, 25, {
    restitution: 1,
    isStatic: true,
    render: { fillStyle: "pink", strokeStyle: "brown", lineWidth: 3 },
    id: brick + 30,
    chamfer: { radius: 2 },
  })
);
const Bricks5 = [1, 2, 3, 4, 5, 6, 7].map((brick) =>
  Bodies.rectangle((custWidth - 700) / 2 + brick * 100, 220, 100, 25, {
    restitution: 1,
    isStatic: true,
    render: { fillStyle: "pink", strokeStyle: "brown", lineWidth: 3 },
    id: brick + 38,
    chamfer: { radius: 2 },
  })
);

const Bricks = [...Bricks1, ...Bricks2, ...Bricks3, ...Bricks4, ...Bricks5];

World.add(engine.world, [
  topWall,
  leftWall,
  rightWall,
  bottomWall,
  slider,
  ball,
  ...Bricks,
  ...Life,
]);

const keyPress = (event) => {
  //Left Arrow
  if (event.keyCode === 37 && slider.position.x > 150) {
    Body.translate(slider, { x: -200, y: 0 });
  }
  //Right Arrow
  if (event.keyCode === 39 && slider.position.x < custWidth - 150) {
    Body.translate(slider, { x: 200, y: 0 });
  }
};

Body.setVelocity(ball, { x: 6, y: 1 });

const isCollide = () => {
  const Collides = Bricks.map((brick) => Matter.SAT.collides(brick, ball));

  Collides.forEach((collision, id) => {
    if (collision.collided) {
      World.remove(engine.world, Bricks[id]);
      Bricks.splice(Bricks.indexOf(Bricks[id]), 1);
    }
  });

  if (Matter.SAT.collides(bottomWall, ball).collided) {
    World.remove(engine.world, Life[Life.length - 1]);
    Life.pop();
  }

  if (Life.length === 0) {
    document.getElementById("over").style.display = "block";
    document.getElementById("restart").style.display = "block";
    Events.off(engine, "tick");
  }

  if (Bricks.length === 0) {
    document.getElementById("win").style.display = "block";
    document.getElementById("restart").style.display = "block";
    Events.off(engine, "tick");
  }
};

engine.world.gravity.y = 0;
engine.world.frictionAir = 0;
Engine.run(engine);
Render.run(render);
window.addEventListener("keydown", keyPress, false);

Events.on(engine, "tick", isCollide);
