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
    console.log(e.clientX - touchStartX);
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
          {/* <div> */}
          <div>
            <SubTitle>특가 차량</SubTitle>
          </div>
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
                  onMouseLeave={(e) => {
                    setIsDragStart(false);
                  }}
                ></SlideBox>
              );
            })}
          </SlideBoxContainer>
          {/* </div> */}
          {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => {
                if (slide < -(300 * (specialPriceLength - 2))) {
                  return;
                }
                if (클릭횟수 < specialPriceItem.length) {
                  set클릭횟수(클릭횟수 + 1);
                }
                if (클릭횟수 === 0) {
                  setSlide(slide - 270);
                } else if (클릭횟수 === specialPriceItem.length - 2) {
                  setSlide(slide - 270);
                } else {
                  setSlide(slide - 300);
                }
              }}
            >
              슬라이드+
            </button>
            <button
              onClick={() => {
                if (클릭횟수 <= 0) {
                  return;
                }
                set클릭횟수(클릭횟수 - 1);
                if (slide >= 0) {
                  return;
                }
                setSlide(slide + 300);
                if (클릭횟수 === 1) {
                  setSlide(slide + 270);
                }
                if (클릭횟수 === specialPriceItem.length - 1) {
                  setSlide(slide + 270);
                }
              }}
            >
              슬라이드-
            </button>
          </div> */}

          <div>
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
              <Button onClick={showCarListAddButtonHandler}>더보기</Button>
            ) : null}
          </ButtonBox>
        </Box>
      </Layout>
    </>
  );
}

export default App;
const SlideBoxContainer = styled.div`
  /* 박스 갯수마다 300px씩 */
  width: ${(props) =>
    `${
      props.specialPriceLength * props.slideBoxWidth +
      (props.specialPriceLength - 1) * 20
    }px`};

  display: flex;
  /* padding: 24px; */

  /* 300px씩 움직인다 */
  /* slidebox 너비 280px + gap 20px */
  transform: ${(props) =>
    props.isDragStart
      ? `translateX(${props.touchMoveDistance}px)`
      : `translateX(${props.slide}px)`};
  transition: ${(props) => (props.isDragStart ? '' : 'transform .3s')};

  gap: 20px;

  background-color: aqua;
`;
const SlideBox = styled.div`
  background-color: blue;
  min-width: ${(props) => `${props.slideBoxWidth}px`};
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
  /* background-color: aliceblue; */
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
  /* background-color: yellowgreen; */
  position: relative;
  overflow: hidden;
`;
const GlobalStyle = createGlobalStyle`
  body {
    overflow: ${(props) => (props.isModalOpen ? 'hidden' : 'auto')}
  }
  p {
    margin: 0;
  }
  `;
