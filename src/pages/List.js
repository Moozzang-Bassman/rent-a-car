import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Modal from '../components/Modal';
import { createGlobalStyle } from 'styled-components';
import { useRef } from 'react';

import CarListBox from '../components/CarListBox';

function List() {
  const slideBoxWidth = 280;

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchMoveDistance, setTouchMoveDistance] = useState(0);
  const [isDragStart, setIsDragStart] = useState(false);
  const [touchEndX, setTouchEndX] = useState(0);
  const [carList, setCarList] = useState(5);
  const [slide, setSlide] = useState(0);
  const [data, setData] = useState([]);
  const [detailInfo, setDetailInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showList, setShowList] = useState([]);

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
      const newArr2 = newArr.slice(0, carList);
      setShowList(newArr2);
      setData(newArr);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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

  const specialPriceItem = data?.filter((item) => {
    if (item.carTypeTags.includes('특가')) {
      return item;
    }
  });

  let specialPriceLength = specialPriceItem?.length;

  const touchStartHandler = (e) => {
    setIsDragStart(true);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchMoveDistance(slide);
  };
  const touchMoveHandler = (e) => {
    setTouchMoveDistance(slide + (e.targetTouches[0].clientX - touchStartX));
  };
  const touchEndHandler = (e) => {
    setIsDragStart(false);
    if (
      touchMoveDistance <= 0 &&
      touchMoveDistance > (specialPriceLength - 1) * -300
    ) {
      if (e.changedTouches[0].clientX - touchStartX < -50) {
        setSlide(slide - 300);
      } else if (e.changedTouches[0].clientX - touchStartX > 50) {
        setSlide(slide + 300);
      }
    }
  };

  const clickStartHandler = (e) => {
    setIsDragStart(true);
    setTouchStartX(e.clientX);

    setTouchMoveDistance(slide);
  };
  const clickMoveHandler = (e) => {
    setTouchMoveDistance(slide + (e.clientX - touchStartX));
  };
  const clickEndHandler = (e) => {
    setIsDragStart(false);
    setTouchEndX(e.clientX);

    if (
      touchMoveDistance <= 0 &&
      touchMoveDistance > (specialPriceLength - 1) * -300
    ) {
      if (e.clientX - touchStartX < -50) {
        setSlide(slide - 300);
      } else if (e.clientX - touchStartX > 50) {
        setSlide(slide + 300);
      }
    }
  };

  const scrollRef = useRef([]);
  const handleScroll = (ref) => {
    ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div>
      <GlobalStyle isModalOpen={isModalOpen} />
      <Layout>
        {isModalOpen ? (
          <Modal
            isModalOpen={isModalOpen}
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

          <div
            style={{
              marginTop: '36px',
              paddingBottom: '32px',

              borderBottom: '1px solid #DDDDDD',
            }}
          >
            <SubTitle>특가 차량</SubTitle>

            <SlideBoxContainer
              specialPriceLength={specialPriceLength}
              slide={slide}
              touchMoveDistance={touchMoveDistance}
              slideBoxWidth={slideBoxWidth}
              isDragStart={isDragStart}
            >
              {specialPriceItem?.map((item, index) => {
                return (
                  <SlideBox
                    key={item.carClassId}
                    slideBoxWidth={slideBoxWidth}
                    onTouchStart={touchStartHandler}
                    onTouchMove={touchMoveHandler}
                    onTouchEnd={touchEndHandler}
                    onMouseDown={clickStartHandler}
                    onMouseMove={clickMoveHandler}
                    onMouseUp={clickEndHandler}
                    onMouseLeave={() => {
                      setIsDragStart(false);
                    }}
                    onClick={() => {
                      const currentId = item.carClassId;
                      if (
                        showList.find((item) => {
                          return item.carClassId === currentId;
                        }) &&
                        touchEndX === touchStartX
                      ) {
                        handleScroll(scrollRef.current[item.carClassId]);
                      }
                    }}
                  >
                    <CardImage
                      imageSize="small"
                      src={item.image}
                      draggable="false"
                    ></CardImage>
                    <CardDesc>
                      <NonameWrapper>
                        <div>
                          <CarTitle>{item.carClassName}</CarTitle>
                          <CarDesc>{item.price}원</CarDesc>
                          <CarDesc>
                            {`${item.year}년 | ${item.drivingDistance}km | ${item.regionGroups}`.slice(
                              0,
                              20
                            )}
                            <span style={{ marginLeft: '4px' }}>・・・</span>
                          </CarDesc>
                        </div>
                      </NonameWrapper>
                    </CardDesc>
                  </SlideBox>
                );
              })}
            </SlideBoxContainer>
          </div>

          <CarListBox
            setIsModalOpen={setIsModalOpen}
            data={data}
            showList={showList}
            setDetailInfo={setDetailInfo}
            scrollRef={scrollRef}
            setCarList={setCarList}
            carList={carList}
            setShowList={setShowList}
          ></CarListBox>
        </Box>
      </Layout>
    </div>
  );
}

export default List;
const GlobalStyle = createGlobalStyle`
  body {
    overflow: ${(props) => (props.isModalOpen ? 'hidden' : 'auto')};
    
  }
  p {
    margin: 0;
  }
  `;
const CarTitle = styled.p`
  font-weight: 600;
`;
const CarDesc = styled.p`
  font-size: 0.9rem;
  color: #7b7b7b;
`;
const SlideBoxContainer = styled.div`
  /* 박스 갯수마다 300px씩 */
  width: ${(props) =>
    `${
      props.specialPriceLength * props.slideBoxWidth +
      (props.specialPriceLength - 1) * 20
    }px`};

  display: flex;
  transform: ${(props) =>
    props.isDragStart
      ? `translateX(${props.touchMoveDistance}px)`
      : `translateX(${props.slide}px)`};
  transition: ${(props) => (props.isDragStart ? '' : 'transform .3s')};
  gap: 20px;
`;
const SlideBox = styled.div`
  border-radius: 1rem;
  min-width: ${(props) => `${props.slideBoxWidth}px`};
  box-shadow: 0 0 5px lightgray;
  background-color: white;
  box-sizing: border-box;
  padding: 16px 28px;
  display: flex;
  flex-direction: column;
`;

const NonameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardDesc = styled.div`
  margin-top: 24px;
`;
const CardImage = styled.img`
  width: 100%;
`;

const SubTitle = styled.h2`
  font-weight: 500;
  letter-spacing: -0.6px;
`;
const TitleBox = styled.div`
  display: flex;
  justify-content: center;
`;
const Title = styled.h1`
  font-size: 30px;
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.9px;
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
  background-color: #f7f8f9;
  position: relative;
  overflow: hidden;
`;
