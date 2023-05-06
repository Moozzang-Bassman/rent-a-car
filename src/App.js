import './App.css';
import styled from 'styled-components';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Modal from './Modal';
import { createGlobalStyle } from 'styled-components';

function App() {
  const [carList, setCarList] = useState(5);
  const [slide, setSlide] = useState(0);
  const [data, setData] = useState(null);
  const [detailInfo, setDetailInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const cardBoxClickHandler = (id) => {
    setIsModalOpen(true);
    axios.get(`http://localhost:8080/carClasses/${id}`).then((response) => {
      setDetailInfo(...response.data);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/carClasses');
        const newArr = response.data.map((item) => {
          return {
            ...item,
            price: priceWithComma(item.price),
            drivingDistance: drivingDistanceToKorean(item.drivingDistance),
            regionGroups: item.regionGroups.join(' ').replaceAll(' ', ', '),
          };
        });
        setData(newArr);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const specialPriceItem = data?.filter((item) => {
    if (item.carTypeTags.includes('특가')) {
      return item;
    }
  });

  const specialPriceLength = specialPriceItem?.length;

  return (
    <>
      <GlobalStyle isModalOpen={isModalOpen} />
      <Layout>
        {isModalOpen ? (
          <Modal
            setIsModalOpen={setIsModalOpen}
            detailInfo={detailInfo}
          ></Modal>
        ) : (
          ''
        )}
        <Box>
          <TitleBox>
            <Title>차량 리스트</Title>
          </TitleBox>
          <div>
            <SubTitle>특가 차량</SubTitle>
            <SlideBoxContainer
              slide={slide}
              specialPriceLength={specialPriceLength}
            >
              {specialPriceItem?.map(() => {
                return <SlideBox></SlideBox>;
              })}
            </SlideBoxContainer>
          </div>
          <button
            onClick={() => {
              if (slide < -(300 * (specialPriceLength - 2))) {
                return;
              }
              setSlide(slide - 300);
            }}
          >
            슬라이드+
          </button>
          <button
            onClick={() => {
              if (slide === 0) {
                return;
              }
              setSlide(slide + 300);
            }}
          >
            슬라이드-
          </button>
          <div>
            <SubTitle>모든 차량</SubTitle>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              {data?.slice(0, carList).map((item) => {
                return (
                  <CardBox
                    key={item.carClassId}
                    onClick={() => cardBoxClickHandler(item.carClassId)}
                  >
                    <CardImage src={item.image}></CardImage>
                    <CardDesc>
                      <NonameWrapper>
                        <div>
                          <p>{item.carClassName}</p>
                          <p>{item.price}원</p>
                        </div>
                        <TagWrapper>
                          {item.carTypeTags.map((item, index) => {
                            return <Tag key={[index]}>{item}</Tag>;
                          })}
                        </TagWrapper>
                      </NonameWrapper>
                      <p>
                        {`${item.year}년 | ${item.drivingDistance}km | ${item.regionGroups}`}
                      </p>
                    </CardDesc>
                  </CardBox>
                );
              })}
            </div>
          </div>
          <ButtonBox>
            {carList < data?.length ? (
              <Button
                onClick={() => {
                  setCarList(carList + 5);
                }}
              >
                더보기
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setCarList(5);
                }}
              >
                더 없으니까 닫기
              </Button>
            )}
          </ButtonBox>
        </Box>
      </Layout>
    </>
  );
}

export default App;
const SlideBoxContainer = styled.div`
  /* 박스 갯수마다 300px씩 */
  /* width: 3600px; */
  width: ${(props) => `${props.specialPriceLength * 300}px`};
  display: flex;
  box-sizing: border-box;

  /* 300px씩 움직인다 */
  /* slidebox 너비 280px + gap 20px */

  /* transform: translateX(-3000px); */
  transform: ${(props) => `translateX(${props.slide}px)`};
  gap: 20px;
  transition: transform 1s;
  background-color: aqua;
`;
const SlideBox = styled.div`
  background-color: blue;
  width: 280px;
  height: 24vh;
  box-sizing: border-box;
`;

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
const CardDesc = styled.div`
  margin-top: 48px;
`;
const CardImage = styled.img`
  height: 130px;
  background-color: aliceblue;
  margin: 0 auto;
`;
const CardBox = styled.div`
  background-color: orange;
  box-sizing: border-box;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  min-width: 300px;
`;
const SubTitle = styled.h2`
  font-weight: 500;
  letter-spacing: -0.6px;
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
`;
const Box = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 420px;
  padding: 24px;
  background-color: yellowgreen;
  position: relative;
  overflow: hidden;
`;
const GlobalStyle = createGlobalStyle`
  body {
    overflow: ${(props) => (props.isModalOpen ? 'hidden' : 'auto')}
  }
  p{
    margin: 0;
  /* white-space: nowrap; */
  }
  `;
