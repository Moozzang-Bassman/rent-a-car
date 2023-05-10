import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { memo } from 'react';

const CarListBox = memo(function ({
  setIsModalOpen,
  data,
  showList,
  setDetailInfo,
  scrollRef,
  setCarList,
  carList,
  setShowList,
}) {
  const cardBoxClickHandler = (id) => {
    setIsModalOpen(true);
    axios.get(`http://localhost:8080/carClasses/${id}`).then((response) => {
      setDetailInfo(...response.data);
    });
  };
  const showCarListAddButtonHandler = () => {
    setCarList(carList + 5);
    const addCarList = data.slice(carList, carList + 5);
    const copy = [...showList];
    const newArr = copy.concat(addCarList);
    setShowList(newArr);
  };

  return (
    <>
      <div style={{ marginTop: '24px' }}>
        <SubTitle>모든 차량</SubTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {showList?.map((item) => {
            return (
              <CardBox
                key={item.carClassId}
                onClick={() => {
                  cardBoxClickHandler(item.carClassId);
                }}
                ref={(el) => {
                  scrollRef.current[item.carClassId] = el;
                }}
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
    </>
  );
});

export default CarListBox;

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
  font-size: 1rem;
  font-weight: 700;
  border-radius: 8px;
`;
const TagWrapper = styled.div`
  display: flex;
`;
const Tag = styled.div`
  padding: 0 12px;
  height: 28px;
  border-radius: 8px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  background-color: #e8ebee;
  color: #757f8b;
  font-weight: 600;
  white-space: nowrap;
`;
const CardBox = styled.div`
  background-color: white;
  box-shadow: 0 0 5px lightgray;
  border-radius: 1rem;
  box-sizing: border-box;
  padding: 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;
const SubTitle = styled.h2`
  font-weight: 500;
  letter-spacing: -0.6px;
`;
const CardImage = styled.img`
  width: 100%;
`;
const CardDesc = styled.div`
  margin-top: 24px;
`;
const NonameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const CarTitle = styled.p`
  font-weight: 600;
`;
const CarDesc = styled.p`
  font-size: 0.9rem;
  color: #7b7b7b;
`;
