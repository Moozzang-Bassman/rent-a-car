import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
function Modal({ setIsModalOpen, detailInfo }) {
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
        <h3>{detailInfo && detailInfo.carClassName}</h3>
        <p>{detailInfo && detailInfo.maker}</p>
        <p>{detailInfo && detailInfo.carModel}</p>
        <p>{detailInfo && detailInfo.fuel}</p>
        <p>{detailInfo && detailInfo.gearbox}</p>
        <p>{detailInfo && detailInfo.capacity}인승</p>
        <h3>안전옵션</h3>
        {detailInfo?.safetyOption.map((item) => {
          return <p>{`-${item}`}</p>;
        })}
        <h3>편의옵션</h3>
        {detailInfo?.additionalOption.map((item) => {
          return <p>{`-${item}`}</p>;
        })}
        <XButton
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          X
        </XButton>
      </WhiteBox>
    </Background>
  );
}

export default Modal;
const XButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  border: 2px solid;
  background-color: inherit;
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  padding: 60px 36px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;
const WhiteBox = styled.div`
  background: white;
  position: relative;

  padding: 28px;

  overflow-y: auto;
  max-width: 260px;
`;
