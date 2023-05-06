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
        <Paragraph>{detailInfo && detailInfo.maker}</Paragraph>
        <Paragraph>{detailInfo && detailInfo.carModel}</Paragraph>
        <Paragraph>{detailInfo && detailInfo.fuel}</Paragraph>
        <Paragraph>{detailInfo && detailInfo.gearbox}</Paragraph>
        <Paragraph>{detailInfo && detailInfo.capacity}</Paragraph>
        <h3>안전옵션</h3>
        {detailInfo?.safetyOption.map((item) => {
          return <Paragraph>{`-${item}`}</Paragraph>;
        })}
        <h3>편의옵션</h3>
        {detailInfo?.additionalOption.map((item) => {
          return <Paragraph>{`-${item}`}</Paragraph>;
        })}
      </WhiteBox>
    </Background>
  );
}

export default Modal;
const Paragraph = styled.p`
  margin: 0;
  white-space: nowrap;
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  padding: 42px 36px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;
const WhiteBox = styled.div`
  background: white;

  padding: 30px;
  /* width: 71%; */
  /* height: 82%; */
  overflow-y: auto;
`;
