import './App.css';
import styled from 'styled-components';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [showMoreNumber, setShowMoreNumber] = useState(5);
  const [data, setData] = useState();
  const imageMoveHandler = (e) => {};
  const priceWithComma = (num) => {
    const value = Math.round(num / 100) * 100;
    return value.toLocaleString();
  };
  const drivingDistanceToKorean = (num) => {
    const arr = [];
    if (num === 0) {
      return;
    }
    if (`${num}`.length > 4) {
      arr.push(`${Math.floor(num / 10000)}만`);
    }
    if (`${num}`.length > 3) {
      if (Math.floor((num % 10000) / 1000) !== 0) {
        arr.push(`${Math.floor((num % 10000) / 1000)}천`);
        if (Math.floor((num % 10000) % 1000)) {
          arr.push(`${Math.floor((num % 10000) % 1000)}`);
        }
      }
    }
    if (`${num}`.length < 4) {
      arr.push(`${num}`);
    }
    return arr.join('');
  };
  const showMoreButtonClickHandler = () => {
    console.log(showMoreNumber);
    setShowMoreNumber(showMoreNumber + 5);
    console.log(showMoreNumber);
  };
  useEffect(() => {
    axios.get('http://localhost:8080/carClasses').then((response) => {
      const newArr = response.data.map((item) => {
        return {
          ...item,
          price: priceWithComma(item.price),
          drivingDistance: drivingDistanceToKorean(item.drivingDistance),
          regionGroups: item.regionGroups.join(' ').replaceAll(' ', ', '),
        };
      });
      setData(newArr);
    });
  }, []);
  console.log(data);

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
                <CardImage src={item.image}></CardImage>
                <CardDesc>
                  <NonameWrapper>
                    <div>
                      <Paragraph>{item.carClassName}</Paragraph>
                      <Paragraph>{item.price}원</Paragraph>
                    </div>
                    <TagWrapper>
                      {item.carTypeTags.map((item, index) => {
                        return <Tag key={item[index]}>{item}</Tag>;
                      })}
                    </TagWrapper>
                  </NonameWrapper>
                  <Paragraph>
                    {`${item.year}년 | ${item.drivingDistance}km | ${item.regionGroups}`}
                  </Paragraph>
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
const NonameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
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
`;
const CardImage = styled.img`
  /* width: 200px; */
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
  cursor: pointer;
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
