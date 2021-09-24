/**
 *
 * Board
 *
 */
import React, {
  memo,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from 'react';
import { Canvas, Vector3 } from '@react-three/fiber';
import { Pipe } from '../Pipe';
import { Clouds } from '../Clouds';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import {
  Button,
  Box,
  Snackbar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { getPipeName, getPipeRotation } from '../../utils/translatePipe';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const client = new W3CWebSocket('wss://hometask.eg1236.com/game-pipes/');

interface Props {}

interface PipeModel {
  name: string;
  position: Vector3;
  arrIndex: string;
  rotate: number;
}

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  level: string;
  password: string;
}

export const Board = memo((props: Props) => {
  const [pipeList, setPipeList] = useState<PipeModel[]>([]);
  const [socketOpen, setSocketOpen] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [expandMenu, setExpandMenu] = useState(false);
  const [level, setLevel] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [levelPassword, setLevelPassword] = useState('');
  const camera = useRef<THREE.PerspectiveCamera>(null!);
  const refMenus = useRef(null);
  const qMenus = useMemo(() => gsap.utils.selector(refMenus), [refMenus]);
  const refLevel = useRef(null);

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      setSocketOpen(true);
      onSendWSCommand('help');
    };
  }, []);

  useEffect(() => {
    if (pipeList.length > 0) {
      const levelAnimation = gsap.from(refLevel.current, {
        y: -200,
        ease: 'back',
        delay: 1,
      });

      if (camera.current && level != '') {
        const cameraAnimation = gsap.to(camera.current.position, {
          y: -2.5,
          z: 2.5,
          duration: 1.5,
          delay: 2,
          ease: 'back',
        });

        return () => {
          cameraAnimation.kill();
          levelAnimation.kill();
        };
      }
    }
  }, [pipeList]);

  useEffect(() => {
    if (expandMenu) {
      const btnAnimation = gsap.to(qMenus('.btnMenu'), {
        x: -100,
        stagger: 0.1,
      });

      return () => {
        btnAnimation.kill();
      };
    } else {
      const fabAnimation = gsap.to(qMenus('.btnMenu'), {
        x: 100,
        stagger: 0.1,
      });

      return () => {
        fabAnimation.kill();
      };
    }
  }, [expandMenu]);

  function onSendWSCommand(command: string) {
    client.send(command);
    client.onmessage = message => {
      const data = message.data;
      console.log('message: ', data);
      console.log(data + '\n-------\n');

      if (data.includes('map:')) {
        // Store map characters to array 2D
        let rows = data.split('\n');
        rows.forEach((row, i) => {
          rows[i] = row.split('');
        });
        rows.shift();
        rows.pop();

        let tempPipeList: PipeModel[] = [];

        if (rows.length > 0) {
          const totalRows = rows.length;
          const totalColumn = rows[0].length;

          // Get final map
          let pipeIndex = 0;
          rows.forEach((row, i) => {
            row.forEach((col, j) => {
              tempPipeList.push({
                name: getPipeName(col),
                position: getPipePosition(totalRows, totalColumn, i, j),
                rotate: getPipeRotation(col),
                arrIndex: getArrayIndex(i, j),
              });
              pipeIndex++;
            });
          });
        }
        setPipeList(tempPipeList);
      }

      if (data.includes('verify:')) {
        if (data.includes('Correct')) {
          const password = data.split('Password: ').pop();
          setLevelPassword(password);
          setOpenModal(true);
        } else {
          setIncorrect(true);
        }
      }
    };
  }

  function getPipePosition(
    totalRows: number,
    totalColumn: number,
    currentRow: number,
    currentColumn: number,
  ): Vector3 {
    // Get first pipe position
    const pipeGap = 0.85;
    let pipeX = -((totalColumn * pipeGap) / 2);
    let pipeY = (totalRows * pipeGap) / 2;
    // Get current pipe position
    pipeX = pipeX + pipeGap * currentColumn;
    pipeY = pipeY - pipeGap * currentRow;

    const pipePosition = new THREE.Vector3(pipeX, pipeY, 0);
    return pipePosition;
  }

  function getArrayIndex(currentRow: number, currentColum: number) {
    return `${currentColum} ${currentRow}`;
  }

  function goToLevel(level: number) {
    onSendWSCommand(`new ${level}`);
    onSendWSCommand('map');
    setLevel(`Level ${level}`);
  }

  return (
    <>
      {pipeList.length > 0 ? (
        <h3 ref={refLevel} className="levelText">
          {level}
        </h3>
      ) : null}

      {socketOpen ? (
        <Fab
          onClick={() => setExpandMenu(!expandMenu)}
          color="primary"
          aria-label="add"
          style={{ position: 'absolute', top: 15, right: 15, zIndex: 2 }}
        >
          <SettingsIcon />
        </Fab>
      ) : null}

      <div
        ref={refMenus}
        style={{
          display: 'block',
          position: 'absolute',
          zIndex: 2,
          right: -100,
          top: 90,
        }}
      >
        <Box p={1}>
          <Button
            variant="contained"
            className="btnMenu"
            onClick={() => goToLevel(1)}
          >
            LEVEL 1
          </Button>
        </Box>
        <Box p={1}>
          <Button
            variant="contained"
            className="btnMenu"
            onClick={() => goToLevel(2)}
          >
            LEVEL 2
          </Button>
        </Box>
        <Box p={1}>
          <Button
            variant="contained"
            className="btnMenu"
            onClick={() => goToLevel(3)}
          >
            LEVEL 3
          </Button>
        </Box>
        <Box p={1}>
          <Button
            variant="contained"
            className="btnMenu"
            onClick={() => onSendWSCommand('verify')}
          >
            VERIFY
          </Button>
        </Box>
      </div>

      <Snackbar
        open={incorrect}
        autoHideDuration={6000}
        onClose={() => setIncorrect(false)}
        message="Incorrect!"
        // action={action}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Incorrect!
        </Alert>
      </Snackbar>

      <ModalPopup
        open={openModal}
        level={level}
        password={levelPassword}
        handleClose={() => setOpenModal(false)}
      />

      <Clouds />

      <Canvas>
        <pointLight args={['#ffffff', 1.4, 500]} position={[0, 15, 15]} />
        <OrbitControls
          minDistance={3}
          maxDistance={35}
          maxAzimuthAngle={Math.PI / 4}
          minZoom={2}
          maxZoom={3}
          enableRotate={false}
          enableZoom={true}
          mouseButtons={{ LEFT: 2, MIDDLE: 1, RIGHT: 2 }}
          touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }}
        />
        <perspectiveCamera ref={camera} position={[0.35, -0.5, 0]}>
          {pipeList.map((data, key) => {
            return (
              <Pipe
                key={key}
                name={data.name}
                position={data.position}
                rotate={data.rotate}
                arrIndex={data.arrIndex}
                handleRotate={(value: string) =>
                  onSendWSCommand(`rotate ${value}`)
                }
              />
            );
          })}
        </perspectiveCamera>
      </Canvas>
    </>
  );
});

const ModalPopup = (props: ModalProps) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Congratulations!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You pass {props.level}. Here is the password: <b>{props.password}</b>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>CLOSE</Button>
      </DialogActions>
    </Dialog>
  );
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
