import { Pokemon } from "@/utils/pokemon";
import {
  getJapaneseName,
  getJapaneseType,
  getJapaneseAbility,
} from "@/utils/translations";

type CardProps = {
  pokemon: Pokemon;
};

const Card = ({ pokemon }: CardProps) => {
  return (
    <div className="w-full max-w-xs sm:w-72 rounded-lg shadow-lg p-3 sm:p-4 bg-white mx-auto text-center">
      <div className="cardImg">
        <img
          className="mx-auto h-20 sm:h-24 object-contain"
          src={pokemon.sprites?.front_default || ""}
          alt="pokemon"
        />
        <h3 className="p-0 text-xl sm:text-2xl font-bold mb-1 mt-0">
          {getJapaneseName(pokemon.name)}
        </h3>
        <div className="cardTypes">
          <div className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
            タイプ
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {pokemon.types?.map((type, i) => {
              return (
                <span
                  key={i}
                  className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm"
                >
                  {getJapaneseType(type.type.name)}
                </span>
              );
            })}
          </div>
        </div>
        <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-700">
          <div className="cardData">
            <p className="title">重さ: {pokemon.weight}</p>
          </div>
          <div className="cardData">
            <p className="title">高さ: {pokemon.height}</p>
          </div>
          <div className="cardData">
            <p className="title">
              アビリティ:{" "}
              {getJapaneseAbility(pokemon.abilities?.[0]?.ability.name || "")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
