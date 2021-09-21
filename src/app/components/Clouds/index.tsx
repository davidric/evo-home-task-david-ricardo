/**
 *
 * Clouds
 *
 */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { gsap } from 'gsap';

interface CloudProps {}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  scale: window.innerWidth / 1440
}

export function Clouds(props: CloudProps) {
  const cloudBg1 = useRef(null);
  const cloudBg2 = useRef(null);
  const cloud1 = useRef(null);
  const cloud2 = useRef(null);
  const cloud3 = useRef(null);
  const cloud4 = useRef(null);
  const cloud5 = useRef(null);

  useEffect(() => {
    gsap.to(cloudBg1.current, {
      duration: 40,
      x: sizes.width * 2,
      y: 200 * sizes.scale,
      ease: 'none',
      repeat: -1,
      force3D: true,
      onRepeat: function() {
        gsap.set(cloudBg1.current, 
          {
            y: Math.random() * 200 - 100, 
            rotationZ: Math.round(Math.random() * 60) - 30, 
            scaleX: Math.random() > 0.5 ? 1 : -1
          });
      }
    });

    gsap.to(cloudBg2.current, {
      duration: 40,
      x: sizes.width * 2,
      y: 200 * sizes.scale,
      ease: 'none',
      delay: 10,
      repeat: -1,
      force3D: true,
      onRepeat: function() {
        gsap.set(cloudBg2.current, 
          {
            y: Math.random() * 200 - 100,
            rotationZ: Math.round(Math.random() * 60) - 30, 
            scaleX: Math.random() > 0.5 ? 1 : -1
          });
      }
    });

    gsap.to(cloud1.current, { duration: 35, x: sizes.width * 2, force3D: true, repeat: -1, opacity: 0.3, delay: 10 });
    gsap.to(cloud2.current, { duration: 35, x: sizes.width * 2, force3D: true, repeat: -1, opacity: 0.5 });
    gsap.to(cloud3.current, { duration: 35, x: sizes.width * 2, force3D: true, repeat: -1, delay: 30});
    gsap.to(cloud4.current, { duration: 20, x: sizes.width * 2, force3D: true, repeat: -1});
    gsap.to(cloud5.current, { duration: 20, x: sizes.width * 2, force3D: true, repeat: -1, onComplete: function() {}});
  }, []);

  return(
    <>
      <CloudBg ref={cloudBg1} className="cloud-bg" src="./cloud-bg.png"/>
      <CloudBg ref={cloudBg2} style={{ bottom: '60%'}} className="cloud-bg" src="./cloud-bg.png"/>
      <div className="clouds">
          <Cloud1 ref={cloud1} className="cloud1" src="./cloud-1.png"/>
          <Cloud2 ref={cloud2} className="cloud2" src="./cloud-1.png"/>
          <Cloud3 ref={cloud3} className="cloud3" src="./cloud-2.png"/>
      </div>
    </>
  );
};

const CloudBg = styled.img` 
bottom: 17%;
width: 40%;
right: 100%;
position: absolute;
z-index: 0;
transform-style: preserve-3d;
opacity: 0.7;`

const Cloud1 = styled.img`
bottom: 5%; right: 100%; width: 30%; position: absolute; transform-style: preserve-3d; opacity: 1;`

const Cloud2 = styled.img`
bottom: 80%; right: 100%; width: 30%; position: absolute; transform-style: preserve-3d; opacity: 0.9;`

const Cloud3 = styled.img`
bottom: 38%; right: 100%; width: 30%; position: absolute; transform-style: preserve-3d; opacity: 0.9;`
