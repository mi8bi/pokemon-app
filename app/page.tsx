"use client";

import Card from "@/components/Card/Card";
import {
  getAllPokemon,
  getPokemon,
  NamedAPIResource,
  Pokemon,
} from "@/utils/pokemon";
import { useEffect, useState } from "react";

export default function Home() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>("");
  const [prevUrl, setPrevUrl] = useState<string | null>("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータを取得
      const res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data: NamedAPIResource[]) => {
    const _pokemonData = await Promise.all(
      data.map((pokemon) => {
        const pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  const handleNextPage = async () => {
    setLoading(true);
    const data = await getAllPokemon(nextUrl || "");
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  const handlePrevPage = async () => {
    if (!prevUrl) return;
    setLoading(true);
    const data = await getAllPokemon(prevUrl || "");
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  return (
    <div className="w-full h-screen mt-4">
      {loading ? (
        <h1>ロード中</h1>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6 place-items-center">
            {pokemonData.map((pokemon, i) => (
              <Card key={i} pokemon={pokemon} />
            ))}
          </div>
          <div className="px-0 py-8 flex justify-center items-center gap-5">
            <button
              type="button"
              onClick={handlePrevPage}
              className="px-8 py-3 bg-indigo-500 border-none rounded-lg shadow-lg text-white cursor-pointer
              hover:translate-y-1.5 hover:shadow-none
              transition-all duration-300 ease-in-out"
            >
              前へ
            </button>
            <button
              type="button"
              onClick={handleNextPage}
              className="px-8 py-3 bg-indigo-500 border-none rounded-lg shadow-lg text-white cursor-pointer
              hover:translate-y-1.5 hover:shadow-none
              transition-all duration-300 ease-in-out"
            >
              次へ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
