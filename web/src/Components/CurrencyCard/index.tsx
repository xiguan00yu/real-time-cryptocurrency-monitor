import React from "react";
import "./styles.css";

const Card: React.FC<{
  name: string;
  price: number;
  volume: number;
}> = ({ name, price, volume }) => {
  return (
    <div className="card">
      <h2>{name}</h2>
      <h3>${price}</h3>
      <p>volume: </p>
      <p>{volume}</p>
    </div>
  );
};

export default Card;
