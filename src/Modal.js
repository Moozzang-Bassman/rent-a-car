import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
function Modal({ setIsModalOpen, detailInfo }) {
  console.log(detailInfo);
  return (
    <Background
      onClick={() => {
        setIsModalOpen(false);
      }}
    >
      <WhiteBox
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img width="100%" src={detailInfo && detailInfo.carImage}></img>
        <p>{detailInfo && detailInfo.carClassName}</p>
        <p>{detailInfo && detailInfo.maker}</p>
        <p>{detailInfo && detailInfo.carModel}</p>
        <p>{detailInfo && detailInfo.fuel}</p>
        <p>{detailInfo && detailInfo.gearbox}</p>
        <p>{detailInfo && detailInfo.capacity}</p>
        <h3>안전옵션</h3>
        {detailInfo?.safetyOption.map((item) => {
          return <p>{`-${item}`}</p>;
        })}
        <h3>편의옵션</h3>
        {detailInfo?.additionalOption.map((item) => {
          return <p>{`-${item}`}</p>;
        })}
      </WhiteBox>
    </Background>
  );
}

export default Modal;

const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  padding: 30px;
  display: flex;
  justify-content: center;
`;
const WhiteBox = styled.div`
  background: white;

  padding: 30px;
  width: 71%;
  height: 82%;
  overflow-y: auto;
`;
