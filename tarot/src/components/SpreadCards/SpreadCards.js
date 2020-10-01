import React from "react";
import { spreadTypes } from "../../helpers";
import "./SpreadCards.sass";

const SpreadCards = ({ cards, spreadType, showSpreadDescription }) => {
  const spread = spreadTypes[spreadType];
  const amountCards = () => {
    if (spread.amountCards === 1) {
      return "单";
    }
    if (spread.amountCards === 3) {
      return "三";
    }
  };
  const spreadDescription = spread.description;

  const buildSpreadDescription = () => (
    <div>
      <h4>{amountCards()}牌牌阵</h4>
      <p className="spreadDescription">{spreadDescription}</p>
    </div>
  );

  const classNames = () => ["spread-cards", spread.className].join(" ");

  return (
    <div className={classNames()}>
      <div className="cards">{cards}</div>
      {showSpreadDescription && buildSpreadDescription()}
    </div>
  );
};

export default SpreadCards;
