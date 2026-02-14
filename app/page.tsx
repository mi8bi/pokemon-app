"use client";

import Card from "@/components/Card/Card";
import { getAllPokemon, getPokemon, Pokemon } from "@/utils/pokemon";
import { useEffect, useState } from "react";
import {
  getJapaneseName,
  getJapaneseType,
  getJapaneseAbility,
} from "@/utils/translations";

export default function Home() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon?limit=151";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [allPokemonData, setAllPokemonData] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "type" | "ability">(
    "name",
  );
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      // 全てのポケモンデータを取得（第1世代151匹）
      const res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細なデータを取得
      const _pokemonData = await Promise.all(
        res.results.map((pokemon) => getPokemon(pokemon.url)),
      );
      setAllPokemonData(_pokemonData);
      // 最初のページを表示
      setPokemonData(_pokemonData.slice(0, itemsPerPage));
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const handleNextPage = () => {
    if (searchTerm) return; // 検索中はページネーション無効
    const nextPage = currentPage + 1;
    const start = nextPage * itemsPerPage;
    const end = start + itemsPerPage;
    if (start < allPokemonData.length) {
      setPokemonData(allPokemonData.slice(start, end));
      setCurrentPage(nextPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (searchTerm) return; // 検索中はページネーション無効
    if (currentPage === 0) return;
    const prevPage = currentPage - 1;
    const start = prevPage * itemsPerPage;
    const end = start + itemsPerPage;
    setPokemonData(allPokemonData.slice(start, end));
    setCurrentPage(prevPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      // 検索クリア: 最初のページに戻る
      setCurrentPage(0);
      setPokemonData(allPokemonData.slice(0, itemsPerPage));
      return;
    }

    const filtered = allPokemonData.filter((pokemon) => {
      const term = searchTerm.toLowerCase();

      switch (searchType) {
        case "name":
          const japaneseName = getJapaneseName(pokemon.name).toLowerCase();
          const englishName = pokemon.name.toLowerCase();
          return japaneseName.includes(term) || englishName.includes(term);

        case "type":
          return pokemon.types?.some((type) => {
            const japaneseType = getJapaneseType(type.type.name).toLowerCase();
            const englishType = type.type.name.toLowerCase();
            return japaneseType.includes(term) || englishType.includes(term);
          });

        case "ability":
          return pokemon.abilities?.some((ability) => {
            const japaneseAbility = getJapaneseAbility(
              ability.ability.name,
            ).toLowerCase();
            const englishAbility = ability.ability.name.toLowerCase();
            return (
              japaneseAbility.includes(term) || englishAbility.includes(term)
            );
          });

        default:
          return false;
      }
    });

    setPokemonData(filtered);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(0);
    setPokemonData(allPokemonData.slice(0, itemsPerPage));
  };

  const totalPages = Math.ceil(allPokemonData.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  return (
    <div className="w-full min-h-screen mt-2 md:mt-4 px-2 md:px-4 pb-8">
      {/* 検索セクション */}
      <div className="max-w-4xl mx-auto mb-4 md:mb-8 bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800">
          ポケモン検索
        </h2>
        <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
          第1世代のポケモン（全151匹）から検索できます
        </p>

        <div className="flex flex-col gap-3 md:gap-4">
          {/* 検索タイプ選択 */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSearchType("name")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg transition-colors ${
                searchType === "name"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              名前で検索
            </button>
            <button
              onClick={() => setSearchType("type")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg transition-colors ${
                searchType === "type"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              タイプで検索
            </button>
            <button
              onClick={() => setSearchType("ability")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg transition-colors ${
                searchType === "ability"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              アビリティで検索
            </button>
          </div>

          {/* 検索入力 */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder={
                searchType === "name"
                  ? "例: ピカチュウ、pikachu"
                  : searchType === "type"
                    ? "例: でんき、electric"
                    : "例: せいでんき、static"
              }
              className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 sm:flex-none px-4 md:px-6 py-2 text-sm md:text-base bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                検索
              </button>
              <button
                onClick={handleClearSearch}
                className="flex-1 sm:flex-none px-4 md:px-6 py-2 text-sm md:text-base bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                クリア
              </button>
            </div>
          </div>
        </div>

        {/* 検索結果表示 */}
        {searchTerm && (
          <div className="mt-3 md:mt-4 text-sm md:text-base text-gray-600">
            検索結果: {pokemonData.length} 件
          </div>
        )}
      </div>

      {/* ポケモンカード表示 */}
      {loading ? (
        <div className="text-center text-xl md:text-2xl font-bold">
          ロード中...
        </div>
      ) : (
        <>
          {pokemonData.length === 0 ? (
            <div className="text-center text-lg md:text-xl text-gray-600 mt-8">
              該当するポケモンが見つかりませんでした
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 place-items-center mb-6 md:mb-8">
                {pokemonData.map((pokemon, i) => (
                  <Card key={i} pokemon={pokemon} />
                ))}
              </div>

              {/* ページネーション（検索時は非表示） */}
              {!searchTerm && (
                <div className="flex flex-col items-center gap-3 md:gap-4">
                  <div className="text-sm md:text-base text-gray-600">
                    ページ {currentPage + 1} / {totalPages}
                  </div>
                  <div className="flex justify-center items-center gap-3 md:gap-5">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={!hasPrevPage}
                      className={`px-6 md:px-8 py-2 md:py-3 text-sm md:text-base border-none rounded-lg shadow-lg text-white cursor-pointer
                      transition-all duration-300 ease-in-out
                      ${
                        hasPrevPage
                          ? "bg-indigo-500 hover:translate-y-1.5 hover:shadow-none"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      前へ
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={!hasNextPage}
                      className={`px-6 md:px-8 py-2 md:py-3 text-sm md:text-base border-none rounded-lg shadow-lg text-white cursor-pointer
                      transition-all duration-300 ease-in-out
                      ${
                        hasNextPage
                          ? "bg-indigo-500 hover:translate-y-1.5 hover:shadow-none"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      次へ
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
