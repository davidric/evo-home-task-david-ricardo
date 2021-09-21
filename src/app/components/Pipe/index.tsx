/**
 *
 * Pipe
 *
 */
// import * as React from 'react';
// import styled from 'styled-components/macro';

import * as THREE from 'three';
import ReactDOM from 'react-dom';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { useLoader, Vector3 } from '@react-three/fiber';
import { gsap } from 'gsap';
import {Howl} from 'howler';

interface PipeProps {
  name: string;
  position: Vector3;
  rotate: number;
  arrIndex: string
  handleRotate: (value: string) => void;
}

export function Pipe(props: PipeProps) {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  return (
    <>
      <Mesh {...props} />
      <perspectiveCamera position={[1, 12, 1]} args={[7, sizes.width / sizes.height, 10, 1]} />
    </>
  );
}

function Mesh(props: (JSX.IntrinsicElements['mesh'] & PipeProps)) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [rotateZ, setRotateZ] = useState(props.rotate);
  const [rotateTriggered, setRotateTriggered] = useState(false);

  useEffect(() => {
    const sound = new Howl({
      src: ['light-spin.wav']
    });

    if (rotateTriggered) {
      sound.play();

      props.handleRotate(props.arrIndex);
    }

    if (gltf && gltfScene && mesh && mesh.current) {
      const rotateAnimation = gsap.to(mesh.current.rotation, {
        duration: 0.3,
        z: rotateZ
      });

      return () => {
        rotateAnimation.kill();
      };
    }
  }, [rotateZ]);

  useEffect(() => {
    if (gltf && gltfScene && mesh && mesh.current) {
      const hoverAnimation = gsap.to(mesh.current.scale, {
        duration: 0.3,
        x: hovered ? 4 : 3,
        y: hovered ? 4 : 3,
        z: hovered ? 4 : 3,
      });

      return () => {
        hoverAnimation.kill();
      };
    }
  }, [hovered]);

  let gltf = useLoader(GLTFLoader, "/gltf/" + props.name + "/" + props.name + ".gltf");
  // @ts-ignore
  const gltfScene = SkeletonUtils.clone(gltf.scene);

  function rotatePipe() {
    setRotateZ(rotateZ - (Math.PI / 2));
    setRotateTriggered(true);
  }

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={3}
      onClick={() => rotatePipe()}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      >
        <Suspense fallback={null}>
          <primitive object={gltfScene} />
        </Suspense>
    </mesh>
  );
}
