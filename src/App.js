import './App.css';
import styled from 'styled-components';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [data, setData] = useState();
  const imageMoveHandler = (e) => {};
  const showMoreButtonClickHandler = () => {
    console.log('더보기 기능');
  };
  useEffect(() => {
    axios.get('http://localhost:8080/carClasses').then((data) => {
      setData(data.data);
    });
  }, []);
  // const 글자길이측정용 = data?.map((item) => {
  //   return `${item.year}년 | ${item.}`
  // });

  return (
    <Layout>
      <Box onMouseMove={imageMoveHandler} onTouchMove={imageMoveHandler}>
        <TitleBox>
          <Title>차량 리스트</Title>
        </TitleBox>
        <div>
          <SubTitle>특가 차량</SubTitle>
        </div>
        <div>
          <SubTitle>모든 차량</SubTitle>
          {data?.map((item) => {
            return (
              <CardBox
                key={item.carClassId}
                onClick={() => {
                  console.log(item.carClassId);
                }}
              >
                <CardImage></CardImage>
                <CardDesc>
                  <div>
                    <Paragraph>{item.carClassName}</Paragraph>
                    <Paragraph>{item.price}원</Paragraph>
                    <Paragraph>2019년|5만km|서울,부산...</Paragraph>
                  </div>
                  <TagWrapper>
                    {item.carTypeTags.map((item) => {
                      return <Tag>{item}</Tag>;
                    })}
                  </TagWrapper>
                </CardDesc>
              </CardBox>
            );
          })}
        </div>
        <ButtonBox>
          <Button onClick={showMoreButtonClickHandler}>더보기</Button>
        </ButtonBox>
      </Box>
    </Layout>
  );
}

export default App;
const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;
const Button = styled.button``;
const TagWrapper = styled.div`
  display: flex;
`;
const Tag = styled.div`
  width: 64px;
  height: 28px;
  border: 1px solid;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Paragraph = styled.p`
  margin: 0;
  white-space: nowrap;
`;
const CardDesc = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
`;
const CardImage = styled.img`
  width: 55%;
  height: 150px;
  background-color: aliceblue;
  margin: 0 auto;
`;
const CardBox = styled.div`
  margin-top: 24px;
  width: 100%;
  height: 280px;
  background-color: orange;
  box-sizing: border-box;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
`;
const SubTitle = styled.h2`
  font-weight: 500;
`;
const TitleBox = styled.div`
  margin-bottom: 24px;
`;
const Title = styled.h1`
  text-align: center;
  margin: 0;
`;
const Layout = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
  background-color: green;
`;
const Box = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 420px;
  /* height: 100vh; */
  padding: 24px;
  background-color: yellowgreen;
`;
