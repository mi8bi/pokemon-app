import { Pokemon } from "@/utils/pokemon";

type CardProps = {
  pokemon: Pokemon;
};

const Card = ({ pokemon }: CardProps) => {
  return (
    <div className="w-72 rounded-lg shadow-lg p-4 bg-white mx-auto text-center">
      <div className="cardImg">
        <img
          className="mx-auto h-24 object-contain"
          src={pokemon.sprites?.front_default || ""}
          alt="pokemon"
        />
        <h3 className="p-0 text-2xl font-bold mb-1 mt-0">{pokemon.name}</h3>
        <div className="cardTypes">
          <div>タイプ</div>
          {pokemon.types?.map((type, i) => {
            return (
              <div key={i}>
                <span className="typeName">{type.type.name}</span>
              </div>
            );
          })}
        </div>
        <div>
          <div className="cardData">
            <p className="title">重さ: {pokemon.weight}</p>
          </div>
          <div className="cardData">
            <p className="title">高さ: {pokemon.height}</p>
          </div>
          <div className="cardData">
            <p className="title">
              アビリティ: {pokemon.abilities?.[0]?.ability.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
