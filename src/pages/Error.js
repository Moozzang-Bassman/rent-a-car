import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function Error() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate('/list');
    }, 1000);
  }, []);
  return (
    <Layout>
      <Box></Box>
    </Layout>
  );
}

export default Error;
const Layout = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
`;
const Box = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 420px;
  padding: 24px;
  background-color: #f7f8f9;
  position: relative;
  overflow: hidden;
  height: 100vh;
`;
