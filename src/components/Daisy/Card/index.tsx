// Card.js
import React from "react";
import Image from "next/image";

const Card = ({ imageUrl, title, description, price, add }) => {
  return (
    <div className="card w-70 bg-base-100  shadow-xl">
      <figure>
        <Image src={imageUrl} alt="Card Image" width={300} height={300} />
      </figure>
      <div className="card-body bg-white ">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="flex justify-between items-center">
          <span>{price}₺</span>
          {add && (
            <div className="card-actions justify-end">
              <button className="btn btn-primary" onClick={add}>
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
