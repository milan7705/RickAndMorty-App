import { useInfiniteQuery } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { CharactersResponse, Character } from "../types/characters";
import { rickApi } from "../api/axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const fetchCharacters = async ({
  pageParam = 1,
  queryKey,
}: QueryFunctionContext<[string, string]>): Promise<CharactersResponse> => {
  const [, searchTerm] = queryKey;
  const res = await rickApi.get(`/character`, {
    params: { page: pageParam, name: searchTerm },
  });
  return res.data;
};

const Characters = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(delay);
  }, [search]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["characters", debouncedSearch] as [string, string],
      queryFn: fetchCharacters,
      getNextPageParam: (lastPage) => {
        const nextUrl = lastPage.info.next;
        if (!nextUrl) return undefined;
        const url = new URL(nextUrl);
        const next = url.searchParams.get("page");
        return next ? parseInt(next) : undefined;
      },
      refetchInterval: undefined,
      initialPageParam: undefined,
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Characters</h1>
      <input
        type="text"
        placeholder="Search for Character..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full px-4 py-2 border outline-none border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#97CE4C]"
      />
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data?.pages.map((page) =>
          page.results.map((char: Character) => (
            <Link
              to={`/characters/${char.id}`}
              key={char.id}
              className="group bg-white pb-2 rounded shadow text-center transform transition-transform duration-300 ease-in-out hover:scale-105 border-4 hover:border-[#97CE4C]"
            >
              <img src={char.image} alt={char.name} className="rounded mb-2" />
              <h3 className="font-semibold text-gray-800 group-hover:text-[#00B1CA] transition-colors duration-300">
                {char.name}
              </h3>
            </Link>
          ))
        )}
      </div>

      <div ref={loadMoreRef} className="h-10" />
      {isFetchingNextPage && (
        <p className="text-center mt-4">Loading more...</p>
      )}
    </div>
  );
};

export default Characters;
