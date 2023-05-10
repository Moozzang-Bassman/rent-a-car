import React from 'react';

import styled from 'styled-components';
function Modal({ setIsModalOpen, detailInfo, isModalOpen }) {
  return (
    <Background
      onClick={() => {
        setIsModalOpen(false);
      }}
    >
      <WhiteBox
        isModalOpen={isModalOpen}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img width="100%" alt="" src={detailInfo && detailInfo.carImage}></img>
        <h3>{detailInfo && detailInfo.carClassName}</h3>
        <p>{`제조사: ${detailInfo && detailInfo.carModel}`}</p>
        <p>{`분류: ${detailInfo && detailInfo.maker}`}</p>
        <p>{`연료: ${detailInfo && detailInfo.fuel}`}</p>
        <p>{`변속방식: ${detailInfo && detailInfo.gearbox}`}</p>
        <p>{`승차정원: ${detailInfo && detailInfo.capacity}`}인승</p>
        <h3>안전옵션</h3>
        {detailInfo?.safetyOption.map((item, index) => {
          return <p key={index}>{`-${item}`}</p>;
        })}
        <h3>편의옵션</h3>
        {detailInfo?.additionalOption.map((item, index) => {
          return <p key={index}>{`-${item}`}</p>;
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
  cursor: pointer;
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  display: flex;
  justify-content: center;

  box-sizing: border-box;
`;
const WhiteBox = styled.div`
  background: white;
  position: relative;
  height: 75%;
  margin-top: 10vh;
  padding: 28px;
  border-radius: 1rem;
  transition: all 1s;
  overflow-y: auto;
  max-width: 260px;
`;
