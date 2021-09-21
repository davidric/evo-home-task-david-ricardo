import React from 'react';
import ReactDOM from 'react-dom';
import { Board } from '../../components/Board';
import { Helmet } from 'react-helmet-async';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>David Ricardo</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <Board />
    </>
  );
}
