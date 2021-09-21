# Pipes Puzzle

## What inside the Solution?

This is a simple single web page application that running a Pipes Puzzle game which integrated with the backend data that communicate through websocket: `wss://hometask.eg1236.com/game-pipes/`

Running App: https://evo.davidrica.com

## How to launch the App

Install packages

```shell
yarn install
```

Run development server

```shell
yarn start
```

Run production build

```shell
yarn start:prod
```

---

## Level Password Obtained

1. Level 1 - `JustWarmingUp`
2. Level 2 - `DefinitelyWarm`
---
## Technologies

This solution is built with the technologies / framework as listed below:
* React
* TypeScript
* Three.js
* GSAP
  
The technologies are picked based on the experience and quick research. 

Inside the Application, the pipe objects are generated by Three.js WebGL framework which load the glTF (GL Transmission Format) file to provide a realistic 3D model.

All animations are handled by GSAP.

> Note: I never worked on 3D animation before. This is the first time I'm using Three.js and GSAP. So apologize if you find me not implementing it in the best practice. But I see there are a lot of space to improve this Application.
---
