import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/list');
    }, 2000);
  }, []);
  return (
    <Layout>
      <Box>
        <Logo width="250px" src="SOCAR_logo_RGB_시그니처로고.png"></Logo>
      </Box>
    </Layout>
  );
}

export default Landing;
const Logo = styled.img`
  transform-origin: 10% 50%;
  animation-name: shake;
  animation-duration: 0.7s;
  animation-iteration-count: initial;
  animation-delay: 0.5s;
  @keyframes shake {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(1deg);
    }
    20% {
      transform: rotate(-2deg);
    }
    30% {
      transform: rotate(3deg);
    }
    40% {
      transform: rotate(-2deg);
    }
    50% {
      transform: rotate(1deg);
    }
    60% {
      transform: rotate(-1deg);
    }
    70% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

const Layout = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
`;
const Box = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 420px;
  height: 100vh;
  padding: 24px;
  background-color: #f7f8f9;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;
