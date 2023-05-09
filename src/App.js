import './App.css';
import styled from 'styled-components';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Modal from './Modal';
import { createGlobalStyle } from 'styled-components';

function App() {
  const slideBoxWidth = 280;

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchMoveDistance, setTouchMoveDistance] = useState(0);
  const [isDragStart, setIsDragStart] = useState(false);
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

  // async/await 로 바꾸자
  const cardBoxClickHandler = (id) => {
    setIsModalOpen(true);
    axios.get(`http://localhost:8080/carClasses/${id}`).then((response) => {
      setDetailInfo(...response.data);
    });
  };
  // 특가 차량 뽑아냄
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

  const showCarListAddButtonHandler = () => {
    setCarList(carList + 5);
    const addCarList = data.slice(carList, carList + 5);
    const copy = [...showList];
    const newArr = copy.concat(addCarList);
    setShowList(newArr);
    console.log(newArr);
  };

  return (
    <>
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
              id="slide-container"
              specialPriceLength={specialPriceLength}
              slide={slide}
              touchMoveDistance={touchMoveDistance}
              slideBoxWidth={slideBoxWidth}
              isDragStart={isDragStart}
            >
              {specialPriceItem?.map((item, index) => {
                return (
                  <SlideBox
                    key={index}
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

          <div style={{ marginTop: '24px' }}>
            <SubTitle>모든 차량</SubTitle>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              {showList?.map((item) => {
                return (
                  <CardBox
                    key={item.carClassId}
                    onClick={() => cardBoxClickHandler(item.carClassId)}
                  >
                    <CardImage draggable="false" src={item.image}></CardImage>
                    <CardDesc>
                      <NonameWrapper>
                        <div>
                          <CarTitle>{item.carClassName}</CarTitle>
                          <CarDesc>
                            {item.price}원
                            <span style={{ color: '#0eb8ff' }}>
                              {item.discountPercent > 0 &&
                                ` (-${item.discountPercent}%)`}
                            </span>
                          </CarDesc>
                        </div>
                        <TagWrapper>
                          {item.carTypeTags.map((item, index) => {
                            return <Tag key={[index]}>{item}</Tag>;
                          })}
                        </TagWrapper>
                      </NonameWrapper>
                      <CarDesc>
                        {`${item.year}년 | ${item.drivingDistance}km | ${item.regionGroups}`}
                      </CarDesc>
                    </CardDesc>
                  </CardBox>
                );
              })}
            </div>
          </div>
          <ButtonBox>
            {carList < data?.length ? (
              <Button onClick={showCarListAddButtonHandler}>더 보기</Button>
            ) : null}
          </ButtonBox>
        </Box>
      </Layout>
    </>
  );
}

export default App;
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
  /* margin-right: 0; */

  /* background-color: aqua; */
`;
const SlideBox = styled.div`
  /* border: 1px solid black; */
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
const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  margin: 24px 0;
`;
const Button = styled.button`
  cursor: pointer;
  border: none;
  height: 40px;
  color: white;
  background-color: #0eb8ff;
  padding: 0 16px;
  /* font-weight: 600; */
  font-size: 1rem;
  font-weight: 700;
  border-radius: 8px;
  /* &:hover {
    opacity: 0.8;
  } */
`;
const TagWrapper = styled.div`
  display: flex;
`;
const Tag = styled.div`
  width: 64px;
  height: 28px;
  /* border: 1px solid; */
  border-radius: 8px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  background-color: #e8ebee;
  color: #757f8b;
  font-weight: 600;
`;
const CardDesc = styled.div`
  margin-top: 24px;
`;
const CardImage = styled.img`
  height: ${(props) => (props.imageSize === 'small' ? '100px' : '150px')};
  margin: 0 auto;
`;
const CardBox = styled.div`
  background-color: white;
  /* border: 1px solid black; */
  box-shadow: 0 0 5px lightgray;
  border-radius: 1rem;
  box-sizing: border-box;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  /* min-width: 300px; */
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
  /* padding-bottom: 24px; */
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
const GlobalStyle = createGlobalStyle`
  body {
    overflow: ${(props) => (props.isModalOpen ? 'hidden' : 'auto')};
    
  }
  p {
    margin: 0;
  }
  `;
