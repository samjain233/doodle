'use client';
import React,{useRef} from 'react'
import WhiteBoard from './components/WhiteBoard';

const game = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

  return (
    <>
      <WhiteBoard canvasRef={canvasRef} ctxRef={ctxRef} />
    </>
  )
}

export default game;
